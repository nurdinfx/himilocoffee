import { useState, useEffect } from 'react';
import api, { BASE_URL } from '../services/api';
import { Plus, Edit2, Trash2, Image as ImageIcon, Filter, X, ChevronRight, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getImageUrl } from '../utils/getImageUrl';

const SearchIcon = ({ className, size = 20 }) => (
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
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
    </svg>
);

const MenuManager = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showCatModal, setShowCatModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    
    // Form state
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState('');
    const [uploading, setUploading] = useState(false);
    const [editId, setEditId] = useState(null);

    // New Category state
    const [newCatName, setNewCatName] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [prodRes, catRes] = await Promise.all([
                api.get('/products'),
                api.get('/categories')
            ]);
            setProducts(prodRes.data);
            setCategories(catRes.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            setUploading(true);
            const { data } = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setImage(data.url);
        } catch (error) {
            alert('Image upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/categories', { name: newCatName });
            setCategories([...categories, data]);
            setCategory(data._id);
            setNewCatName('');
            setShowCatModal(false);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to add category');
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
            } else {
                await api.post('/products', productData);
            }
            setShowModal(false);
            resetForm();
            fetchData();
        } catch (error) {
            alert('Failed to save product');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this item forever?')) {
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

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'All' || p.category?.name === filterCategory;
        return matchesSearch && matchesCategory;
    });

    if (loading) return (
        <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
            <p className="text-gray-400 font-medium animate-pulse">Loading Catalog...</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tight">Menu Catalog</h2>
                    <p className="text-gray-500 font-medium mt-1">Manage your shop's items and categories</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => { resetForm(); setShowModal(true); }} 
                        className="group flex items-center space-x-2 bg-gray-900 hover:bg-black text-white px-6 py-4 rounded-[20px] font-bold shadow-xl shadow-black/10 transition-all active:scale-95"
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                        <span>Add New Item</span>
                    </button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-8 relative group">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors w-5 h-5" />
                    <input 
                        type="text" 
                        placeholder="Search products..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border-2 border-transparent rounded-[20px] focus:border-primary-500 shadow-sm focus:shadow-xl focus:shadow-primary-500/10 transition-all outline-none font-medium"
                    />
                </div>
                <div className="md:col-span-4 relative">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    <select 
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border-2 border-transparent rounded-[20px] appearance-none shadow-sm font-bold text-gray-700 outline-none cursor-pointer hover:shadow-md transition-all"
                    >
                        <option value="All">All Categories</option>
                        {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                    </select>
                </div>
            </div>

            {/* Catalog Grid/Table */}
            <div className="bg-white rounded-[32px] shadow-2xl shadow-black/5 border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-400 text-[11px] font-black uppercase tracking-[2px] border-b border-gray-100">
                                <th className="px-8 py-6">Visual</th>
                                <th className="px-6 py-6 font-black text-gray-900">Details</th>
                                <th className="px-6 py-6 text-center">Category</th>
                                <th className="px-6 py-6 text-center">Price</th>
                                <th className="px-8 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredProducts.map((item) => (
                                <motion.tr 
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    key={item._id} 
                                    className="group hover:bg-gray-50/50 transition-colors"
                                >
                                    <td className="px-8 py-6">
                                        <div className="w-20 h-20 bg-gray-100 rounded-[24px] overflow-hidden border-2 border-white shadow-xl group-hover:scale-105 transition-transform">
                                            <img 
                                                className="h-full w-full object-cover" 
                                                src={getImageUrl(item.image)} 
                                                alt={item.name} 
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200';
                                                }}
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="space-y-1">
                                            <div className="font-black text-gray-900 text-lg group-hover:text-primary-600 transition-colors">{item.name}</div>
                                            <div className="text-gray-400 text-sm font-medium line-clamp-1 max-w-xs">{item.description}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-center">
                                        <span className="inline-flex px-4 py-1.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-black uppercase tracking-wider">
                                            {item.category?.name || 'Uncategorized'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-6 text-center">
                                        <div className="font-black text-gray-900 text-xl tracking-tighter">${item.price.toFixed(2)}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex justify-end space-x-2">
                                            <button onClick={() => openEditModal(item)} className="p-3 bg-white border border-gray-100 rounded-2xl text-blue-500 hover:bg-blue-500 hover:text-white hover:shadow-lg hover:shadow-blue-500/20 transition-all active:scale-90">
                                                <Edit2 className="w-4 h-4"/>
                                            </button>
                                            <button onClick={() => handleDelete(item._id)} className="p-3 bg-white border border-gray-100 rounded-2xl text-red-500 hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-500/20 transition-all active:scale-90">
                                                <Trash2 className="w-4 h-4"/>
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create/Edit Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-gray-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-[40px] p-8 w-full max-w-2xl shadow-2xl relative overflow-hidden"
                        >
                            <button onClick={()=>{ setShowModal(false); resetForm(); }} className="absolute right-6 top-6 p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-6 h-6 text-gray-400" />
                            </button>
                            
                            <div className="mb-8">
                                <h3 className="text-3xl font-black text-gray-900 tracking-tight">{editId ? 'Refine Product' : 'New Creation'}</h3>
                                <p className="text-gray-400 font-medium">Capture the essence of your dish</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-6">
                                        <div className="relative group">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 mb-1 block">Item Name</label>
                                            <input type="text" required value={name} onChange={e=>setName(e.target.value)} className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-[20px] focus:bg-white focus:border-primary-500 transition-all font-bold text-gray-900 outline-none" placeholder="e.g. Classic Latte" />
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 mb-1 block">Price</label>
                                                <input type="number" step="0.01" required value={price} onChange={e=>setPrice(e.target.value)} className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-[20px] focus:bg-white focus:border-primary-500 transition-all font-bold text-gray-900 outline-none" placeholder="0.00" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 mb-1 block">Category</label>
                                                <div className="flex gap-2">
                                                    <select 
                                                        required 
                                                        value={category} 
                                                        onChange={e=>setCategory(e.target.value)} 
                                                        className="flex-1 px-4 py-4 bg-gray-50 border-2 border-transparent rounded-[20px] focus:bg-white focus:border-primary-500 transition-all font-bold text-gray-900 outline-none appearance-none"
                                                    >
                                                        <option value="">Select</option>
                                                        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                                    </select>
                                                    <button type="button" onClick={() => setShowCatModal(true)} className="p-4 bg-primary-50 text-primary-600 rounded-[20px] hover:bg-primary-100 transition-colors">
                                                        <Plus className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 mb-1 block">Visual Representation</label>
                                        <div className="relative aspect-square bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden group">
                                            {image ? (
                                                <>
                                                    <img src={getImageUrl(image)} className="w-full h-full object-cover" alt="Preview" />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity z-10">
                                                        <label className="cursor-pointer bg-white px-4 py-2 rounded-full font-bold text-xs">Replace Photo</label>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className={`flex flex-col items-center ${uploading ? 'animate-pulse' : ''}`}>
                                                        <Upload className="w-10 h-10 text-gray-300 mb-2" />
                                                        <span className="text-xs font-bold text-gray-400">{uploading ? 'Uploading...' : 'Click to upload'}</span>
                                                    </div>
                                                </>
                                            )}
                                            <input 
                                                type="file" 
                                                className="absolute inset-0 opacity-0 cursor-pointer" 
                                                onChange={handleFileUpload}
                                                accept="image/*"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 mb-1 block">Story/Description</label>
                                    <textarea rows="3" required value={description} onChange={e=>setDescription(e.target.value)} className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-[20px] focus:bg-white focus:border-primary-500 transition-all font-medium text-gray-900 outline-none" placeholder="Describe the flavors..." />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button type="button" onClick={()=>{ setShowModal(false); resetForm(); }} className="flex-1 py-4 bg-gray-100 text-gray-600 font-black rounded-[20px] hover:bg-gray-200 transition-all active:scale-95">Cancel</button>
                                    <button 
                                        type="submit" 
                                        disabled={!category || category.length < 12}
                                        className={`flex-[2] py-4 text-white font-black rounded-[20px] shadow-xl transition-all active:scale-95 ${(!category || category.length < 12) ? 'bg-gray-300 cursor-not-allowed shadow-none' : 'bg-primary-600 shadow-primary-500/20 hover:bg-primary-700'}`}
                                    >
                                        {editId ? 'Save Changes' : 'Initialize Item'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Quick Category Modal */}
            <AnimatePresence>
                {showCatModal && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4 font-inter"
                    >
                        <motion.div 
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="bg-white rounded-[32px] p-8 w-full max-w-sm shadow-2xl shadow-black/20 text-center"
                        >
                            <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Plus className="w-8 h-8" />
                            </div>
                            <h4 className="text-2xl font-black text-gray-900 mb-2">New Category</h4>
                            <p className="text-gray-400 font-medium mb-6">Group your items by theme</p>
                            
                            <form onSubmit={handleAddCategory} className="space-y-4">
                                <input 
                                    type="text" 
                                    autoFocus
                                    placeholder="Category Name" 
                                    value={newCatName} 
                                    onChange={e=>setNewCatName(e.target.value)} 
                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-[20px] focus:bg-white focus:border-primary-500 transition-all font-bold text-gray-900 outline-none"
                                />
                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={()=>setShowCatModal(false)} className="flex-1 py-4 text-gray-400 font-bold hover:text-gray-900 transition-colors">Discard</button>
                                    <button type="submit" className="flex-[2] py-4 bg-gray-900 text-white font-black rounded-[20px] shadow-lg hover:bg-black transition-all active:scale-95">Confirm</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MenuManager;
