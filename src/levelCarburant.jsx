// src/pages/CarburantsPage.js
import React, { useState, useEffect } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { listCarburants } from './graphql/queries';

const CarburantsPage = () => {
  const [carburantList, setCarburantList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCarburantList = async () => {
    try {
      const response = await API.graphql(graphqlOperation(listCarburants));
      setCarburantList(response.data.listCarburants.items);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarburantList();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">Carburant Levels</h1>
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Level</th>
              <th className="py-2 px-4 border-b">date</th>
             </tr>
          </thead>
          <tbody>
            {carburantList.map((carburant) => (
              <tr key={carburant.id} className="hover:bg-gray-100 cursor-pointer">
                <td className="py-2 px-4 border-b">{carburant.id}</td>
                <td className="py-2 px-4 border-b">{carburant.level}</td>
                <td className="py-2 px-4 border-b">{new Date(carburant.createdAt).toLocaleString()}</td>
               </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CarburantsPage;
