import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { motion } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Restaurants from './pages/Restaurants';
import TrackOrder from './pages/TrackOrder';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import OrderHistory from './pages/OrderHistory';
import Profile from './pages/Profile';

// Quick Landing Page Component
const Home = () => (
  <div className="w-full">
    {/* Hero Section */}
    <section className="relative bg-primary-50 py-24 sm:py-32 overflow-hidden">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary-200 rounded-full blur-3xl opacity-50"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight"
          >
            The fastest food <span className="text-primary-600 block mt-2">delivery in town</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-xl text-gray-600"
          >
            Delicious meals from your favorite local restaurants, delivered to your door in minutes.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex justify-center gap-4"
          >
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
              Order Now
            </button>
            <button className="bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 px-8 py-4 rounded-full font-bold text-lg shadow-sm transition-all">
              Browse Menu
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="menu" element={<Menu />} />
              <Route path="cart" element={<Cart />} />
              <Route path="restaurants" element={<Restaurants />} />
              <Route path="track" element={<TrackOrder />} />
              <Route path="track/:id" element={<TrackOrder />} />
              <Route path="terms" element={<Terms />} />
              <Route path="privacy" element={<Privacy />} />
              <Route path="about" element={<div className="max-w-4xl mx-auto py-16 px-4 text-center"><h1 className="text-4xl font-bold mb-4">About Himilo Eats</h1><p className="text-lg text-gray-600">We are the premiere food delivery service built for speed and quality!</p></div>} />
              <Route path="orders" element={<OrderHistory />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
