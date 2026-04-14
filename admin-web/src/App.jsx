import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import DashboardStats from './pages/DashboardStats';
import OrdersManager from './pages/OrdersManager';
import MenuManager from './pages/MenuManager';
import CustomersManager from './pages/CustomersManager';
import Settings from './pages/Settings';
import ReloadPrompt from './components/ReloadPrompt';

const ProtectedRoute = ({ children }) => {
  const { admin } = useAuth();
  if (!admin) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<DashboardStats />} />
            <Route path="orders" element={<OrdersManager />} />
            <Route path="menu" element={<MenuManager />} />
            <Route path="customers" element={<CustomersManager />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
      <ReloadPrompt />
    </AuthProvider>
  );
}

export default App;
