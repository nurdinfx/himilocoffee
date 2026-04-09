import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator, Image } from 'react-native';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingBag, ChevronRight, Clock, MapPin } from 'lucide-react-native';

const OrderHistoryScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/myorders');
        setOrders(data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const renderOrder = ({ item }) => (
    <TouchableOpacity 
      onPress={() => navigation.navigate('TrackOrder', { orderId: item._id })}
      className="mb-4 bg-white p-5 rounded-3xl border border-gray-100 shadow-sm shadow-black/5 flex-row items-center justify-between"
    >
      <View className="flex-row items-center">
        <View className="bg-primary-50 p-3 rounded-2xl border border-primary-100">
          <ShoppingBag size={24} color="#ef4444" />
        </View>
        <View className="ml-4">
          <Text className="text-lg font-extrabold text-gray-900">Order #{item._id.slice(-6).toUpperCase()}</Text>
          <View className="flex-row items-center mt-1">
            <Clock size={12} color="#94a3b8" />
            <Text className="text-gray-400 text-xs ml-1">{new Date(item.createdAt).toLocaleDateString()}</Text>
            <Text className="mx-2 text-gray-200">|</Text>
            <Text className="text-primary-600 font-bold text-xs">${item.totalPrice.toFixed(2)}</Text>
          </View>
        </View>
      </View>
      
      <View className="flex-row items-center">
        <View className={`px-3 py-1 rounded-full ${item.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
           <Text className="text-[10px] font-black uppercase tracking-widest">{item.status}</Text>
        </View>
        <ChevronRight size={20} color="#cbd5e1" className="ml-2" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 p-6">
        <View className="mb-10 flex-row items-center justify-between">
           <Text className="text-3xl font-extrabold text-gray-900">My Orders</Text>
           <TouchableOpacity onPress={() => navigation.goBack()} className="bg-white p-3 rounded-2xl border border-gray-100">
               <Text className="text-primary-600 font-black text-xs uppercase">Filter</Text>
           </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator className="mt-20" size="large" color="#ef4444" />
        ) : (
          <FlatList
            data={orders}
            renderItem={renderOrder}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <View className="mt-20 items-center justify-center opacity-40">
                <ShoppingBag size={80} color="#cbd5e1" />
                <Text className="text-xl font-bold mt-4">No past orders found.</Text>
                <Text className="text-gray-400 text-sm">Start ordering to see your history!</Text>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default OrderHistoryScreen;
