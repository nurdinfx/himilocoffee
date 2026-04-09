import { useState, useEffect } from 'react';
import api from '../services/api';

const OrdersManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (error) {
       console.error("Error fetching orders:", error);
    } finally {
       setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Setting up an interval to simulate live updates (or you could hook the socket.io logic here)
    const interval = setInterval(fetchOrders, 10000); 
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
       await api.put(`/orders/${id}/status`, { status: newStatus });
       setOrders(orders.map(o => o._id === id ? { ...o, status: newStatus } : o));
    } catch (error) {
       alert("Failed to update status");
    }
  };

  if (loading) return <div className="p-6">Loading orders...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
         <h2 className="text-xl font-bold text-gray-900">Live Orders</h2>
         <span className="bg-primary-50 text-primary-600 font-bold px-3 py-1 rounded-full text-sm">
            {orders.length} Total
         </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm border-b">
              <th className="p-4 font-semibold">Order ID</th>
              <th className="p-4 font-semibold">Customer</th>
              <th className="p-4 font-semibold">Total Price</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
             {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                   <td className="p-4 font-mono text-xs text-gray-500">{order._id}</td>
                   <td className="p-4 font-medium text-gray-900">{order.user?.name || 'Guest'}</td>
                   <td className="p-4 font-bold text-gray-900">${order.totalPrice.toFixed(2)}</td>
                   <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold leading-none
                        ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                          order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                         {order.status}
                      </span>
                   </td>
                   <td className="p-4 text-right">
                      {order.status === 'Pending' && (
                        <button onClick={() => updateStatus(order._id, 'Accepted')} className="text-sm bg-primary-100 text-primary-700 px-3 py-1 rounded hover:bg-primary-200 font-medium">Accept</button>
                      )}
                      {order.status === 'Accepted' && (
                        <button onClick={() => updateStatus(order._id, 'Preparing')} className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 font-medium">Prepare</button>
                      )}
                      {order.status === 'Preparing' && (
                        <button onClick={() => updateStatus(order._id, 'Out for delivery')} className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded hover:bg-purple-200 font-medium">Dispatch</button>
                      )}
                      {order.status === 'Out for delivery' && (
                        <button onClick={() => updateStatus(order._id, 'Delivered')} className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 font-medium">Finish</button>
                      )}
                   </td>
                </tr>
             ))}
             {orders.length === 0 && (
                <tr><td colSpan="5" className="p-8 text-center text-gray-500">No active orders found.</td></tr>
             )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersManager;
