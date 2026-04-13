import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, SafeAreaView, ActivityIndicator } from 'react-native';
import api, { BASE_URL } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { ShoppingBag, ChevronLeft, Plus } from 'lucide-react-native';

const MenuScreen = ({ route, navigation }) => {
  const { restaurantId, restaurantName } = route.params;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, cartItems } = useCart();
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data);
      } catch (err) {
        console.error('Fetch products error', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const renderProduct = ({ item }) => {
    const imageUrl = item.image?.startsWith('http') 
        ? item.image 
        : `${BASE_URL}${item.image}`;

    return (
        <View className="mb-6 bg-white p-5 rounded-[28px] flex-row items-center border border-gray-100 shadow-xl shadow-black/5">
          <View className="relative">
            <Image 
              source={{ uri: imageUrl }} 
              className="w-24 h-24 rounded-2xl" 
              defaultSource={{ uri: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400' }}
            />
            <View className="absolute -bottom-2 -right-2 bg-primary-600 w-8 h-8 rounded-full items-center justify-center border-4 border-white shadow-md">
                <TouchableOpacity onPress={() => addToCart(item)}>
                    <Plus size={16} color="white" />
                </TouchableOpacity>
            </View>
          </View>
          
          <View className="flex-1 ml-5 justify-between py-1">
            <View>
                <Text className="text-xl font-black text-gray-900 tracking-tight">{item.name}</Text>
                <Text className="text-gray-400 text-xs font-medium leading-4 mt-1" numberOfLines={2}>
                  {item.description || 'Deliciously crafted with the finest ingredients and spices.'}
                </Text>
            </View>
            
            <View className="flex-row justify-between items-center mt-3">
                <View className="flex-row items-baseline">
                    <Text className="text-primary-600 font-black text-2xl tracking-tighter">${item.price.toFixed(2)}</Text>
                    <Text className="text-gray-300 text-[10px] font-black uppercase tracking-widest ml-1.5">/ Portion</Text>
                </View>
            </View>
          </View>
        </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-6 py-4 flex-row justify-between items-center">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="bg-gray-100 p-3 rounded-2xl border border-gray-100"
        >
          <ChevronLeft size={24} color="#111827" />
        </TouchableOpacity>
        
        <View className="items-center">
            <Text className="text-gray-400 font-black uppercase text-[10px] tracking-widest leading-3 mb-0.5">Ordering From</Text>
            <Text className="text-gray-900 font-black text-lg tracking-tight">{restaurantName}</Text>
        </View>
        
        <TouchableOpacity 
           onPress={() => navigation.navigate('Cart')}
           className="bg-primary-600 p-3 rounded-2xl shadow-xl shadow-primary-500/30 relative"
        >
          <ShoppingBag size={24} color="white" />
          {cartCount > 0 && (
            <View className="absolute -top-1 -right-1 bg-gray-900 w-5 h-5 rounded-full items-center justify-center border-2 border-white">
                <Text className="text-[10px] font-black text-white">{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="mt-20 items-center justify-center">
            <ActivityIndicator size="large" color="#ef4444" />
            <Text className="mt-4 text-gray-400 font-bold">Flavoring the menu...</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40, paddingTop: 10 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => (
             <View className="mb-8">
                <View className="bg-primary-50 p-6 rounded-[32px] border border-primary-100 flex-row items-center justify-between">
                    <View>
                        <Text className="text-primary-800 text-3xl font-black italic tracking-tighter leading-tight">Fastest Delivery</Text>
                        <Text className="text-primary-600 font-black text-xs uppercase tracking-[2px] mt-1">Ready in 25 mins</Text>
                    </View>
                    <Image 
                        source={{ uri: 'https://images.unsplash.com/photo-1550966841-3ee322878b44?w=400' }} 
                        className="w-20 h-20 rounded-2xl border-2 border-white" 
                    />
                </View>
                <Text className="text-2xl font-black text-gray-900 mt-8 mb-4 tracking-tighter border-b-2 border-primary-500 pb-1 w-20">Menu</Text>
             </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default MenuScreen;
