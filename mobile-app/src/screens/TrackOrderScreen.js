import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator, ScrollView } from 'react-native';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Package, Truck, CheckCircle, ChevronLeft } from 'lucide-react-native';

const TrackOrderScreen = ({ route, navigation }) => {
  const { orderId: paramId } = route.params || {};
  const [orderId, setOrderId] = useState(paramId || '');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  
  useEffect(() => {
    if (paramId) {
      handleTrackAuto(paramId);
    }
  }, [paramId]);

  const handleTrackAuto = async (tid) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/orders/${tid}`);
      setOrder(data);
    } catch (err) {
      setError('Could not locate order ID.');
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = async () => {
    if (!orderId) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get(`/orders/${orderId}`);
      setOrder(data);
    } catch (err) {
      setError('Could not locate order. Check your ID and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 p-6">
        <View className="flex-row items-center mb-10">
            <TouchableOpacity onPress={() => navigation.goBack()} className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                <ChevronLeft size={24} color="#111827" />
            </TouchableOpacity>
            <Text className="text-2xl font-extrabold text-gray-900 ml-4">Live Tracking</Text>
        </View>

        <View className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm shadow-black/5">
            <Text className="text-gray-500 font-bold mb-4 uppercase text-xs tracking-widest">Tracking Details</Text>
            <View className="flex-row space-x-3 mb-6">
                <TextInput 
                    placeholder="Enter Order ID"
                    className="flex-1 bg-gray-50 p-4 rounded-2xl border border-gray-100 text-gray-900 font-mono"
                    value={orderId}
                    onChangeText={setOrderId}
                />
                <TouchableOpacity onPress={handleTrack} className="bg-primary-600 px-6 justify-center rounded-2xl shadow-md">
                    {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold">Track</Text>}
                </TouchableOpacity>
            </View>

            {error ? <Text className="text-red-500 bg-red-50 p-4 rounded-xl font-medium text-center">{error}</Text> : null}

            {order && (
                <View className="mt-4 animate-in fade-in duration-500">
                    <View className="bg-primary-50 p-4 rounded-2xl mb-8 flex-row justify-between items-center border border-primary-100">
                        <View>
                            <Text className="text-primary-600 font-bold text-xs uppercase">Current Status</Text>
                            <Text className="text-primary-800 text-xl font-black">{order.status}</Text>
                        </View>
                        <View className="bg-white p-3 rounded-xl">
                            <Package size={24} color="#ef4444" />
                        </View>
                    </View>

                    <View className="space-y-10 relative">
                        {/* Status timeline items */}
                        <TimelineItem 
                            active={true} 
                            icon={Package} 
                            title="Order Received" 
                            desc="We've received your request!" 
                            isLast={false} 
                        />
                        <TimelineItem 
                            active={['Out for delivery', 'Delivered'].includes(order.status)} 
                            icon={Truck} 
                            title="Out for Delivery" 
                            desc="A driver is on their way." 
                            isLast={false} 
                        />
                        <TimelineItem 
                            active={order.status === 'Delivered'} 
                            icon={CheckCircle} 
                            title="Delivered" 
                            desc="Enjoy your meal!" 
                            isLast={true} 
                        />
                    </View>
                </View>
            )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const TimelineItem = ({ active, icon: Icon, title, desc, isLast }) => (
    <View className="flex-row items-start relative pb-10">
        {!isLast && <View className={`absolute left-[20px] top-[40px] bottom-0 w-[4px] ${active ? 'bg-primary-600' : 'bg-gray-100'} rounded-full`} />}
        <View className={`w-10 h-10 rounded-full items-center justify-center border-4 ${active ? 'border-primary-100 bg-primary-600' : 'border-gray-50 bg-gray-100'}`}>
            <Icon size={16} color={active ? 'white' : '#94a3b8'} />
        </View>
        <View className="ml-5 flex-1">
            <Text className={`text-lg font-bold ${active ? 'text-gray-900' : 'text-gray-400'}`}>{title}</Text>
            <Text className="text-gray-400 text-sm">{desc}</Text>
        </View>
    </View>
);

export default TrackOrderScreen;
