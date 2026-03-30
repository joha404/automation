import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setToken, setUser } from "@/redux/features/user/userSlice";
import successToast from "@/hooks/custom/successToast";

export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => {
    dispatch(setToken(null));
    dispatch(setUser(null));

    navigate("/");
    successToast("Logged out!")
  };

  return logout;
};