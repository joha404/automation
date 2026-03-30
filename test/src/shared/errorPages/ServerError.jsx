import image from "@/assets/shared/500.png";
import ErrorPage from "./component/ErrorPage";

const ServerError = () => {
  return (
    <ErrorPage
      image={image}
      title="500 Internal Server Error"
      subtitle="There was an error, please try again later."
      redirectPath="/"
    />
  )
}

export default ServerError