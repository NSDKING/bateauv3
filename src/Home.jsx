import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import tankImage from './assets/tank.png'; // Adjust the path according to your project structure
import { API, graphqlOperation } from 'aws-amplify';
import { createCarburants } from './graphql/mutations'; // Adjust the path according to your project structure
import { Line } from 'react-chartjs-2'; // Import the Line chart component
import { Chart, LinearScale, CategoryScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js'; // Import necessary components

// Register the components
Chart.register(LinearScale, CategoryScale, PointElement, LineElement, Tooltip, Legend);

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
  const [historicalData, setHistoricalData] = useState({
    temperature: [22.5, 23.0, 23.5, 24.0, 24.5], // Sample temperature data
    densimetry: [0.45, 0.48, 0.50, 0.52, 0.55], // Sample densimetry data
    fuelLevel: [10, 20, 30, 40, 50], // Sample fuel level data
  }); // New state for historical data
  const navigate = useNavigate();
  const [expandedChart, setExpandedChart] = useState(null); // State to track which chart is expanded

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
      updateHistoricalData(); // Update historical data when new data is fetched
      console.log(data);
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

  const updateHistoricalData = () => {
    setHistoricalData(prev => ({
      temperature: [...prev.temperature, tempLevel],
      densimetry: [...prev.densimetry, densiLevel],
      fuelLevel: [...prev.fuelLevel, FuelLevel], // Track fuel levels
    }));
  };

  const toggleChartSize = (chart) => {
    setExpandedChart(expandedChart === chart ? null : chart); // Toggle the expanded chart
  };

  return (
    <div className={`min-h-screen bg-gray-100 flex flex-col ${expandedChart ? 'overflow-hidden' : ''}`}>
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 text-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm">Monitoring Temperature, Densimetry, and Fuel Levels</p>
      </header>
      <div className={`flex-grow p-4 transition-all duration-300 ${expandedChart ? 'hidden' : 'flex justify-center items-center'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl mx-auto">
          {['temperature', 'densimetry', 'fuelLevel'].map((chart, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-4 transition-transform transform hover:scale-105"
              onClick={() => toggleChartSize(chart)}
            >
              <h2 className="text-xl font-bold mb-2">{`${chart.charAt(0).toUpperCase()}${chart.slice(1)} Over Time`}</h2>
              <Line
                data={{
                  labels: historicalData[chart].map((_, i) => i + 1),
                  datasets: [
                    {
                      label:
                        chart === 'temperature'
                          ? 'Temperature (°C)'
                          : chart === 'densimetry'
                          ? 'Densimetry (g/cm³)'
                          : 'Fuel Level (L)',
                      data: historicalData[chart],
                      borderColor: chart === 'temperature' ? 'rgba(255, 99, 132, 1)' : chart === 'densimetry' ? 'rgba(54, 162, 235, 1)' : 'rgba(75, 192, 192, 1)',
                      backgroundColor: chart === 'temperature' ? 'rgba(255, 99, 132, 0.2)' : chart === 'densimetry' ? 'rgba(54, 162, 235, 0.2)' : 'rgba(75, 192, 192, 0.2)',
                      fill: true,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: true },
                    tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: ${ctx.raw}` } },
                  },
                  scales: { y: { beginAtZero: true } },
                }}
              />
            </div>
          ))}
        </div>
      </div>


      {expandedChart && (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-4xl relative">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              onClick={() => setExpandedChart(null)}
            >
              Close
            </button>
            <h2 className="text-xl font-bold mb-2">
              {expandedChart.charAt(0).toUpperCase() + expandedChart.slice(1)} Over Time
            </h2>
            <Line
              data={{
                labels: historicalData[expandedChart].map((_, i) => i + 1),
                datasets: [
                  {
                    label: expandedChart === 'temperature' 
                      ? 'Temperature (°C)' 
                      : expandedChart === 'densimetry' 
                      ? 'Densimetry (g/cm³)' 
                      : 'Fuel Level (L)',
                    data: historicalData[expandedChart],
                    borderColor: expandedChart === 'temperature' 
                      ? 'rgba(255, 99, 132, 1)' 
                      : expandedChart === 'densimetry' 
                      ? 'rgba(54, 162, 235, 1)' 
                      : 'rgba(75, 192, 192, 1)',
                    backgroundColor: expandedChart === 'temperature' 
                      ? 'rgba(255, 99, 132, 0.2)' 
                      : expandedChart === 'densimetry' 
                      ? 'rgba(54, 162, 235, 0.2)' 
                      : 'rgba(75, 192, 192, 0.2)',
                    fill: true,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: { legend: { display: true } },
                scales: { y: { beginAtZero: true } },
              }}
            />
          </div>
        </div>
      )}



      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p className="text-sm">© 2023 Your Company. All rights reserved.</p>
      </footer>
    </div>
  );
}
