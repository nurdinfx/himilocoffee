import { useState, useEffect } from 'react';
import api from '../services/api';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
       try {
          const { data } = await api.get('/restaurants');
          setRestaurants(data);
       } catch (error) {
          console.error("Failed to fetch", error);
       } finally {
          setLoading(false);
       }
    };
    fetchPartners();
  }, []);

  if (loading) return <div className="text-center py-20 text-xl font-bold">Loading premium partners...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-8 border-b pb-4">Our Partner Restaurants</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {restaurants.map((rest) => (
            <div key={rest._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
               <img src={rest.image || 'https://via.placeholder.com/400x250?text=Restaurant'} className="w-full h-48 object-cover" />
               <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900">{rest.name}</h3>
                  <p className="text-gray-500 mt-2">{rest.address}</p>
                  <div className="mt-4 flex items-center justify-between">
                     <span className="text-sm font-medium bg-green-100 text-green-700 px-3 py-1 rounded-full">Open Now</span>
                     <button className="text-primary-600 font-bold hover:underline">View Menu</button>
                  </div>
               </div>
            </div>
         ))}
         {restaurants.length === 0 && (
            <div className="col-span-3 text-center py-10 text-gray-500 text-lg">More restaurants joining soon!</div>
         )}
      </div>
    </div>
  );
};

export default Restaurants;
