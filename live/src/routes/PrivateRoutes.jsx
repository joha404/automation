import ScreenLoader from "@/components/loaders/ScreenLoader";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const access_token = useSelector((state) => state.user.access_token);
  const user = useSelector((state) => state.user.user);
  const location = useLocation();

  useEffect(() => {
    const checkAuthStatus = () => {
      if (access_token && user) {
        setIsLoading(false);
      } else {
        // delay before redirect
        setIsLoading(true);
        const timer = setTimeout(() => {
          setIsLoading(false);
          setShouldRedirect(true);
        }, 1500);
        return () => clearTimeout(timer);
      }
    };

    checkAuthStatus();
  }, [access_token, user]);

    if (isLoading) {
    return (
      <div className="flex w-full max-w-6xl mx-auto justify-center">
        <ScreenLoader />
      </div>
    );
  }

  if (shouldRedirect) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (!access_token) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (access_token && user?.role) {
    // If allowedRoles is empty, allow all authenticated users
    // Otherwise, check if user's role is included in allowedRoles
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      return <Navigate to="/" replace state={{ from: location }} />;
    }
  }

  return children;
};

export default PrivateRoute;
