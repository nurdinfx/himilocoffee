import { Outlet, Link } from 'react-router-dom';
import { ShoppingCart, User, Menu, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const MainLayout = () => {
  const auth = useAuth() || {};
  const user = auth.user || null;
  const logout = auth.logout || (() => {});
  const cartContext = useCart() || {};
  const cartItems = cartContext.cartItems || [];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <span className="text-3xl font-extrabold text-primary-600 tracking-tight">Himilo</span>
              <span className="text-2xl font-semibold text-gray-800">Eats</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">Home</Link>
              <Link to="/menu" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">Menu</Link>
              <Link to="/restaurants" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">Restaurants</Link>
              <Link to="/about" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">About Us</Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-5">
              <button className="text-gray-500 hover:text-primary-600 transition-colors">
                <Search className="w-6 h-6" />
              </button>
              <Link to="/cart" className="relative text-gray-500 hover:text-primary-600 transition-colors">
                <ShoppingCart className="w-6 h-6" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </Link>
              <div className="hidden md:flex items-center space-x-3 ml-4 border-l pl-5 border-gray-200">
                {user ? (
                  <div className="flex items-center space-x-4">
                     <Link to="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-xs uppercase">
                          {user.name?.charAt(0)}
                        </div>
                        <span className="font-semibold">{user.name}</span>
                     </Link>
                     <Link to="/orders" className="text-gray-600 font-medium hover:text-primary-600 text-sm border-l pl-4 border-gray-100">My Orders</Link>
                     <button onClick={logout} className="text-gray-400 font-medium hover:text-red-500 text-sm">Logout</button>
                  </div>
                ) : (
                  <>
                    <Link to="/login" className="text-gray-600 font-medium hover:text-primary-600">Login</Link>
                    <Link to="/register" className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-full font-medium transition-all shadow-md hover:shadow-lg">
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
              <button className="md:hidden text-gray-500 hover:text-primary-600">
                <Menu className="w-7 h-7" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-primary-500 mb-4">Himilo Eats</h3>
            <p className="text-gray-400">Delivering happiness to your doorstep, fresh and hot!</p>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/menu" className="hover:text-primary-400">Full Menu</Link></li>
              <li><Link to="/restaurants" className="hover:text-primary-400">Our Partners</Link></li>
              <li><Link to="/track" className="hover:text-primary-400">Track Order</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/terms" className="hover:text-primary-400">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-primary-400">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact</h4>
            <p className="text-gray-400">support@himiloeats.com</p>
            <p className="text-gray-400">+1 234 567 890</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
