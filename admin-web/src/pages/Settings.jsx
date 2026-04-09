import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { Settings as SettingsIcon, User, Lock, Bell, Globe, Save, CreditCard } from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [shippingFee, setShippingFee] = useState('5.00');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/auth/profile', { name, email });
      alert('Settings updated successfully!');
    } catch (error) {
      alert('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center">
            <SettingsIcon className="w-8 h-8 mr-3 text-primary-600" />
            System Settings
        </h2>
        <p className="text-gray-500 font-medium">Control your administrative profile and global platform parameters</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="md:col-span-1 space-y-2">
            {[
                { label: 'General', icon: Globe, active: true },
                { label: 'Security', icon: Lock },
                { label: 'Notifications', icon: Bell },
                { label: 'Payments', icon: CreditCard }
            ].map((item, i) => (
                <button key={i} className={`w-full flex items-center space-x-3 p-4 rounded-2xl font-bold transition-all ${item.active ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'text-gray-400 hover:bg-white hover:text-gray-600'}`}>
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                </button>
            ))}
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 space-y-6">
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl shadow-black/5">
                <form onSubmit={handleUpdate} className="space-y-8">
                    <div className="space-y-6">
                        <div className="border-b border-gray-50 pb-4">
                            <h3 className="text-xl font-black text-gray-900">Admin Profile</h3>
                            <p className="text-sm text-gray-400">Update your internal administrative credentials</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                                <div className="relative text-gray-400 focus-within:text-primary-600 transition-colors">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" />
                                    <input 
                                        type="text" 
                                        value={name} 
                                        onChange={e=>setName(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 font-bold text-gray-900"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                                <input 
                                    type="email" 
                                    value={email} 
                                    onChange={e=>setEmail(e.target.value)}
                                    className="w-full px-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 font-bold text-gray-900"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 pt-6">
                        <div className="border-b border-gray-50 pb-4">
                            <h3 className="text-xl font-black text-gray-900">Global Parameters</h3>
                            <p className="text-sm text-gray-400">Configure logistics and default costs</p>
                        </div>
                        
                        <div className="space-y-2 w-full md:w-1/2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Standard Delivery Fee ($)</label>
                            <input 
                                type="number" 
                                value={shippingFee} 
                                onChange={e=>setShippingFee(e.target.value)}
                                className="w-full px-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 font-bold text-gray-900"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-gray-900 text-white font-black py-5 rounded-3xl shadow-2xl hover:bg-black transition-all transform active:scale-95 flex items-center justify-center space-x-3"
                    >
                        {loading ? <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" /> : (
                            <>
                                <Save className="w-5 h-5" />
                                <span>Save Changes</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
