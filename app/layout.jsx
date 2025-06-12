import ReduxProvider from "./ReduxProvider";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import Navbar from "./components/Navbar";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <CartProvider>
            <WishlistProvider>
              <Navbar />
              <main>{children}</main>
            </WishlistProvider>
          </CartProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}