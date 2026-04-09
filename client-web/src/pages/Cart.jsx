import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

const Cart = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ordering, setOrdering] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

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
        shippingPrice: 5,
        totalPrice: subtotal + 5
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

  if (cartItems.length === 0) return <div className="text-center py-20 text-2xl font-bold">Your Cart is Empty!</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-8 border-b pb-4">Shopping Cart</h2>
      <div className="bg-white shadow-sm rounded-2xl border border-gray-100 p-6 space-y-6">
        {cartItems.map((item) => (
          <div key={item._id} className="flex items-center justify-between border-b pb-4">
             <div className="flex items-center space-x-4">
                <img src={item.image || 'https://via.placeholder.com/100'} className="w-16 h-16 rounded-xl object-cover" />
                <div>
                   <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
                   <p className="text-gray-500">Qty: {item.qty} x ${item.price.toFixed(2)}</p>
                </div>
             </div>
             <div className="flex items-center space-x-6">
                <span className="font-extrabold text-lg">${(item.qty * item.price).toFixed(2)}</span>
                <button onClick={() => removeFromCart(item._id)} className="text-red-400 hover:text-red-600">
                    <Trash2 className="w-5 h-5"/>
                </button>
             </div>
          </div>
        ))}
        
        <div className="pt-6 flex justify-between items-center bg-gray-50 p-6 rounded-xl">
           <span className="text-xl font-bold">Total:</span>
           <span className="text-3xl font-extrabold text-primary-600">${subtotal.toFixed(2)}</span>
        </div>
        
        <button 
           onClick={checkoutHandler}
           disabled={ordering}
           className="w-full bg-primary-600 text-white font-bold py-4 rounded-xl shadow-md hover:bg-primary-700 disabled:opacity-50"
        >
          {ordering ? 'Placing Order...' : 'Proceed to Checkout'}
        </button>
      </div>
    </div>
  );
};

export default Cart;
