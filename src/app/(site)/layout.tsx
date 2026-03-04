import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/components/cart/CartProvider";
import CartButton from "@/components/cart/CartButton";
import CartDrawer from "@/components/cart/CartDrawer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Header />
      {children}
      <Footer />

      {/* UI global del carrito */}
      <CartButton />
      <CartDrawer />
    </CartProvider>
  );
}