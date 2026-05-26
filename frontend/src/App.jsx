import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import RestaurantBrowse from './pages/RestaurantBrowse';
import RestaurantDetails from './pages/RestaurantDetails';
import Cart from './pages/Cart';
import OrderTracking from './pages/OrderTracking';
import OrderHistory from './pages/OrderHistory';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 py-8">
          <Routes>
            {/* Public Auth boundaries */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Customer routes */}
            <Route path="/" element={
              <ProtectedRoute allowedRoles={['CUSTOMER', 'RESTAURANT_OWNER']}>
                <RestaurantBrowse />
              </ProtectedRoute>
            } />
            
            <Route path="/restaurant/:id" element={
              <ProtectedRoute allowedRoles={['CUSTOMER', 'RESTAURANT_OWNER']}>
                <RestaurantDetails />
              </ProtectedRoute>
            } />

            <Route path="/cart" element={
              <ProtectedRoute allowedRoles={['CUSTOMER']}>
                <Cart />
              </ProtectedRoute>
            } />

            <Route path="/orders" element={
              <ProtectedRoute allowedRoles={['CUSTOMER']}>
                <OrderHistory />
              </ProtectedRoute>
            } />

            <Route path="/order-tracking/:orderId" element={
              <ProtectedRoute allowedRoles={['CUSTOMER']}>
                <OrderTracking />
              </ProtectedRoute>
            } />

            {/* Protected Owner routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['RESTAURANT_OWNER']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            {/* Fallbacks */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
