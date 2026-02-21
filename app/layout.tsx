import "@/app/globals.css";
import { ReactNode } from "react";

// Layout
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata = {
  title: "Horizonte Azul",
  description: "Aerolínea digital para la gestión de viajes",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        {/* El ThemeProvider envuelve Header, Main y Footer */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true}>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
