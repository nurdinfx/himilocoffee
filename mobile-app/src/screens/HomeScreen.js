import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, SafeAreaView, ActivityIndicator, TextInput } from 'react-native';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Search, MapPin, Star, Clock, Filter } from 'lucide-react-native';

const HomeScreen = ({ navigation }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const { data } = await api.get('/restaurants');
        setRestaurants(data);
      } catch (err) {
        console.error('Fetch error', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  const renderRestaurant = ({ item }) => {
    const imageUrl = item.image?.startsWith('http') 
        ? item.image 
        : `http://10.0.2.2:5000${item.image}`;
    
    return (
        <TouchableOpacity 
          onPress={() => navigation.navigate('Menu', { restaurantId: item._id, restaurantName: item.name })}
          activeOpacity={0.9}
          className="mb-6 bg-white rounded-[32px] overflow-hidden shadow-xl shadow-black/10 border border-gray-100"
        >
          <View className="relative">
            <Image 
              source={{ uri: imageUrl }} 
              className="w-full h-56 object-cover" 
              onError={(e) => {
                  // Fallback for mobile
              }}
              defaultSource={{ uri: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800' }}
            />
            <View className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl flex-row items-center">
                <Star size={14} color="#f59e0b" fill="#f59e0b" />
                <Text className="text-gray-900 font-black text-xs ml-1">4.8</Text>
            </View>
            <View className="absolute bottom-4 left-4 bg-primary-600 px-3 py-1.5 rounded-2xl">
                <Text className="text-white font-black text-[10px] uppercase tracking-tighter">Fast Delivery</Text>
            </View>
          </View>
      
      <View className="p-5">
        <View className="flex-row justify-between items-start mb-2">
            <View className="flex-1">
                <Text className="text-2xl font-black text-gray-900 tracking-tight">{item.name}</Text>
                <View className="flex-row items-center mt-1">
                    <MapPin size={14} color="#94a3b8" />
                    <Text className="text-gray-400 font-medium text-xs ml-1">{item.address}</Text>
                </View>
            </View>
        </View>
        
        <View className="flex-row items-center mt-4 pt-4 border-t border-gray-50 space-x-4">
            <View className="flex-row items-center">
                <Clock size={14} color="#10b981" />
                <Text className="text-green-600 font-bold text-xs ml-1.5 font-mono">20-30 min</Text>
            </View>
            <View className="w-1 h-1 rounded-full bg-gray-200" />
            <Text className="text-gray-400 font-bold text-xs">Free Delivery</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 pt-4 pb-2 flex-row justify-between items-center">
         <View>
            <Text className="text-gray-400 font-black uppercase text-[10px] tracking-widest mb-0.5">Deliver to</Text>
            <TouchableOpacity className="flex-row items-center">
                <Text className="text-gray-900 font-black text-lg">Current Location</Text>
                <View className="ml-1 bg-primary-50 p-1 rounded-full">
                    <MapPin size={14} color="#ef4444" />
                </View>
            </TouchableOpacity>
         </View>
         <TouchableOpacity className="bg-gray-100 w-12 h-12 rounded-2xl items-center justify-center border border-gray-200 shadow-sm">
            <Search size={22} color="#111827" />
         </TouchableOpacity>
      </View>

      <View className="px-6 py-4">
          <View className="flex-row items-center space-x-3 bg-gray-100 p-4 rounded-3xl border border-gray-200">
             <Search size={20} color="#94a3b8" />
             <TextInput 
                placeholder="Search food, restaurants..." 
                className="flex-1 font-bold text-gray-900"
                placeholderTextColor="#94a3b8"
             />
             <TouchableOpacity className="bg-white p-2 rounded-xl shadow-sm">
                 <Filter size={18} color="#ef4444" />
             </TouchableOpacity>
          </View>
      </View>

      <View className="px-6 mb-2 mt-2">
         <Text className="text-3xl font-black text-gray-900 leading-tight tracking-tighter">Popular <Text className="text-primary-600">Choices</Text></Text>
      </View>

      {loading ? (
        <View className="mt-20 items-center justify-center">
            <ActivityIndicator size="large" color="#ef4444" />
            <Text className="mt-4 text-gray-400 font-bold">Curating top kitchens...</Text>
        </View>
      ) : (
        <FlatList
          data={restaurants}
          renderItem={renderRestaurant}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40, paddingTop: 10 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => (
             <View className="mb-6 flex-row space-x-3">
                 {['Hot Deals', 'Coffee', 'Burger', 'Healthy'].map((cat, i) => (
                    <TouchableOpacity key={i} className={`px-5 py-3 rounded-2xl border ${i === 0 ? 'bg-primary-600 border-primary-600' : 'bg-white border-gray-100'}`}>
                        <Text className={`font-black text-xs ${i === 0 ? 'text-white' : 'text-gray-400'}`}>{cat}</Text>
                    </TouchableOpacity>
                 ))}
             </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;
