import { toast } from "react-hot-toast";
import { BsInfoCircle } from "react-icons/bs";

const errorToast = (message) => {
  toast.error(message, {
    icon: <BsInfoCircle className="lg:text-lg text-base min-w-[24px]" />,
    style: {
      fontSize:"14px",
      background: "#e11d48",
      color: "#fff",
      fontWeight: "500",
      maxWidth: "90vw",
      minWidth: "250px",
      width: "auto",
      whiteSpace: "normal",
      padding: "10px",
    },
  });
};

export default errorToast;
