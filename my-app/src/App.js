import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminItemsPage from './pages/AdminItemsPage';
import AdminCategoriesPage from './pages/AdminCategoriesPage';
import ManageTablesPage from './pages/ManageTablesPage';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/items"
            element={
              <PrivateRoute>
                <AdminItemsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <PrivateRoute>
                <AdminCategoriesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/tables"
            element={
              <PrivateRoute>
                <ManageTablesPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
