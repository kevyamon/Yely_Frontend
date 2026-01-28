// src/routes/adminRoutes.jsx

import { Navigate } from 'react-router-dom';
import AdminLayout from '../pages/admin/AdminLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
import ValidationCenter from '../pages/admin/ValidationCenter';
import UsersManagement from '../pages/admin/UsersManagement';
import FinancePage from '../pages/admin/FinancePage';

const adminRoutes = {
  path: '/admin',
  element: <AdminLayout />,
  children: [
    {
      index: true,
      element: <Navigate to="/admin/dashboard" replace />
    },
    {
      path: 'dashboard',
      element: <AdminDashboard />
    },
    {
      path: 'validations',
      element: <ValidationCenter />
    },
    {
      path: 'users',
      element: <UsersManagement />
    },
    {
      path: 'finance',
      element: <FinancePage />
    }
  ]
};

export default adminRoutes;