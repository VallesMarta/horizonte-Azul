import "@/app/globals.css";
import { ReactNode } from "react";

// Layout
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Horizonte Azul",
  description: "Aerolínea digital para la gestión de viajes",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
     <body className="flex flex-col min-h-screen bg-white text-gray-800">
        <Header urlAPI=""/>
        <main className="flex-1">          
          {children}
        </main>
        <Footer urlAPI=""/>
      </body>
    </html>
  );
}
