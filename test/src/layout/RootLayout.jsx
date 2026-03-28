import { Outlet, ScrollRestoration } from "react-router-dom";
import Header from "@/shared/Header";
import Footer from "@/shared/Footer";

const RootLayout = () => {
  return (
    <div className="w-full">
      <Header />
      <Outlet />
      <Footer />
      <ScrollRestoration />
    </div>
  );
};

export default RootLayout;
