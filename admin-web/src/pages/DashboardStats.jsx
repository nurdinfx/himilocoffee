import { useState, useEffect } from 'react';
import api from '../services/api';
import { TrendingUp, Users, ShoppingBag, UtensilsCrossed } from 'lucide-react';

const DashboardStats = () => {
   const [stats, setStats] = useState({ orders: 0, revenue: 0, users: 0, products: 0 });

   useEffect(() => {
      // In a real app we'd fetch an aggregated /api/stats endpoint, here we synthesize to provide immediate UI value
      const synthesizeData = async () => {
         try {
            const [{data: orders}, {data: products}] = await Promise.all([
                api.get('/orders'),
                api.get('/products')
            ]);
            const revenue = orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);
            setStats({ orders: orders.length, revenue, users: 4, products: products.length });
         } catch (e) {
            console.error(e);
         }
      };
      synthesizeData();
   }, []);

   const cards = [
      { name: 'Total Revenue', value: `$${stats.revenue.toFixed(2)}`, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100' },
      { name: 'Total Orders', value: stats.orders, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-100' },
      { name: 'Active Menu Items', value: stats.products, icon: UtensilsCrossed, color: 'text-orange-600', bg: 'bg-orange-100' },
      { name: 'Registered Users', value: stats.users, icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
   ];

   return (
      <div className="space-y-6">
         <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card) => (
               <div key={card.name} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                  <div className={`p-4 rounded-xl ${card.bg}`}>
                     <card.icon className={`w-8 h-8 ${card.color}`} />
                  </div>
                  <div>
                     <p className="text-sm font-medium text-gray-500">{card.name}</p>
                     <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
};

export default DashboardStats;
