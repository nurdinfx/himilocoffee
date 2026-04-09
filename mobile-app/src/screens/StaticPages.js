import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { ChevronLeft, Info, FileText, ShieldCheck } from 'lucide-react-native';

const StaticPages = ({ route, navigation }) => {
  const { type } = route.params || { type: 'About' };

  const content = {
    About: {
      title: 'About Himilo Eats',
      icon: Info,
      text: "Himilo Coffee & Eats is our commitment to delivering the highest quality coffee and meals across the city. Built for enthusiasts who value speed and flavor, our platform connects you with the best kitchens in real-time.\n\nOur mission is to modernize the food delivery landscape with premium service and a seamless digital experience that puts the user first."
    },
    Terms: {
      title: 'Terms of Service',
      icon: FileText,
      text: "By using our platform, you agree to our service terms. Our platform serves as a marketplace for food delivery. Payments are processed securely, and delivery times are estimated based on real-time traffic and kitchen availability.\n\nUsage of our platform is restricted to legal age residents in our delivery zones."
    },
    Privacy: {
      title: 'Privacy Policy',
      icon: ShieldCheck,
      text: "We value your privacy. Your data (name, email, and location) is used strictly for fulfilling your orders and improving your experience. We do not sell your personal information to third parties.\n\nLocation data is only accessed while the app is in use to provide accurate delivery tracking."
    }
  };

  const page = content[type] || content.About;
  const Icon = page.icon;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 p-6">
        <View className="flex-row items-center mb-10">
            <TouchableOpacity onPress={() => navigation.goBack()} className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                <ChevronLeft size={24} color="#111827" />
            </TouchableOpacity>
            <Text className="text-2xl font-extrabold text-gray-900 ml-4">{page.title}</Text>
        </View>

        <View className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm shadow-black/5 items-center">
            <View className="bg-primary-50 p-6 rounded-full mb-6 border border-primary-100">
               <Icon size={40} color="#ef4444" />
            </View>
            <Text className="text-gray-600 text-lg leading-7 text-center font-medium">
                {page.text}
            </Text>
        </View>

        <View className="mt-10 items-center opacity-30">
            <Text className="text-gray-400 font-black uppercase tracking-widest text-xs">Himilo Coffee System v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StaticPages;
