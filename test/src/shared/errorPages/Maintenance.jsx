import image from "@/assets/shared/maintenance.png";
import ErrorPage from "./component/ErrorPage";

const Maintenance = () => {
  return (
    <ErrorPage
      image={image}
      title="Website currently under maintenance"
      subtitle="We are currently working hard on this page!"
      redirectPath="/"
    />
  );
};

export default Maintenance;
