import { Routes, Route } from "react-router-dom"
import { Navbar } from "./components/NavBar";
import HomePage from "./pages/HomePage";
import ArtisanDashboard from "./pages/ArisanDashboard";
import SellProduct from "./pages/SellProduct";
import ShopPage from "./pages/ShopPage";
import ShoppingCartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import CheckoutSuccess from "./pages/CheckoutSuccesspage";
import UserProfilePage from "./pages/UserProfile";
import AboutPage from "./pages/About";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Footer from "./components/Footer";
import Protected from "./components/Protected";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './App.css'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function App() {
  const client = new QueryClient()
  return (
    <QueryClientProvider client={client}>
      <Navbar/>
      <main>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/dashboard" element={<Protected><ArtisanDashboard/></Protected>} />
          <Route path="/sell" element={<Protected><SellProduct/></Protected>} />
          <Route path="/shop" element={<Protected><ShopPage/></Protected>}/>
          <Route path="/cart" element={<Protected><ShoppingCartPage/></Protected>}/>
          <Route path="/checkout" element={<Protected><CheckoutPage/></Protected>} />
          <Route path="/checkout/success" element={<Protected><CheckoutSuccess/></Protected>} />
          <Route path="/profile" element={<Protected><UserProfilePage/></Protected>} />
          <Route path="/about" element={<AboutPage/>}/>
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/register" element={<RegisterPage/>} />
        </Routes>
      </main>
      <Footer/>
      <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            toastClassName="custom-toast"
          />
    </QueryClientProvider>
  )
}

export default App
