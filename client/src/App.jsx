// App.jsx
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Navbar from "./components/HomePage/Navbar";
import Footer from "./components/HomePage/Footer";
import ProductDetails from "./components/productCard/ProductDetails";
import Favourites from "./pages/Favourites";
import ScrollToTop from "./components/ScrollToTop";

// admin
import AdminDashboard from "./admin/AdminDashboard";
import AdminUsers from "./admin/AdminUsers";
import AdminOrders from "./admin/AdminOrders";
import AddProduct from "./admin/AddProduct";
import AdminRoute from "./routes/AdminRoute";
import AdminProductList from "./admin/AdminProductList";
import EditProduct from "./admin/EditProduct";
import AdminProducts from "./admin/AdminProducts";
import Templates from "./admin/Templates";
import Categories from "./admin/Categories";
import Collections from "./admin/Collections";
import Fabrics from "./admin/Fabrics";
import BodyTemplates from "./admin/BodyTemplates";
import BorderTemplates from "./admin/BorderTemplates";
import PalluTemplates from "./admin/PalluTemplates";
import BlouseTemplates from "./admin/BlouseTemplates";
import Origins from "./admin/Origins";
import JariTypes from "./admin/JariTypes";
import ManageOccasions from "./admin/ManageOccasions";
import ManageHome from "./admin/ManageHome";



// NEW shared login
import Login from "./userLogin/Login";
import Register from "./userLogin/Register";
import Profile from "./pages/Profile";
import Story from "./pages/Story";
import Privacy from "./pages/Privacy";
import TermsOfService from "./pages/TermsOfService";
import { CurrencyProvider } from "./context/CurrencyContext";
import { Toaster } from "react-hot-toast";
import Intro from "./components/IntroAnimation/Intro";


export default function App() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <CurrencyProvider>
      <Navbar />
      <ScrollToTop />
      <Toaster position="top-right" reverseOrder={false} />

      <div className={isHome ? "app-main-content home-no-pad" : "app-main-content"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<About />} />
          <Route path="/story" element={<Story />} />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/product/:id" element={<ProductDetails />} />

          {/* Shared login for users + admin */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />


          {/* Protected admin routes */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/add-product"
            element={
              <AdminRoute>
                <AddProduct />
              </AdminRoute>
            }
          />


          <Route
            path="/admin/edit-product/:id"
            element={
              <AdminRoute>
                <EditProduct />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/products"
            element={
              <AdminRoute>
                <AdminProducts />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/templates"
            element={
              <AdminRoute>
                <Templates />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/order-insights"
            element={
              <AdminRoute>
                <AdminOrders />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/categories"
            element={
              <AdminRoute>
                <Categories />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/collections"
            element={
              <AdminRoute>
                <Collections />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/fabrics"
            element={
              <AdminRoute>
                <Fabrics />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/templates/body"
            element={
              <AdminRoute>
                <BodyTemplates />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/templates/border"
            element={
              <AdminRoute>
                <BorderTemplates />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/templates/pallu"
            element={
              <AdminRoute>
                <PalluTemplates />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/templates/blouse"
            element={
              <AdminRoute>
                <BlouseTemplates />
              </AdminRoute>
            }
          />


          <Route
            path="/admin/origins"
            element={
              <AdminRoute>
                <Origins />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/jari-types"
            element={
              <AdminRoute>
                <JariTypes />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/occasions"
            element={
              <AdminRoute>
                <ManageOccasions />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/manage-home"
            element={
              <AdminRoute>
                <ManageHome />
              </AdminRoute>
            }
          />
          {/* Temporary Intro Preview Route */}
          <Route path="/intro-test" element={<Intro onComplete={() => window.location.reload()} />} />
        </Routes>
      </div>



      <Footer />
    </CurrencyProvider>
  );
}
