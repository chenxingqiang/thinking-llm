import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import { ProtocolDetail } from '../pages/ProtocolDetail';
import { CreateProtocol } from '../pages/CreateProtocol';
import { ExploreProtocols } from '../pages/ExploreProtocols';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route
        path="/protocol/:id"
        element={
          <ProtectedRoute>
            <ProtocolDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create"
        element={
          <ProtectedRoute>
            <CreateProtocol />
          </ProtectedRoute>
        }
      />
      <Route path="/explore" element={<ExploreProtocols />} />
    </Routes>
  );
}; 