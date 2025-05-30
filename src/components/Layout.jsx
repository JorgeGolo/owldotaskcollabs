import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import ScrollToTop from "./ScrollToTop";
import { useRouter } from "next/router";
import { CookieConsentProvider } from "./CookieConsentProvider";
import { useEffect } from "react";

const Layout = ({ children }) => {
  const router = useRouter();

  return (
    <div id="maincontainer" className="flex flex-col min-h-screen">
      {/* Consentimiento de cookies (invisible, ejecuta lógica) */}
      <CookieConsentProvider />

      <Header />
      <div className="flex flex-col md:flex-row flex-1">
        <Sidebar />
        <main className="flex-1 flex flex-col items-center">
        <ScrollToTop />
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
