import "@/app/globals.css";
import { ReactNode } from "react";

// Layout
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";

import Chatbot from "@/components/ui/ChatBot/Chatbot";
import { WishlistProvider } from "@/context/WishlistContext";

export const metadata = {
  title: "Horizonte Azul",
  description: "Aerolínea digital para la gestión de viajes",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem={true}
          >
            <Toaster position="top-right" richColors />
            <Header />
            <main className="flex-1">
              <WishlistProvider>{children}</WishlistProvider>
            </main>
            <Chatbot />
            <Footer />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
