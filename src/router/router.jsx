import { createBrowserRouter, Navigate } from "react-router-dom";
import SignIn from "@/page/auth/SignIn";
import SignUp from "@/page/auth/SignUp";
import Otp from "@/page/auth/Otp";
import ForgotPassword from "@/components/auth/ForgotPassword";
import ForgotPasswordOtp from "@/components/auth/ForgotPasswordOtp";
import ResetPassword from "@/page/auth/ResetPassword";
import Home from "@/page/home/Home";
import PrivateRoute from "@/routes/PrivateRoutes";
import Dashboard from "@/page/dashboard/dashboardHome/Dashboard";
import DashboardLayout from "@/layout/DashboardLayout";
import NotFound from "@/shared/errorPages/NotFound";
import Maintenance from "@/shared/errorPages/Maintenance";
import ServerError from "@/shared/errorPages/ServerError";
import Subscription from "@/page/dashboard/subscription/Subscription";
import Automation from "@/page/dashboard/automation/Automation";
import Predictions from "@/page/dashboard/predictions/Predictions";
import Result from "@/page/dashboard/result/Result";
import PastPredictions from "@/page/dashboard/pastPrediction/PastPredictions";
import ScoreDetails from "@/page/dashboard/scoreDetails/ScoreDetails";
import Setting from "@/page/dashboard/settings/Setting";
import Notifications from "@/shared/Notifications";
import Terms from "@/shared/Terms";
import Privacy from "@/shared/Privacy";
import PublicRoutes from "@/routes/PublicRoutes";
import Success from "@/shared/errorPages/Success";
import Cancel from "@/shared/errorPages/Cancel";
import Logo from "@/page/dashboard/logo/Logo";
import Offer from "@/page/dashboard/offer/Offer";
import Festival from "@/page/home/Festival";
import AutomationPolicy from "@/shared/AutomationPolicy";
import MarchMadnessBracket from "@/page/home/components/MarchMadnessBracket";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <PublicRoutes>
          <Home />
        </PublicRoutes>
      </>
    ),
  },

  {
    path: "/dashboard",
    element: (
      <>
        <DashboardLayout />
        {/* <PrivateRoute allowedRoles={["superAdmin"]}>
        </PrivateRoute> */}
      </>
    ),
    children: [
      {
        index: true,
        element: (
          <>
            <Dashboard />
            {/* <PrivateRoute allowedRoles={["superAdmin"]}>
            </PrivateRoute> */}
          </>
        ),
      },
      {
        path: "automation",
        element: (
          <PrivateRoute allowedRoles={["superAdmin"]}>
            <Automation />
          </PrivateRoute>
          // <CommingSoon />
        ),
      },
      {
        path: "predictions",
        element: (
          <>
            <Predictions />
            {/* <PrivateRoute allowedRoles={["superAdmin"]}>
            </PrivateRoute> */}
          </>
        ),
      },
      {
        path: "results",
        element: (
          <>
            <Result />
            {/* <PrivateRoute allowedRoles={["superAdmin"]}>
            </PrivateRoute> */}
          </>
        ),
      },
      {
        path: "past-predictions",
        element: (
          <>
            <PrivateRoute allowedRoles={["superAdmin"]}>
              <PastPredictions />
            </PrivateRoute>
          </>
        ),
      },

      {
        path: "sports-hub/scoring-summary/:game_type/:id",
        element: (
          <>
            <PrivateRoute allowedRoles={["superAdmin"]}>
              <ScoreDetails />
            </PrivateRoute>
          </>
          //  <CommingSoon/>
        ),
      },
      {
        path: "subscription-tiers",
        element: (
          <PrivateRoute allowedRoles={["superAdmin"]}>
            {/* <MetaPixelWrapper /> */}
            <Subscription />
          </PrivateRoute>
        ),
      },

      {
        path: "settings",
        element: (
          <>
            <PrivateRoute allowedRoles={["superAdmin"]}>
              <Setting />
            </PrivateRoute>
          </>
        ),
      },

      {
        path: "notifications",
        element: (
          <>
            {/* <MetaPixelWrapper /> */}
            <PrivateRoute allowedRoles={["superAdmin"]}>
              <Notifications />
            </PrivateRoute>
          </>
        ),
      },
    ],
  },
  {
    path: "/sign-in",
    element: (
      <>
        <PublicRoutes>
          <SignIn />
        </PublicRoutes>
      </>
    ),
  },
  {
    path: "/success",
    element: (
      <>
        {/* <MetaPixelWrapper /> */}

        <Success />
      </>
    ),
  },

  {
    path: "/sign-up",
    element: (
      <>
        {/* <MetaPixelWrapper /> */}
        <PublicRoutes>
          <SignUp />
        </PublicRoutes>
      </>
    ),
  },
  {
    path: "/email-verification",
    element: (
      <>
        <PublicRoutes>
          <Otp />
        </PublicRoutes>
      </>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <>
        <PublicRoutes>
          <ForgotPassword />
        </PublicRoutes>
      </>
    ),
  },
  {
    path: "/forgot-passowrd/verification",
    element: (
      <>
        <PublicRoutes>
          <ForgotPasswordOtp />
        </PublicRoutes>
      </>
    ),
  },
  {
    path: "/reset-password",
    element: (
      <>
        <PublicRoutes>
          <ResetPassword />
        </PublicRoutes>
      </>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/package/success",
    element: (
      <>
        {/* <MetaPixelWrapper /> */}
        <Success />
      </>
    ),
  },
  {
    path: "/package/cancel",
    element: <Cancel />,
  },
  {
    path: "/maintenance-error",
    element: <Maintenance />,
  },
  {
    path: "/server-error",
    element: <ServerError />,
  },
  {
    path: "/terms-and-conditions",
    element: <Terms />,
  },
  {
    path: "/automation-policy",
    element: <AutomationPolicy />,
  },
  {
    path: "/privacy-policy",
    element: <Privacy />,
  },
  {
    path: "/march",
    element: <MarchMadnessBracket />,
  },
  {
    path: "/logo",
    element: <Logo />,
  },
]);

export default router;
