import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { User, Mail, Phone, MapPin, Save } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.addresses?.[0]?.street || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const { data } = await api.put('/auth/profile', {
        name,
        email,
        phone,
        addresses: [{ street: address, city: 'Default City', lat: 0, lng: 0 }]
      });
      alert('Profile updated successfully!');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-8 border-b pb-4">Account Settings</h2>
      
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <form onSubmit={handleUpdate} className="space-y-6">
          {message && <div className="bg-red-50 text-red-500 p-4 rounded-xl">{message}</div>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center">
                <User className="w-4 h-4 mr-2" /> Full Name
              </label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-primary-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center">
                <Mail className="w-4 h-4 mr-2" /> Email Address
              </label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-primary-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center">
                <Phone className="w-4 h-4 mr-2" /> Phone Number
              </label>
              <input 
                type="text" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-primary-500"
                placeholder="+1 234 567 890"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center">
                <MapPin className="w-4 h-4 mr-2" /> Default Delivery Address
              </label>
              <input 
                type="text" 
                value={address} 
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-primary-500"
                placeholder="Street Address, City"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full md:w-auto bg-primary-600 text-white font-bold px-10 py-4 rounded-xl shadow-md hover:bg-primary-700 flex items-center justify-center space-x-2"
          >
            <Save className="w-5 h-5" />
            <span>{loading ? 'Saving Changes...' : 'Save Profile'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
