import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { ChevronLeft } from 'lucide-react-native';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    setLoading(true);
    setError('');
    const res = await register(name, email, password);
    if (!res.success) {
      setError(res.message);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 p-6 justify-center">
      <TouchableOpacity 
        onPress={() => navigation.goBack()}
        className="absolute top-12 left-6 bg-white p-3 rounded-2xl border border-gray-100 z-10 shadow-sm"
      >
        <ChevronLeft size={24} color="#111827" />
      </TouchableOpacity>
      
      <View className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <Text className="text-3xl font-extrabold text-gray-900 mb-2">Create Account</Text>
        <Text className="text-gray-500 mb-8 font-medium">Join Himilo Eats today</Text>
        
        {error && <Text className="text-red-500 mb-4 bg-red-50 p-3 rounded-lg text-sm text-center">{error}</Text>}
        
        <View className="space-y-4">
          <TextInput
            placeholder="Full Name"
            className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-gray-900"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            placeholder="Email Address"
            className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-gray-900"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            placeholder="Password"
            className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-gray-900"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        
        <TouchableOpacity 
          onPress={handleRegister}
          disabled={loading}
          className="bg-primary-600 mt-8 py-4 rounded-2xl shadow-md active:bg-primary-700 items-center"
        >
          {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-lg">Sign Up</Text>}
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => navigation.navigate('Login')}
          className="mt-4"
        >
           <Text className="text-center text-gray-400 font-medium">
             Already have an account? <Text className="text-primary-600 font-bold">Login</Text>
           </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default RegisterScreen;
