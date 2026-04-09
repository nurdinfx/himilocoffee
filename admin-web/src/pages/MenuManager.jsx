import { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const MenuManager = () => {
   const [products, setProducts] = useState([]);
   const [categories, setCategories] = useState([]);
   const [loading, setLoading] = useState(true);
   const [showModal, setShowModal] = useState(false);
   
   // Form state
   const [name, setName] = useState('');
   const [price, setPrice] = useState('');
   const [description, setDescription] = useState('');
   const [category, setCategory] = useState('');
   const [image, setImage] = useState('');
   const [editId, setEditId] = useState(null);

   useEffect(() => {
     fetchData();
   }, []);

   const fetchData = async () => {
      try {
         const [prodRes, catRes] = await Promise.all([
             api.get('/products'),
             api.get('/products') // Assuming categories can be derived or fetched separately
         ]);
         setProducts(prodRes.data);
         const uniqueCats = Array.from(new Set(prodRes.data.map(p => p.category?.name))).filter(Boolean);
         setCategories(uniqueCats);
      } catch (e) {
         console.error(e);
      } finally {
         setLoading(false);
      }
   };

   const resetForm = () => {
       setName('');
       setPrice('');
       setDescription('');
       setCategory('');
       setImage('');
       setEditId(null);
   };

   const handleSubmit = async (e) => {
       e.preventDefault();
       const productData = { name, price: Number(price), description, category, image };
       try {
           if (editId) {
               await api.put(`/products/${editId}`, productData);
               alert('Product updated successfully!');
           } else {
               await api.post('/products', productData);
               alert('Product created successfully!');
           }
           setShowModal(false);
           resetForm();
           fetchData();
       } catch (error) {
           alert('Failed to save product');
       }
   };

   const handleDelete = async (id) => {
       if (window.confirm('Are you sure you want to delete this item?')) {
           try {
               await api.delete(`/products/${id}`);
               setProducts(products.filter(p => p._id !== id));
           } catch (error) {
               alert('Delete failed');
           }
       }
   };

   const openEditModal = (product) => {
       setEditId(product._id);
       setName(product.name);
       setPrice(product.price);
       setDescription(product.description || '');
       setCategory(product.category?._id || product.category || '');
       setImage(product.image || '');
       setShowModal(true);
   };

   if (loading) return <div className="p-6 text-gray-500">Loading catalog...</div>;

   return (
      <div className="space-y-6">
         <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Menu Catalog</h2>
            <button onClick={() => { resetForm(); setShowModal(true); }} className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors">
               <Plus className="w-5 h-5" />
               <span>Add Item</span>
            </button>
         </div>

         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-gray-50 text-gray-600 text-sm border-b">
                     <th className="p-4 font-semibold">Image</th>
                     <th className="p-4 font-semibold">Name</th>
                     <th className="p-4 font-semibold">Category</th>
                     <th className="p-4 font-semibold">Price</th>
                     <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                  {products.map((item) => (
                     <tr key={item._id} className="hover:bg-gray-50">
                        <td className="p-4">
                           <div className="w-16 h-16 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 p-0.5">
                              <img 
                                className="h-full w-full object-cover rounded-xl shadow-inner shadow-black/5" 
                                src={item.image?.startsWith('http') ? item.image : `http://localhost:5000${item.image}`} 
                                alt={item.name} 
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop';
                                }}
                              />
                           </div>
                        </td>
                        <td className="p-4 font-medium text-gray-900">{item.name}</td>
                        <td className="p-4 text-gray-500">{item.category?.name || 'Uncategorized'}</td>
                        <td className="p-4 font-bold text-gray-900">${item.price.toFixed(2)}</td>
                        <td className="p-4 flex justify-end space-x-3">
                           <button onClick={() => openEditModal(item)} className="text-blue-500 hover:text-blue-700 p-2"><Edit2 className="w-4 h-4"/></button>
                           <button onClick={() => handleDelete(item._id)} className="text-red-500 hover:text-red-700 p-2"><Trash2 className="w-4 h-4"/></button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>

         {/* Create/Edit Modal */}
         {showModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
               <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
                  <h3 className="text-xl font-bold mb-4">{editId ? 'Edit Menu Item' : 'Add Menu Item'}</h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input type="text" required value={name} onChange={e=>setName(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-primary-500 font-medium" />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                           <input type="number" step="0.01" required value={price} onChange={e=>setPrice(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-primary-500" />
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                           <input type="text" placeholder="Category ID" value={category} onChange={e=>setCategory(e.target.value)} className="w-full p-2 border rounded-lg" />
                        </div>
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                        <input type="text" value={image} onChange={e=>setImage(e.target.value)} className="w-full p-2 border rounded-lg" placeholder="https://..." />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea rows="3" required value={description} onChange={e=>setDescription(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-primary-500"></textarea>
                     </div>
                     <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={()=>{ setShowModal(false); resetForm(); }} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium">
                           {editId ? 'Update Item' : 'Create Item'}
                        </button>
                     </div>
                  </form>
               </div>
            </div>
         )}
      </div>
   );
};

export default MenuManager;
