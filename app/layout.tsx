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
import CookieBanner from "@/components/ui/CookieBanner";

export const metadata = {
  title: "Horizonte Azul",
  description: "Aerolínea digital para la gestión de viajes",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className="flex flex-col min-h-screen"
        style={
          process.env.NEXT_PUBLIC_APP_ENV === "develop"
            ? ({
                "--color-primario": "#10b981", // Verde Esmeralda (Principal)
                "--color-secundario": "#065f46", // Verde Bosque (Oscuro para contraste)
              } as React.CSSProperties)
            : {}
        }
      >
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
            <CookieBanner />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
