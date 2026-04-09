import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Package, Truck, CheckCircle } from 'lucide-react';
import { useParams } from 'react-router-dom';

const TrackOrder = () => {
  const { id } = useParams();
  const [orderId, setOrderId] = useState(id || '');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const { user } = useAuth();
  
  useEffect(() => {
    if (id) {
      handleTrackAuto(id);
    }
  }, [id]);

  const handleTrackAuto = async (tid) => {
    try {
      const { data } = await api.get(`/orders/${tid}`);
      setOrder(data);
    } catch (err) {
      setError('Could not locate order ID.');
    }
  };

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!user) return setError('You must be logged in to track your personal orders.');
    setError('');
    try {
      const { data } = await api.get(`/orders/${orderId}`);
      if (data) {
         setOrder(data);
      } else {
         setError('Order not found or you are not authorized.');
      }
    } catch (err) {
      setError('Could not locate order ID.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-8 border-b pb-4 text-center">Track Your Delivery</h2>
      
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
         <form onSubmit={handleTrack} className="flex space-x-4 mb-8">
            <input 
               required 
               type="text" 
               className="flex-1 border p-4 rounded-xl focus:ring-primary-500 font-mono" 
               placeholder="Enter tracking Order ID (e.g., 60d5ecb8b392)" 
               value={orderId} 
               onChange={(e) => setOrderId(e.target.value)} 
            />
            <button type="submit" className="bg-primary-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-primary-700 shadow-md">
               Track Request
            </button>
         </form>

         {error && <div className="text-red-500 bg-red-50 p-4 rounded-lg font-medium">{error}</div>}

         {order && (
            <div className="mt-8 border-t pt-8">
               <h3 className="text-2xl font-bold mb-6">Status: <span className="text-primary-600">{order.status}</span></h3>
               <div className="flex justify-between items-center relative">
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10 transform -translate-y-1/2"></div>
                  
                  <div className={`flex flex-col items-center bg-white p-2 ${order.status !== 'Pending' ? 'text-primary-600' : 'text-gray-400'}`}>
                     <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 ${order.status !== 'Pending' ? 'border-primary-600 bg-primary-50' : 'border-gray-200 bg-white'}`}>
                        <Package className="w-5 h-5"/>
                     </div>
                     <span className="font-bold mt-2 text-sm">Placed</span>
                  </div>

                  <div className={`flex flex-col items-center bg-white p-2 ${['Out for delivery', 'Delivered'].includes(order.status) ? 'text-primary-600' : 'text-gray-400'}`}>
                     <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 ${['Out for delivery', 'Delivered'].includes(order.status) ? 'border-primary-600 bg-primary-50' : 'border-gray-200 bg-white'}`}>
                        <Truck className="w-5 h-5"/>
                     </div>
                     <span className="font-bold mt-2 text-sm">On Route</span>
                  </div>

                  <div className={`flex flex-col items-center bg-white p-2 ${order.status === 'Delivered' ? 'text-primary-600' : 'text-gray-400'}`}>
                     <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 ${order.status === 'Delivered' ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'}`}>
                        <CheckCircle className="w-5 h-5"/>
                     </div>
                     <span className="font-bold mt-2 text-sm">Arrived</span>
                  </div>
               </div>
            </div>
         )}
      </div>
    </div>
  );
};

export default TrackOrder;
