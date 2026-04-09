import { useState, useEffect } from 'react';
import api from '../services/api';
import { User, Mail, Shield, Calendar, Search, Filter, MoreVertical } from 'lucide-react';

const CustomersManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/auth/users');
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="p-6 space-y-4">
      <div className="h-8 bg-gray-100 rounded-lg w-1/4 animate-pulse" />
      <div className="h-64 bg-gray-50 rounded-2xl animate-pulse" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-3xl font-black text-gray-900 tracking-tight">User Directory</h2>
           <p className="text-gray-500 font-medium">Manage your customers and staff permissions</p>
        </div>
        <div className="bg-primary-50 text-primary-600 font-black px-6 py-2 rounded-2xl text-sm border border-primary-100">
           {users.length} Active Accounts
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
         <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
               type="text"
               placeholder="Search by name or email..."
               className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-primary-500 font-medium"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         <button className="flex items-center space-x-2 bg-white border border-gray-100 px-6 py-4 rounded-2xl font-bold text-gray-600 shadow-sm hover:bg-gray-50">
            <Filter className="w-5 h-5" />
            <span>Filter Roles</span>
         </button>
      </div>

      <div className="bg-white rounded-[32px] shadow-xl shadow-black/5 border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-[10px] uppercase font-black tracking-[2px] border-b border-gray-100">
                <th className="p-6">User Identification</th>
                <th className="p-6">Access Role</th>
                <th className="p-6">Joining Date</th>
                <th className="p-6 text-right w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 border border-primary-100">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-black text-gray-900 text-lg leading-tight">{u.name}</p>
                        <p className="text-sm text-gray-500 flex items-center mt-1 font-medium">
                          <Mail className="w-3.5 h-3.5 mr-1.5 text-gray-300" /> {u.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center w-fit
                      ${u.role === 'admin' ? 'bg-red-50 text-red-600 border border-red-100' : 
                        u.role === 'driver' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                      <Shield className="w-3.5 h-3.5 mr-1.5" />
                      {u.role}
                    </span>
                  </td>
                  <td className="p-6">
                    <span className="flex items-center text-gray-500 font-bold text-sm">
                      <Calendar className="w-4 h-4 mr-2 text-gray-200" />
                      {new Date(u.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <button className="text-gray-300 hover:text-gray-600 transition-colors">
                        <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomersManager;
