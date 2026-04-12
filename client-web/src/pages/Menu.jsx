import { useState, useEffect } from 'react';
import api, { BASE_URL } from '../services/api';
import { Search } from 'lucide-react';

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
        : `${BASE_URL}${product.image}`;

    
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 gap-4">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Our <span className="text-primary-600">Menu</span></h1>
        <div className="w-full sm:w-auto flex items-center bg-white border border-gray-100 rounded-2xl px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-primary-500 transition-all">
           <Search size={20} className="text-gray-400 mr-2" />
           <input type="text" placeholder="Search menu..." className="bg-transparent border-none focus:ring-0 w-full sm:w-48 text-sm font-medium" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
        {products.map((product) => (
          <div key={product._id} className="group bg-white rounded-[32px] overflow-hidden shadow-xl shadow-black/5 hover:shadow-primary-500/10 transition-all border border-gray-100 p-2 sm:p-3">
            <div className="relative h-48 sm:h-64 rounded-[24px] sm:rounded-[26px] overflow-hidden mb-4 sm:mb-6 bg-gray-50">
                {renderProductImage(product)}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl flex items-center shadow-sm sm:hidden group-hover:flex transition-all">
                    <ShoppingBagIcon size={12} className="text-primary-600 mr-1" />
                    <span className="text-[10px] font-black uppercase text-gray-900">Add Quick</span>
                </div>
            </div>
            <div className="px-3 pb-3 sm:px-4 sm:pb-4">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{product.name}</h3>
              <p className="text-gray-500 text-xs sm:text-sm mt-1 h-10 overflow-hidden line-clamp-2 leading-snug">{product.description}</p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-xl sm:text-2xl font-black text-primary-600">${product.price.toFixed(2)}</span>
                <button 
                  onClick={() => addToCart(product)}
                  className="bg-primary-50 text-primary-600 hover:bg-primary-600 hover:text-white p-3 sm:p-4 rounded-2xl transition-all transform active:scale-90 shadow-sm"
                >
                  <ShoppingBagIcon className="w-5 h-5 sm:w-6 sm:h-6" />
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
