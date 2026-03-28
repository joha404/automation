import logo from "@/assets/logo/logo.png";

const Logo = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      {/* Logo Image */}
      <div className="h-auto">
        <a href={logo} target="_blank" rel="noopener noreferrer">
          <img
            src={logo}
            alt="Logo"
            className="h-full w-auto object-contain cursor-pointer"
          />
        </a>
      </div>
    </div>
  );
};

export default Logo;
