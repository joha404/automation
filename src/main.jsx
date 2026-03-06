import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import router from "./router/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { Toaster } from "react-hot-toast";
import ThemeProvider from "./providers/ThemeProvider";
import SidebarProvider from "./providers/SidebarProvider";
import { autoLogoutIfExpired } from "./utils/cookieHelper";
import { getUTMParams } from "./utils/getUTM";

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    const utm = getUTMParams();
    if (utm.utm_source) {
      localStorage.setItem("utm", JSON.stringify(utm));
    }
    autoLogoutIfExpired();

    // Check every 1 minute
    const interval = setInterval(() => {
      autoLogoutIfExpired();
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ThemeProvider>
      <SidebarProvider>
        <Provider store={store}>
          <RouterProvider router={router} />
          <Toaster
            containerStyle={{ zIndex: 9999 }}
            toastOptions={{
              className: "toast-base",
              success: {
                className: "toast-success",
              },
              error: {
                className: "toast-error",
              },
            }}
          />
          {/* <Toaster containerStyle={{ zIndex: 9999 }} /> */}
        </Provider>
      </SidebarProvider>
    </ThemeProvider>
  );
}

// ✅ Render the App component
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
