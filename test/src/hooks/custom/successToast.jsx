import { toast } from "react-hot-toast";
import { GiCheckMark } from "react-icons/gi";

const successToast = (message) => {
  toast.success(message, {
    icon: <GiCheckMark className="lg:text-lg text-base min-w-[24px]" />,
    style: {
      fontSize:"14px",
      background: "#2094F3",
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

export default successToast;
