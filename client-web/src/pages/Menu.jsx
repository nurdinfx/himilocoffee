import { useState, useEffect } from 'react';
import api from '../services/api';
import { useCart } from '../contexts/CartContext';

import { MenuSkeleton } from '../components/Skeleton';

// Inline ShoppingBag SVG for absolute stability
const ShoppingBagIcon = ({ className, size = 20 }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
);

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <MenuSkeleton />;

  const renderProductImage = (product) => {
    const imageUrl = product.image?.startsWith('http') 
        ? product.image 
        : `http://localhost:5000${product.image}`;
    
    return (
        <img 
            src={imageUrl} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop';
            }}
        />
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Our <span className="text-primary-600">Menu</span></h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div key={product._id} className="group bg-white rounded-[32px] overflow-hidden shadow-xl shadow-black/5 hover:shadow-primary-500/10 transition-all border border-gray-100 p-2">
            <div className="relative h-64 rounded-[26px] overflow-hidden mb-6 bg-gray-50">
                {renderProductImage(product)}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl flex-row items-center hidden group-hover:flex">
                    <ShoppingBagIcon size={14} className="text-primary-600 mr-1" />
                    <span className="text-[10px] font-black uppercase text-gray-900">Add Quick</span>
                </div>
            </div>
            <div className="p-5">
              <h3 className="text-xl font-bold text-gray-900 truncate">{product.name}</h3>
              <p className="text-gray-500 text-sm mt-1 h-10 overflow-hidden">{product.description}</p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-2xl font-extrabold text-primary-600">${product.price.toFixed(2)}</span>
                <button 
                  onClick={() => addToCart(product)}
                  className="bg-primary-50 text-primary-600 hover:bg-primary-600 hover:text-white p-3 rounded-full transition-colors"
                >
                  <ShoppingBagIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
