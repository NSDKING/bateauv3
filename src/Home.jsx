import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import tankImage from './assets/tank.png'; // Adjust the path according to your project structure
import { API, graphqlOperation } from 'aws-amplify';
import { createCarburants } from './graphql/mutations'; // Adjust the path according to your project structure

const server_address = 'ny3.blynk.cloud';
const token = '2h0H5T7PqqatXJrU_yIFm67xcWA8sTY9';
const pin = 'V0'; // Encoded pin name
const initialTemp = 23.5; // Initial temperature in degrees Celsius
const initialDensimetry = 0.5; // Initial densimetry level

export default function Home() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tempLevel, setTempLevel] = useState(initialTemp);
  const [densiLevel, setDensiLevel] = useState(initialDensimetry);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    const tempInterval = setInterval(updateTemperature, 4000); // Update temperature every 4 seconds
    const densiInterval = setInterval(updateDensimetry, 4000); // Update densimetry every 4 seconds
    return () => {
      clearInterval(tempInterval);
      clearInterval(densiInterval);
    };
  }, []);

  useEffect(() => {
    if (data) {
      saveCarburantLevelDaily();
      console.log(data)

    }
  }, [data]);

  const fetchData = async () => {
    try {
      const apiEndpoint = `https://${server_address}/external/api/getAll?token=${token}`;
      const response = await axios.get(apiEndpoint);
      setData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  const FuelLevel = data && data.v0 ? parseFloat(data.v0) : 0;

  function updateTemperature() {
    const randomChange = (Math.random() - 0.5) * 0.6;
    let newTemp = tempLevel + randomChange;
    newTemp = parseFloat(newTemp.toFixed(1)); // Convert to number and round to one decimal place
    setTempLevel(newTemp);
  }

  function updateDensimetry() {
    const randomChange = (Math.random() - 0.5) * 0.2;
    let newDensi = densiLevel + randomChange;
    newDensi = parseFloat(newDensi.toFixed(2)); // Convert to number and round to two decimal places
    setDensiLevel(newDensi);
  }

  const handleGpsButtonClick = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
      window.open(googleMapsUrl, '_blank');
    });
  };

  const saveCarburantLevelDaily = async () => {
    const currentDate = new Date().toISOString().split('T')[0];  
    const savedData = JSON.parse(localStorage.getItem('carburantLevels')) || [];
     // Check if we have already saved data for the current date
    const alreadySaved = savedData.some(entry => entry.date === currentDate);

    if (!alreadySaved) {
      const newEntry = { level: FuelLevel };
      savedData.push(newEntry);
      localStorage.setItem('carburantLevels', JSON.stringify(savedData));
      console.log('Carburant level saved:', newEntry);
      console.log('start')

      // Save to backend
      try {
        const result = await API.graphql(graphqlOperation(createCarburants, {
          input: {
            level: FuelLevel,
           }
        }));
        console.log('Carburant level saved to backend:', result);
      } catch (error) {
        console.error('Error saving carburant level to backend:', error.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center">
      <div className="flex w-full max-w-6xl space-x-4">
        <div className="w-1/3 bg-white rounded-lg shadow-lg overflow-hidden p-4 relative flex justify-center items-center">
          <div className="bg-green-500 absolute bottom-0 w-full" style={{ height: `${0 * 100}%` }} />
          <p className="text-center absolute w-full bottom-0 p-6 bg-white bg-opacity-50 text-2xl font-bold cursor-pointer">
            Densimetry: {0}
          </p>
        </div>
        <div className="flex flex-col items-center justify-center w-2/3 space-y-4">
          <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
            <h1 className="text-2xl font-bold p-4">Fuel, Temperature</h1>
            <div className="flex justify-around p-4">
              <div className="w-1/2 bg-gray-300 h-64 relative mr-2" onClick={() => navigate('/carburants')}>
                <div className="bg-blue-500 absolute bottom-0" style={{ height: `${FuelLevel}%`, width: '100%' }} />
                <p className="text-center absolute w-full bottom-0 p-4 bg-white bg-opacity-50">Fuel Level:{(FuelLevel.toFixed(2) / 100 * 19.23).toFixed(3)}
                </p>
              </div>
              <div className="w-1/2 bg-gray-300 h-64 relative mx-2">
                <div className="bg-red-500 absolute bottom-0" style={{ height: `${tempLevel}%`, width: '100%' }} />
                <p className="text-center absolute w-full bottom-0 p-4 bg-white bg-opacity-50">Temperature: {tempLevel}°C</p>
              </div>
            </div>
          </div>
          <div className="relative w-full h-64">
            <img src={tankImage} alt="Tank" className="w-full h-full object-contain" />
          </div>
          <button
            onClick={handleGpsButtonClick}
            className="mt-4 px-6 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600"
          >
            Open in Google Maps
          </button>
        </div>
      </div>
    </div>
  );
}
