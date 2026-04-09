import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import { NavigationProvider } from "@/contexts/NavigationContext";
import SkipLink from "@/components/accessibility/SkipLink";
import Navbar from "@/components/layout/Navbar";
import MobileNav from "@/components/layout/MobileNav";
import Sidebar from "@/components/layout/Sidebar";
import KioskLayout from "@/components/layout/KioskLayout";
import InstallPrompt from "@/components/pwa/InstallPrompt";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#1e3a5f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "BGGS Navigate | Junior Campus Smart Routing",
  description: "Inclusive smart campus navigation system for Brisbane Girls Grammar School, Spring Hill.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "BGGS Navigate",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased selection:bg-blue-500/30">
        <AccessibilityProvider>
          <ThemeProvider>
            <NavigationProvider>
              <SkipLink />
              <KioskLayout sidebar={<Sidebar />}>
                <div className="flex flex-col min-h-[100dvh] kiosk:min-h-0 lg:ml-72">
                  <div className="block lg:hidden">
                    <Navbar />
                  </div>
                  <main
                    id="main-content"
                    className="flex-1 pb-16 md:pb-0 relative w-full h-full"
                  >
                    {children}
                  </main>
                  <InstallPrompt />
                  <MobileNav />
                </div>
              </KioskLayout>
            </NavigationProvider>
          </ThemeProvider>
        </AccessibilityProvider>
        
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('ServiceWorker registration successful with scope: ', registration.scope);
                    },
                    function(err) {
                      console.log('ServiceWorker registration failed: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
