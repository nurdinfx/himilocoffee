import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, LogOut, ChevronRight, Settings, CreditCard, Bell } from 'lucide-react-native';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { title: 'My Account', icon: User, color: '#3b82f6' },
    { title: 'Payment Methods', icon: CreditCard, color: '#10b981' },
    { title: 'Notifications', icon: Bell, color: '#f59e0b' },
    { title: 'Settings', icon: Settings, color: '#6366f1' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-6 py-10 bg-white rounded-b-3xl shadow-sm border-b border-gray-100 items-center">
         <View className="w-24 h-24 rounded-full bg-primary-50 items-center justify-center border-4 border-primary-100 mb-4">
            <Text className="text-4xl font-extrabold text-primary-600 uppercase">
                {user?.name?.charAt(0) || 'U'}
            </Text>
         </View>
         <Text className="text-2xl font-extrabold text-gray-900">{user?.name}</Text>
         <View className="flex-row items-center mt-1">
            <Mail size={14} color="#94a3b8" />
            <Text className="text-slate-400 font-medium ml-1">{user?.email}</Text>
         </View>
      </View>

      <View className="p-6 space-y-4">
         {menuItems.map((item, idx) => (
            <TouchableOpacity 
               key={idx}
               className="bg-white p-5 rounded-3xl flex-row items-center justify-between border border-gray-100 shadow-sm shadow-black/5"
            >
               <View className="flex-row items-center">
                  <View style={{ backgroundColor: item.color + '20' }} className="p-2 rounded-xl">
                    <item.icon size={20} color={item.color} />
                  </View>
                  <Text className="text-lg font-bold text-gray-800 ml-4">{item.title}</Text>
               </View>
               <ChevronRight size={20} color="#94a3b8" />
            </TouchableOpacity>
         ))}

         <TouchableOpacity 
            onPress={logout}
            className="bg-red-50 p-5 rounded-3xl flex-row items-center justify-between border border-red-100 mt-4"
         >
            <View className="flex-row items-center">
               <View className="bg-red-100 p-2 rounded-xl">
                 <LogOut size={20} color="#ef4444" />
               </View>
               <Text className="text-lg font-bold text-red-600 ml-4">Sign Out</Text>
            </View>
         </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
