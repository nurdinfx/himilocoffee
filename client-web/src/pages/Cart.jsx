import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Trash2, ShoppingBag, ArrowLeft, CreditCard } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { getImageUrl } from '../utils/getImageUrl';

const Cart = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ordering, setOrdering] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shipping = 5;
  const total = subtotal + shipping;

  const checkoutHandler = async () => {
    if (!user) {
      return navigate('/login');
    }
    setOrdering(true);
    try {
      const orderData = {
        orderItems: cartItems.map(x => ({ product: x._id, name: x.name, qty: x.qty, price: x.price })),
        deliveryAddress: { street: '123 Test St', city: 'Test City', lat: 0, lng: 0 },
        paymentMethod: 'Cash on Delivery',
        itemsPrice: subtotal,
        taxPrice: 0,
        shippingPrice: shipping,
        totalPrice: total
      };
      
      await api.post('/orders', orderData);
      clearCart();
      alert('Order Placed Successfully!');
      navigate('/');
    } catch (error) {
      console.error(error);
      alert('Checkout Failed');
    } finally {
      setOrdering(false);
    }
  };

  if (cartItems.length === 0) return (
    <div className="flex flex-col items-center justify-center py-24 sm:py-32 px-4">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <ShoppingBag className="w-10 h-10 text-gray-400" />
      </div>
      <h2 className="text-3xl font-black text-gray-900 mb-2">Your cart is empty</h2>
      <p className="text-gray-500 mb-8 text-center max-w-sm">Looks like you haven't added any items to your cart yet. Browse our menu to find something delicious!</p>
      <Link to="/menu" className="bg-primary-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all">
        Browse Menu
      </Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-full transition-colors hidden sm:block">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Your <span className="text-primary-600">Cart</span></h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <motion.div 
              layout
              key={item._id} 
              className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-gray-100 flex items-center p-3 sm:p-5 group transition-all hover:shadow-md h-28 sm:h-36"
            >
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0">
                  <img src={getImageUrl(item.image)} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="ml-4 sm:ml-6 flex-grow min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-base sm:text-lg text-gray-900 truncate pr-2">{item.name}</h3>
                      <p className="text-gray-400 text-xs sm:text-sm font-medium">Standard Portion</p>
                    </div>
                    <button onClick={() => removeFromCart(item._id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                        <Trash2 className="w-5 h-5"/>
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-2 sm:mt-4">
                    <div className="flex items-center space-x-3 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                      <span className="text-sm font-black text-gray-700">{item.qty} ×</span>
                      <span className="text-sm font-bold text-primary-600">${item.price.toFixed(2)}</span>
                    </div>
                    <span className="font-black text-lg text-gray-900">${(item.qty * item.price).toFixed(2)}</span>
                  </div>
                </div>
            </motion.div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1 sticky top-24">
          <div className="bg-white rounded-[32px] shadow-xl shadow-black/5 border border-gray-100 overflow-hidden">
            <div className="p-6 sm:p-8 space-y-4">
              <h3 className="text-xl font-bold text-gray-900 border-b border-gray-50 pb-4">Order Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Delivery Fee</span>
                  <span className="font-bold text-gray-900">${shipping.toFixed(2)}</span>
                </div>
                <div className="pt-4 mt-4 border-t border-gray-50 flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total Price</span>
                  <span className="text-3xl font-black text-primary-600">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-primary-50 p-4 rounded-2xl border border-primary-100 mt-6">
                <div className="flex items-center gap-3 text-primary-700">
                  <CreditCard className="w-5 h-5 flex-shrink-0" />
                  <p className="text-xs font-bold leading-snug">Payment will be collected as Cash on Delivery for this order.</p>
                </div>
              </div>

              <button 
                onClick={checkoutHandler}
                disabled={ordering}
                className="w-full bg-primary-600 text-white font-black py-5 rounded-[20px] shadow-lg shadow-primary-100 hover:bg-primary-700 disabled:opacity-50 transition-all transform active:scale-95 flex items-center justify-center gap-2 mt-4"
              >
                {ordering ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Placing Order...
                  </>
                ) : 'Place My Order'}
              </button>
            </div>
          </div>

          <div className="mt-6 px-4">
            <p className="text-xs text-center text-gray-400 leading-relaxed font-medium">
              By placing this order, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
