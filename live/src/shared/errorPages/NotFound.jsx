import ErrorPage from "./component/ErrorPage";
import image from "@/assets/shared/404.png";

const NotFound = () => {
  return <ErrorPage image={image} redirectPath="/" />;
};

export default NotFound;
