import { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu as MenuIcon, X, LogOut, ChevronRight, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const MainLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const auth = useAuth();
  const user = auth?.user || null;
  const logout = auth?.logout || (() => { });
  const cartContext = useCart();
  const cartItems = cartContext?.cartItems || [];
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '/menu' },
    { name: 'Restaurants', href: '/restaurants' },
    { name: 'About Us', href: '/about' },
  ];

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans overflow-x-hidden">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <span className="text-2xl sm:text-3xl font-extrabold text-primary-600 tracking-tight">Himilo</span>
              <span className="text-xl sm:text-2xl font-semibold text-gray-800">Eats</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-3 sm:space-x-5">
              <Link to="/search" className="hidden sm:block text-gray-500 hover:text-primary-600 transition-colors p-2">
                <Search className="w-6 h-6" />
              </Link>

              <Link to="/cart" className="relative text-gray-500 hover:text-primary-600 transition-colors p-2">
                <ShoppingCart className="w-6 h-6" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                    {cartItems.length}
                  </span>
                )}
              </Link>

              {/* Desktop User Section */}
              <div className="hidden md:flex items-center space-x-3 ml-4 border-l pl-5 border-gray-200">
                {user ? (
                  <div className="flex items-center space-x-4">
                    <Link to="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-xs uppercase shadow-inner">
                        {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </div>
                      <span className="font-semibold hidden lg:inline">{user.name?.split(' ')[0]}</span>
                    </Link>
                    <Link to="/orders" className="text-gray-600 font-medium hover:text-primary-600 text-sm border-l pl-4 border-gray-100">
                      My Orders
                    </Link>
                    <button onClick={handleLogout} className="text-gray-400 font-medium hover:text-red-500 text-sm transition-colors">
                      Logout
                    </button>
                  </div>
                ) : (
                  <>
                    <Link to="/login" className="text-gray-600 font-medium hover:text-primary-600">Login</Link>
                    <Link to="/register" className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-full font-medium transition-all shadow-md hover:shadow-lg transform active:scale-95">
                      Sign Up
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden text-gray-500 hover:text-primary-600 p-2 transform active:scale-90 transition-transform"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-7 h-7" /> : <MenuIcon className="w-7 h-7" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[60] md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-80 bg-white z-[70] shadow-2xl md:hidden flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-primary-50">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-extrabold text-primary-600">Himilo</span>
                  <span className="text-xl font-semibold text-gray-800">Eats</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-500 hover:bg-white rounded-full transition-colors shadow-sm">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto py-4">
                {user && (
                  <div className="px-6 py-6 mb-4 bg-gray-50 mx-4 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600 font-bold text-xl uppercase shadow-sm">
                        {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-lg leading-tight">{user.name || 'User'}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        to="/profile"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-gray-100 hover:border-primary-200"
                      >
                        <User className="w-5 h-5 text-gray-400 mb-1" />
                        <span className="text-xs font-bold text-gray-600">Profile</span>
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-gray-100 hover:border-primary-200"
                      >
                        <ShoppingCart className="w-5 h-5 text-gray-400 mb-1" />
                        <span className="text-xs font-bold text-gray-600">Orders</span>
                      </Link>
                    </div>
                  </div>
                )}

                <nav className="px-4 space-y-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between p-4 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-2xl font-bold transition-all group"
                    >
                      <span>{link.name}</span>
                      <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity text-primary-400" />
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="p-6 border-t border-gray-100 space-y-3">
                {!user ? (
                  <>
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-center py-4 rounded-2xl border-2 border-primary-100 text-primary-600 font-bold hover:bg-primary-50 transition-colors">
                      Login
                    </Link>
                    <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-center py-4 rounded-2xl bg-primary-600 text-white font-bold shadow-lg shadow-primary-200 active:scale-95 transition-all">
                      Create Account
                    </Link>
                  </>
                ) : (
                  <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-red-500 font-bold hover:bg-red-50 transition-colors">
                    <LogOut className="w-5 h-5" />
                    Logout Account
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-primary-500 mb-4 tracking-tight">Himilo Eats</h3>
            <p className="text-gray-400 leading-relaxed">Delivering happiness to your doorstep, fresh and hot! The best food experience in the city.</p>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6 border-b border-gray-800 pb-2">Quick Links</h4>
            <ul className="space-y-3 text-gray-400">
              <li><Link to="/menu" className="hover:text-primary-400 transition-colors flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary-600"></div> Full Menu</Link></li>
              <li><Link to="/restaurants" className="hover:text-primary-400 transition-colors flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary-600"></div> Our Partners</Link></li>
              <li><Link to="/track" className="hover:text-primary-400 transition-colors flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary-600"></div> Track Order</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6 border-b border-gray-800 pb-2">Legal</h4>
            <ul className="space-y-3 text-gray-400">
              <li><Link to="/terms" className="hover:text-primary-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-primary-400 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-lg mb-6 border-b border-gray-800 pb-2">Contact</h4>
            <p className="text-gray-400 flex items-center gap-2">support@himiloeats.com</p>
            <p className="text-gray-400 flex items-center gap-2">+1 234 567 890</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Himilo Coffee Systems. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;