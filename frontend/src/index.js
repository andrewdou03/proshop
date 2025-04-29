import React from 'react';
import ReactDOM from 'react-dom/client';
// import 'bootstrap/dist/css/bootstrap.min.css';
import { 
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
 } from 'react-router-dom';
import {Provider} from 'react-redux';
import store from './store';
import './assets/styles/bootstrap.custom.css'; // Ensure this path is correct
import './assets/styles/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Home from './pages/Home';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ShippingPage from './pages/ShippingPage';
import PrivateRoute from './components/PrivateRoute';
import PaymentPage from './pages/PaymentPage';
import PlaceOrderPage from './pages/PlaceOrderPage';
import OrderPage from './pages/OrderPage';
import ProfilePage from './pages/ProfilePage';
import AdminRoute from './components/AdminRoute';
import OrderListPage from './pages/admin/OrderListPage';
import ProductListPage from './pages/admin/ProductListPage';
import UserListPage from './pages/admin/UserListPage';
import ProductEditPage from './pages/admin/ProductEditPage';
import UserEditPage from './pages/admin/UserEditPage';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index="true" path="/" element={<Home />} />
      <Route index="true" path="/search/:keyword" element={<Home />} />
      <Route index="true" path="/page/:pageNumber" element={<Home />} />
      <Route path="/search/:keyword/page/:pageNumber" element={<Home />} />
      <Route path="product/:id" element={<ProductPage />} />
      <Route path="cart" element={<CartPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage/>} />
      <Route path='' element={<PrivateRoute />}>
        <Route path="shipping" element={<ShippingPage />} />
        <Route path="payment" element={<PaymentPage />} />
        <Route path="placeorder" element={<PlaceOrderPage />} />
        <Route path="order/:id" element={<OrderPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
      <Route path='' element={<AdminRoute />}>
        <Route path="admin/orderlist" element={<OrderListPage />} />
        <Route path="admin/productlist" element={<ProductListPage />} />
        <Route path="admin/productlist/:pageNumber" element={<ProductListPage />} />
        <Route path="admin/userlist" element={<UserListPage />} />
        <Route path="admin/product/:id/edit" element={<ProductEditPage />} />
        <Route path="admin/user/:id/edit" element={<UserEditPage />} />
      </Route>
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <Provider store={store}>
        <PayPalScriptProvider deferLoading={true}>
          <RouterProvider router={router} />
        </PayPalScriptProvider>
      </Provider>
  </React.StrictMode>
);


reportWebVitals();
