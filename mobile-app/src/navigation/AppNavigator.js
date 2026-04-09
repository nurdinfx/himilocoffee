import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../contexts/AuthContext';
import { Home, ShoppingBag, User, TrackCircle } from 'lucide-react-native';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import MenuScreen from '../screens/MenuScreen';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TrackOrderScreen from '../screens/TrackOrderScreen';
import OrderHistoryScreen from '../screens/OrderHistoryScreen';
import StaticPages from '../screens/StaticPages';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen name="Menu" component={MenuScreen} />
    <Stack.Screen name="Cart" component={CartScreen} />
    <Stack.Screen name="TrackOrder" component={TrackOrderScreen} />
    <Stack.Screen name="Static" component={StaticPages} />
  </Stack.Navigator>
);

const MainTab = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: '#ef4444',
      tabBarInactiveTintColor: '#94a3b8',
      tabBarStyle: {
        height: 70,
        paddingBottom: 10,
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      tabBarIcon: ({ color, size }) => {
        if (route.name === 'Explore') return <Home size={size} color={color} />;
        if (route.name === 'History') return <Clock size={size} color={color} />;
        if (route.name === 'Orders') return <ShoppingBag size={size} color={color} />;
        if (route.name === 'Profile') return <User size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Explore" component={HomeStack} />
    <Tab.Screen name="History" component={OrderHistoryScreen} />
    <Tab.Screen name="Orders" component={CartScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} /> 
  </Tab.Navigator>
);

const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <Stack.Screen name="Auth" component={AuthStack} />
      ) : (
        <Stack.Screen name="Main" component={MainTab} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
