import { useState, useEffect } from 'react';
import api, { BASE_URL } from '../services/api';
import { Link } from 'react-router-dom';
import { getImageUrl as getValidImageUrl } from '../utils/getImageUrl';

const Restaurants = () => {
   const [restaurants, setRestaurants] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchPartners = async () => {
         try {
            const { data } = await api.get('/restaurants');
            setRestaurants(data);
         } catch (error) {
            console.error("Failed to fetch restaurants", error);
         } finally {
            setLoading(false);
         }
      };
      fetchPartners();
   }, []);

   const getImageUrl = (restaurant) => {
      if (restaurant.image) {
         return getValidImageUrl(restaurant.image);
      }
      // Placeholder images - stable unsplash URLs
      const placeholders = [
         'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=250&fit=crop',
         'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=250&fit=crop',
         'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=250&fit=crop',
         'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=250&fit=crop',
         'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=250&fit=crop'
      ];
      return placeholders[restaurants.indexOf(restaurant) % placeholders.length];
   };

   if (loading) {
      return (
         <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                     <div className="w-full h-48 bg-gray-200"></div>
                     <div className="p-6">
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      );
   }

   return (
      <div className="max-w-7xl mx-auto px-4 py-16">
         <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Our Partner Restaurants</h2>
            <p className="text-gray-600 text-lg">Discover the best dining experiences in your city</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {restaurants.map((rest, index) => (
               <div key={rest._id || index} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="relative overflow-hidden h-48">
                     <img
                        src={getImageUrl(rest)}
                        alt={rest.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                           e.target.onerror = null;
                           e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=250&fit=crop';
                        }}
                     />
                     <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {rest.isOpen !== false ? 'Open Now' : 'Closed'}
                     </div>
                  </div>
                  <div className="p-6">
                     <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {rest.name}
                     </h3>
                     <p className="text-gray-500 text-sm mt-2 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {rest.address || 'Address not available'}
                     </p>
                     {rest.cuisine && (
                        <div className="mt-3 flex flex-wrap gap-2">
                           <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                              {rest.cuisine}
                           </span>
                        </div>
                     )}
                     <div className="mt-5 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                           <span className="text-yellow-400">★</span>
                           <span className="text-sm font-semibold">{rest.rating || '4.5'}</span>
                           <span className="text-gray-400 text-sm">({rest.reviewCount || 100}+)</span>
                        </div>
                        <Link
                           to={`/restaurants/${rest._id}/menu`}
                           className="text-primary-600 font-bold hover:text-primary-700 transition-colors flex items-center gap-1"
                        >
                           View Menu
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                           </svg>
                        </Link>
                     </div>
                  </div>
               </div>
            ))}
         </div>

         {restaurants.length === 0 && (
            <div className="text-center py-20">
               <div className="text-6xl mb-4">🍽️</div>
               <p className="text-gray-500 text-lg">No restaurants found. More partners joining soon!</p>
            </div>
         )}
      </div>
   );
};

export default Restaurants;