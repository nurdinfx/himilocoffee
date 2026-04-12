import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Users, UtensilsCrossed, Settings, LogOut, Menu as MenuIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const { admin, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Orders', href: '/orders', icon: ShoppingBag },
    { name: 'Menu', href: '/menu', icon: UtensilsCrossed },
    { name: 'Customers', href: '/customers', icon: Users },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden relative">
      {/* Sidebar Overlay for Mobile */}
      {!sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transition-all duration-300 lg:relative
        ${sidebarOpen ? '-translate-x-full lg:translate-x-0 w-20 lg:w-20' : 'translate-x-0 w-64 lg:w-64'}
      `}>
        <div className="h-16 flex items-center justify-between border-b border-gray-200 px-4">
          <span className="text-xl font-bold text-primary-600 truncate">
            {sidebarOpen ? 'HA' : 'Himilo Admin'}
          </span>
          <button 
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-1 text-gray-500 hover:text-gray-700"
          >
            <MenuIcon className="w-6 h-6" />
          </button>
        </div>
        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-4rem)]">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => { if (window.innerWidth < 1024) setSidebarOpen(true); }}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive 
                    ? 'bg-primary-50 text-primary-600 font-medium' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className={`transition-opacity duration-300 ${sidebarOpen ? 'lg:opacity-0 lg:hidden' : 'opacity-100'}`}>
                  {item.name}
                </span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-500 hover:text-gray-700 p-2"
          >
            <MenuIcon className="w-6 h-6" />
          </button>
          
          <div className="flex items-center space-x-2 lg:space-x-4">
            <span className="font-semibold text-gray-700 hidden sm:block truncate max-w-[150px]">{admin?.name || 'Administrator'}</span>
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold uppercase flex-shrink-0">
              {admin?.name?.charAt(0) || 'A'}
            </div>
            <button onClick={logout} className="p-2 text-gray-600 hover:text-red-500 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 lg:p-6 pb-20 lg:pb-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
