import logo from "../../assets/home/logo.png";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <div className="">
      <Link to="/">
        <div className="flex items-center sm:gap-2 gap-1 xl:h-10 sm:h-8 h-7">
          {/* Logo Image */}
          <div className="h-full">
            <img
              src={logo}
              alt="logo"
              className="h-full w-auto object-contain"
            />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Logo;
