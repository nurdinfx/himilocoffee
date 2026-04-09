import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Trash2, ShoppingBag, ChevronLeft } from 'lucide-react-native';

const CartScreen = ({ navigation }) => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const deliveryFee = 5.00;
  const total = subtotal + deliveryFee;

  const handleCheckout = async () => {
    if (!user) {
      return Alert.alert('Login Required', 'You must log in to place an order.', [
        { text: 'Login', onPress: () => navigation.navigate('Login') },
        { text: 'Cancel', style: 'cancel' }
      ]);
    }
    
    setLoading(true);
    try {
      const orderData = {
        orderItems: cartItems.map(x => ({ product: x._id, name: x.name, qty: x.qty, price: x.price })),
        deliveryAddress: { street: 'Mobile Address', city: 'Mobile City', lat: 0, lng: 0 },
        paymentMethod: 'Cash on Delivery',
        itemsPrice: subtotal,
        taxPrice: 0,
        shippingPrice: deliveryFee,
        totalPrice: total
      };
      
      const { data } = await api.post('/orders', orderData);
      clearCart();
      Alert.alert('Success!', 'Your order has been placed.', [
        { text: 'Track Order', onPress: () => navigation.navigate('Home') } // Track Order later
      ]);
    } catch (err) {
      console.error('Checkout error', err);
      Alert.alert('Error', 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderCartItem = ({ item }) => (
    <View className="mb-4 bg-white p-4 rounded-3xl flex-row items-center border border-gray-100 shadow-sm">
      <Image source={{ uri: item.image || 'https://via.placeholder.com/100' }} className="w-16 h-16 rounded-2xl" />
      <View className="flex-1 ml-4 justify-between py-1">
        <View className="flex-row justify-between items-center">
            <Text className="text-lg font-bold text-gray-900">{item.name}</Text>
            <TouchableOpacity onPress={() => removeFromCart(item._id)}>
                <Trash2 size={16} color="#ef4444" />
            </TouchableOpacity>
        </View>
        <Text className="text-primary-600 font-extrabold text-lg mt-1">
          {item.qty} x ${item.price.toFixed(2)}
        </Text>
      </View>
    </View>
  );

  if (cartItems.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center px-6">
        <TouchableOpacity 
           onPress={() => navigation.goBack()}
           className="bg-white p-3 rounded-2xl border border-gray-100 absolute top-6 left-6"
        >
          <ChevronLeft size={24} color="#111827" />
        </TouchableOpacity>
        <ShoppingBag size={80} color="#cbd5e1" />
        <Text className="text-2xl font-extrabold text-gray-400 mt-4">Your cart is empty!</Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Home')}
          className="bg-primary-600 mt-8 py-4 px-10 rounded-2xl shadow-md active:bg-primary-700"
        >
          <Text className="text-white font-bold text-lg">Browse Menu</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="p-6 flex-row justify-between items-center">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="bg-white p-3 rounded-2xl border border-gray-100"
        >
          <ChevronLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text className="text-xl font-extrabold text-gray-900">Your Basket</Text>
        <View className="w-12 h-12" />
      </View>

      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />

      <View className="bg-white p-8 rounded-t-3xl shadow-xl border-t border-gray-100 flex-none space-y-4">
        <View className="flex-row justify-between">
           <Text className="text-gray-500 font-medium">Subtotal</Text>
           <Text className="text-gray-900 font-bold">${subtotal.toFixed(2)}</Text>
        </View>
        <View className="flex-row justify-between">
           <Text className="text-gray-500 font-medium">Delivery Fee</Text>
           <Text className="text-gray-900 font-bold">${deliveryFee.toFixed(2)}</Text>
        </View>
        <View className="flex-row justify-between border-t border-gray-100 pt-4">
           <Text className="text-gray-900 font-extrabold text-xl">Total</Text>
           <Text className="text-primary-600 font-extrabold text-2xl">${total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity 
          onPress={handleCheckout}
          disabled={loading}
          className="bg-primary-600 py-4 rounded-2xl shadow-md active:bg-primary-700 items-center justify-center"
        >
          {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-lg">Send Order</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CartScreen;
