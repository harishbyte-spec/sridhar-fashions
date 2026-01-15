// App.jsx
import React, { Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// Lazy loading components
const Home = lazy(() => import("./pages/Home"));
const Shop = lazy(() => import("./pages/Shop"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Navbar = lazy(() => import("./components/HomePage/Navbar"));
const Footer = lazy(() => import("./components/HomePage/Footer"));
const ProductDetails = lazy(() => import("./components/productCard/ProductDetails"));
const Favourites = lazy(() => import("./pages/Favourites"));
const ScrollToTop = lazy(() => import("./components/ScrollToTop"));

// admin
const AdminDashboard = lazy(() => import("./admin/AdminDashboard"));
const AdminUsers = lazy(() => import("./admin/AdminUsers"));
const AdminOrders = lazy(() => import("./admin/AdminOrders"));
const AddProduct = lazy(() => import("./admin/AddProduct"));
const AdminRoute = lazy(() => import("./routes/AdminRoute"));
const AdminProductList = lazy(() => import("./admin/AdminProductList"));
const EditProduct = lazy(() => import("./admin/EditProduct"));
const AdminProducts = lazy(() => import("./admin/AdminProducts"));
const Templates = lazy(() => import("./admin/Templates"));
const Categories = lazy(() => import("./admin/Categories"));
const Collections = lazy(() => import("./admin/Collections"));
const Fabrics = lazy(() => import("./admin/Fabrics"));
const BodyTemplates = lazy(() => import("./admin/BodyTemplates"));
const BorderTemplates = lazy(() => import("./admin/BorderTemplates"));
const PalluTemplates = lazy(() => import("./admin/PalluTemplates"));
const BlouseTemplates = lazy(() => import("./admin/BlouseTemplates"));
const Origins = lazy(() => import("./admin/Origins"));
const JariTypes = lazy(() => import("./admin/JariTypes"));
const ManageOccasions = lazy(() => import("./admin/ManageOccasions"));
const ManageHome = lazy(() => import("./admin/ManageHome"));

// NEW shared login
const Login = lazy(() => import("./userLogin/Login"));
const Register = lazy(() => import("./userLogin/Register"));
const Profile = lazy(() => import("./pages/Profile"));
const Story = lazy(() => import("./pages/Story"));
const Privacy = lazy(() => import("./pages/Privacy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
import { CurrencyProvider } from "./context/CurrencyContext";
import { Toaster } from "react-hot-toast";
const Intro = lazy(() => import("./components/IntroAnimation/Intro"));


export default function App() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <CurrencyProvider>
      <Navbar />
      <ScrollToTop />
      <Toaster position="top-right" reverseOrder={false} />

      <div className={isHome ? "app-main-content home-no-pad" : "app-main-content"}>
        <Suspense fallback={<div style={{height: "100vh", display: "flex", justifyContent: "center", alignItems: "center"}}>Loading...</div>}>
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
        </Suspense>
      </div>



      <Footer />
    </CurrencyProvider>
  );
}
