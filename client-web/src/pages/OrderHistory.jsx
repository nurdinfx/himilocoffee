import { useState, useEffect } from 'react';
import api from '../services/api';
import { ShoppingBag, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { OrderSkeleton } from '../components/Skeleton';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/myorders');
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <OrderSkeleton />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-8 border-b pb-4">My Orders</h2>
      
      <div className="space-y-6">
        {orders.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-300">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">No orders found yet.</p>
            <Link to="/menu" className="mt-4 inline-block text-primary-600 font-bold hover:underline">Start Ordering Now</Link>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-6">
                <div className="bg-primary-50 p-4 rounded-xl">
                  <ShoppingBag className="w-8 h-8 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Order #{order._id.slice(-6).toUpperCase()}</h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                    <span className="mx-2">•</span>
                    <span className="font-bold text-primary-600">${order.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold 
                  ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {order.status}
                </span>
                <Link to={`/track/${order._id}`} className="p-2 text-gray-400 hover:text-primary-600">
                  <ChevronRight className="w-6 h-6" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
