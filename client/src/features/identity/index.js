import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';

export { default as AuthLayout } from './components/AuthLayout';
export { default as LogoutButton } from './components/LogoutButton';
export { AuthProvider, useAuth } from './hooks/AuthContext';
export { LoginPage, ProfilePage, RegisterPage };

export const identityRoutes = [
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
  { path: '/profile', component: ProfilePage }
];
