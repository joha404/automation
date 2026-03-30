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
import SportsHub from "@/page/dashboard/sports/SportsHub";
import ScoreDetails from "@/page/dashboard/scoreDetails/ScoreDetails";
import Referrals from "@/page/dashboard/referral/Referrals";
import Setting from "@/page/dashboard/settings/Setting";
import HowtoVideos from "@/page/dashboard/videos/HowtoVideos";
import CommingSoon from "@/shared/errorPages/CommingSoon";
import Notifications from "@/shared/Notifications";
import Terms from "@/shared/Terms";
import Privacy from "@/shared/Privacy";
import PublicRoutes from "@/routes/PublicRoutes";
import Success from "@/shared/errorPages/Success";
import Cancel from "@/shared/errorPages/Cancel";
import Logo from "@/page/dashboard/logo/Logo";
import AutomationPolicy from "@/shared/AutomationPolicy";

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
        <PrivateRoute allowedRoles={["superAdmin"]}>
          <DashboardLayout />
        </PrivateRoute>
      </>
    ),
    children: [
      {
        index: true,
        element: (
          <>
            <PrivateRoute allowedRoles={["superAdmin"]}>
              <Dashboard />
            </PrivateRoute>
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
            <PrivateRoute allowedRoles={["superAdmin"]}>
              <Predictions />
            </PrivateRoute>
          </>
        ),
      },
      {
        path: "results",
        element: (
          <>
            <PrivateRoute allowedRoles={["superAdmin"]}>
              <Result />
            </PrivateRoute>
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
        path: "betting-calculator",
        element: (
          <>
            {/* <MetaPixelWrapper />
            <PrivateRoute allowedRoles={["superAdmin"]}>
              <BettingCalculator />
            </PrivateRoute> */}
            <CommingSoon />
          </>
        ),
      },
      {
        path: "chat-room",
        element: (
          <>
            <PrivateRoute allowedRoles={["superAdmin"]}>
              <SportsHub />
            </PrivateRoute>
          </>

          // <CommingSoon />
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
        path: "referral-program",
        element: (
          <PrivateRoute allowedRoles={["superAdmin"]}>
            <Referrals />
          </PrivateRoute>
          // <CommingSoon />
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
        path: "how-to-videos",
        element: (
          <>
            <PrivateRoute allowedRoles={["superAdmin"]}>
              <HowtoVideos />
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
    path: "/logo",
    element: <Logo />,
  },
]);

export default router;
