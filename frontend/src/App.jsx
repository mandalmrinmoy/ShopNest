import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion } from "motion/react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Disclaimer from "./pages/Disclaimer";
import ReturnPolicy from "./pages/ReturnPolicy";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetail from "./pages/ProductDetail";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import OrderSuccess from "./pages/OrderSuccess";
import AdminDashboard from "./admin/AdminDashboard";
import AddProduct from "./admin/AddProduct";
import EditProduct from "./admin/EditProduct";
import AdminOrders from "./admin/AdminOrders";
import AdminUsers from "./admin/AdminUsers";
import AdminProducts from "./admin/AdminProducts";
import ContactUs from "./pages/ContactUs";

function App() {
  return (
    <BrowserRouter>
      <div className="relative min-h-screen bg-zinc-950 overflow-hidden">

        {/* Dotted Grid */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(rgba(249,115,22,0.25) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Animated Glow Left */}
        <motion.div
          className="absolute top-40 left-0 h-96 w-96 bg-orange-500/10 blur-[120px] rounded-full"
          animate={{
            x: [0, 80, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Animated Glow Right */}
        <motion.div
          className="absolute bottom-20 right-0 h-96 w-96 bg-orange-500/10 blur-[120px] rounded-full"
          animate={{
            x: [0, -80, 0],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar className="mb-15"/>

           <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail/>} />
          <Route path="/cart" element={<Cart/>} />
          <Route path="/checkout" element={<Checkout/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/ordersuccess" element={<OrderSuccess/>} />
          <Route path="/aboutus" element={<About />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/return" element={<ReturnPolicy />} />
          <Route path="/admin" element={<AdminDashboard/>} />
          <Route path="/admin/add-product" element={<AddProduct/>} />
          <Route path="/admin/products" element={<AdminProducts/>} />
          <Route path="/admin/edit-product/:id" element={<EditProduct/>} />
          <Route path="/admin/orders" element={<AdminOrders/>} />
          <Route path="/admin/users" element={<AdminUsers/>} />
          <Route path="/contact" element={<ContactUs/>} />
        </Routes>

          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;