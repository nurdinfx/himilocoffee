import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Users, UtensilsCrossed, Settings, LogOut, Menu as MenuIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transition-all duration-300 lg:relative
        ${sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0 w-20'}
      `}>
        <div className="h-16 flex items-center justify-between border-b border-gray-200 px-4 whitespace-nowrap overflow-hidden">
          <span className={`text-xl font-bold text-primary-600 transition-all duration-300 ${!sidebarOpen && 'lg:opacity-0'}`}>
            {sidebarOpen ? 'Himilo Admin' : 'HA'}
          </span>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-4rem)] custom-scrollbar">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => { if (window.innerWidth < 1024) setSidebarOpen(false); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                  isActive 
                    ? 'bg-primary-50 text-primary-600 font-bold shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                title={!sidebarOpen ? item.name : ''}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-500'}`} />
                <span className={`transition-all duration-300 whitespace-nowrap ${!sidebarOpen && 'lg:hidden lg:opacity-0'}`}>
                  {item.name}
                </span>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 flex-shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-500 hover:text-primary-600 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              aria-label="Toggle Sidebar"
            >
              <MenuIcon className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold text-gray-800 hidden sm:block">
              {navigation.find(n => n.href === location.pathname)?.name || 'Admin'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-2 lg:space-x-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="font-bold text-gray-900 text-sm">{admin?.name || 'Administrator'}</span>
              <span className="text-xs text-gray-500 capitalize">{admin?.role || 'Admin'}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center font-black uppercase shadow-inner border border-primary-200">
              {admin?.name?.charAt(0) || 'A'}
            </div>
            <div className="w-px h-6 bg-gray-200 mx-2 hidden sm:block"></div>
            <button 
              onClick={logout} 
              className="p-2 text-gray-400 hover:text-red-500 transition-all hover:bg-red-50 rounded-lg"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 lg:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
