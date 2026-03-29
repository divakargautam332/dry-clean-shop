import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';  // ✅ Remove Router import
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ServiceProvider } from './context/ServiceContext';
import { OrderProvider } from './context/OrderContext';
import { ThemeProvider } from './context/ThemeContext';
// import { ReviewProvider } from './context/ReviewContext';

// Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import PrivateRoute from './routes/PrivateRoute';
import AdminRoute from './routes/AdminRoute';

// User Pages
import Home from './pages/user/Home';
import Login from './pages/user/Login';
import Register from './pages/user/Register';
import Services from './pages/user/Services';
import ServiceDetail from './pages/user/ServiceDetail';
import Cart from './pages/user/Cart';
import WriteReview from './pages/user/WriteReview';
import Checkout from './pages/user/Checkout';
import TrackOrder from './pages/user/TrackOrder';
import Dashboard from './pages/user/Dashboard';
import MyOrders from './pages/user/MyOrders';
import OrderDetail from './pages/user/OrderDetail';
import Profile from './pages/user/Profile';
import AddressBook from './pages/user/AddressBook';
import Contact from './pages/user/Contact';
import FAQ from './pages/user/FAQ';
import PrivacyPolicy from './pages/user/PrivacyPolicy';
import TermsConditions from './pages/user/TermsConditions';
import RefundPolicy from './pages/user/RefundPolicy';
import ShippingPolicy from './pages/user/ShippingPolicy';
import CancellationPolicy from './pages/user/CancellationPolicy';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import OrdersList from './pages/admin/OrdersList';
import OrderDetails from './pages/admin/OrderDetails';
import ServicesManage from './pages/admin/ServicesManage';
import AddService from './pages/admin/AddService';
import EditService from './pages/admin/EditService';
import CustomersList from './pages/admin/CustomersList';
import CustomerDetail from './pages/admin/CustomerDetail';
import CouponsManage from './pages/admin/CouponsManage';
import AddCoupon from './pages/admin/AddCoupon';
import DeliveryStaff from './pages/admin/DeliveryStaff';
import AddStaff from './pages/admin/AddStaff';
import ReviewsManage from './pages/admin/ReviewsManage';
import Reports from './pages/admin/Reports';
import Settings from './pages/admin/Settings';
import AdminProfile from './pages/admin/Profile';

function App() {
  return (
    <BrowserRouter>  {/* ✅ Only BrowserRouter - NO Router */}
      <ThemeProvider>
        <AuthProvider>
          <ServiceProvider>
            <CartProvider>
              <OrderProvider>
                <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
                  {/* Fixed Navbar */}
                  <Navbar />

                  {/* Main Content - pt-20 adds padding top to avoid navbar overlap */}
                  <main className="flex-grow pt-20">
                    <Routes>
                      {/* ============= PUBLIC ROUTES ============= */}
                      <Route path="/" element={<Home />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/services" element={<Services />} />
                      <Route path="/services/:id" element={<ServiceDetail />} />

                      {/* Track Order Routes - Both versions */}
                      <Route path="/track-order" element={<TrackOrder />} />
                      <Route path="/track-order/:orderNumber" element={<TrackOrder />} />

                      <Route path="/contact" element={<Contact />} />
                      <Route path="/faq" element={<FAQ />} />

                      {/* ============= PROTECTED USER ROUTES ============= */}
                      <Route path="/cart" element={
                        <PrivateRoute>
                          <Cart />
                        </PrivateRoute>
                      } />
                      <Route path="/checkout" element={
                        <PrivateRoute>
                          <Checkout />
                        </PrivateRoute>
                      } />
                      <Route path="/dashboard" element={
                        <PrivateRoute>
                          <Dashboard />
                        </PrivateRoute>
                      } />
                      <Route path="/my-orders" element={
                        <PrivateRoute>
                          <MyOrders />
                        </PrivateRoute>
                      } />
                      <Route path="/orders/:id" element={
                        <PrivateRoute>
                          <OrderDetail />
                        </PrivateRoute>
                      } />
                      <Route path="/profile" element={
                        <PrivateRoute>
                          <Profile />
                        </PrivateRoute>
                      } />
                      <Route path="/address-book" element={
                        <PrivateRoute>
                          <AddressBook />
                        </PrivateRoute>
                      } />
                      <Route path="/orders/:orderId/review" element={
                        <PrivateRoute>
                          <WriteReview />
                        </PrivateRoute>
                      } />

                      {/* ============= ADMIN ROUTES ============= */}
                      <Route path="/admin" element={
                        <AdminRoute>
                          <AdminDashboard />
                        </AdminRoute>
                      } />
                      <Route path="/admin/orders" element={
                        <AdminRoute>
                          <OrdersList />
                        </AdminRoute>
                      } />
                      <Route path="/admin/orders/:id" element={
                        <AdminRoute>
                          <OrderDetails />
                        </AdminRoute>
                      } />
                      <Route path="/admin/services" element={
                        <AdminRoute>
                          <ServicesManage />
                        </AdminRoute>
                      } />
                      <Route path="/admin/services/add" element={
                        <AdminRoute>
                          <AddService />
                        </AdminRoute>
                      } />
                      <Route path="/admin/services/edit/:id" element={
                        <AdminRoute>
                          <EditService />
                        </AdminRoute>
                      } />
                      <Route path="/admin/customers" element={
                        <AdminRoute>
                          <CustomersList />
                        </AdminRoute>
                      } />
                      <Route path="/admin/customers/:id" element={
                        <AdminRoute>
                          <CustomerDetail />
                        </AdminRoute>
                      } />
                      <Route path="/admin/coupons" element={
                        <AdminRoute>
                          <CouponsManage />
                        </AdminRoute>
                      } />
                      <Route path="/admin/coupons/add" element={
                        <AdminRoute>
                          <AddCoupon />
                        </AdminRoute>
                      } />
                      <Route path="/admin/delivery-staff" element={
                        <AdminRoute>
                          <DeliveryStaff />
                        </AdminRoute>
                      } />
                      <Route path="/admin/delivery-staff/add" element={
                        <AdminRoute>
                          <AddStaff />
                        </AdminRoute>
                      } />
                      <Route path="/admin/reviews" element={
                        <AdminRoute>
                          <ReviewsManage />
                        </AdminRoute>
                      } />
                      <Route path="/admin/reports" element={
                        <AdminRoute>
                          <Reports />
                        </AdminRoute>
                      } />
                      <Route path="/admin/settings" element={
                        <AdminRoute>
                          <Settings />
                        </AdminRoute>
                      } />
                      <Route path="/admin/profile" element={
                        <AdminRoute>
                          <AdminProfile />
                        </AdminRoute>
                      } />

                      {/* Policy Pages */}
                      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                      <Route path="/terms" element={<TermsConditions />} />
                      <Route path="/refund-policy" element={<RefundPolicy />} />
                      <Route path="/shipping-policy" element={<ShippingPolicy />} />
                      <Route path="/cancellation-policy" element={<CancellationPolicy />} />

                      {/* ============= 404 PAGE ============= */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>

                  {/* Footer */}
                  <Footer />

                  {/* Toast Notifications */}
                  <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                  />
                </div>
              </OrderProvider>
            </CartProvider>
          </ServiceProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;