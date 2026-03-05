import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import { PageTransition } from "./components/layout/PageTransition";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Catalog from "./pages/Catalog";
import MyProducts from "./pages/MyProducts";
import NotFound from "./pages/NotFound";
import BusinessRoute from "./components/auth/BusinessRoute";
import BusinessPublicProfile from "./pages/BusinessPublicProfile";
import Messages from "./pages/Messages";
import Chat from "./pages/Chat";
import ProductDetails from "./pages/ProductDetails";
import Orders from "./pages/Orders";
import BusinessOrders from "./pages/BusinessOrders";
import Checkout from "./pages/Checkout";
import Settings from "./pages/Settings";
import Subscription from "./pages/Subscription";

const queryClient = new QueryClient();

// Wrapper component for page transitions
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <PageTransition key={location.pathname}>
      <Routes location={location}>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/business/:businessId" element={<BusinessPublicProfile />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/chat/:conversationId" element={<Chat />} />
        <Route path="/product/:productId" element={<ProductDetails />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route
          path="/my-products" 
          element={
            <BusinessRoute>
              <MyProducts />
            </BusinessRoute>
          } 
        />
        <Route 
          path="/business-orders" 
          element={
            <BusinessRoute>
              <BusinessOrders />
            </BusinessRoute>
          } 
        />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </PageTransition>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;