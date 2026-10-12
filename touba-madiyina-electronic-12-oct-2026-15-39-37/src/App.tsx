import React, { useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { CategoriesGrid } from './components/CategoriesGrid';
import { FeaturedProducts } from './components/FeaturedProducts';
import { FlashSaleBanner } from './components/FlashSaleBanner';
import { TrustGuarantees } from './components/TrustGuarantees';
import { OfficialBrandsShowcase } from './components/BrandLogos';
import { ProductDetailPage } from './components/ProductDetailPage';
import { ShopCatalogPage } from './components/ShopCatalogPage';
import { CheckoutPage } from './components/CheckoutPage';
import { OrderConfirmation } from './components/OrderConfirmation';
import { OrderTracking } from './components/OrderTracking';
import { AdminPanel } from './components/AdminPanel';
import { PageDetail } from './components/PageDetail';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { ToastContainer } from './components/ToastContainer';
import { AdminAuthModal } from './components/AdminAuthModal';
import { StoreLocationModal } from './components/StoreLocationModal';

const MainContent: React.FC = () => {
  const { activeView, isAuthModalOpen, setIsAuthModalOpen, isLocationModalOpen, setIsLocationModalOpen } = useStore();

  // Scroll to top on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeView]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. TOP NAVBAR */}
      <Navbar />

      {/* 2. MAIN ACTIVE VIEW ROUTER */}
      <main className="flex-1">
        {activeView === 'home' && (
          <>
            <HeroBanner />
            <CategoriesGrid />
            <FeaturedProducts />
            <OfficialBrandsShowcase />
            <FlashSaleBanner />
            <TrustGuarantees />
          </>
        )}

        {activeView === 'shop' && <ShopCatalogPage />}

        {activeView === 'product-detail' && <ProductDetailPage />}

        {activeView === 'checkout' && <CheckoutPage />}

        {activeView === 'order-confirmation' && <OrderConfirmation />}

        {activeView === 'order-tracking' && <OrderTracking />}

        {activeView === 'page-detail' && <PageDetail />}

        {activeView === 'admin' && <AdminPanel />}
      </main>

      {/* 3. SLIDE-OVER CART DRAWER */}
      <CartDrawer />

      {/* 4. FOOTER */}
      <Footer />

      {/* 5. FLOATING WHATSAPP BUTTON */}
      <FloatingWhatsApp />

      {/* 6. TOAST FEEDBACK NOTIFICATIONS */}
      <ToastContainer />

      {/* 7. ADMIN AUTHENTICATION MODAL */}
      <AdminAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* 8. GOOGLE MAPS STORE LOCATION MODAL */}
      <StoreLocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
}
