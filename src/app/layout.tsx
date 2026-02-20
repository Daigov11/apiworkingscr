import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, background: "#050505", color: "#ffffff", fontFamily: "system-ui, Arial" }}>
        <Header />
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "16px" }}>
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}