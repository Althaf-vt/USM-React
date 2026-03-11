import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../app/axios";
import { logoutUser, logoutAdmin } from "../features/auth/authSlice";

const useAuthCheck = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {

    const validateSession = async () => {
      const userSession = JSON.parse(localStorage.getItem("userSession"));
      const adminSession = JSON.parse(localStorage.getItem("adminSession"));

      try {

        if (location.pathname.startsWith("/admin")) {
          if (adminSession) {
            await API.get("/admin/profile");
          }
        } else {
          if (userSession) {
            await API.get("/users/profile");
          }
        }

      } catch (error) {

        if (error.response?.status === 401) {

          if (location.pathname.startsWith("/admin")) {
            dispatch(logoutAdmin());
            navigate("/admin/login", { replace: true });
          } else {
            dispatch(logoutUser());
            navigate("/login", { replace: true });
          }

        }

      }
    };

    validateSession();

  }, [location.pathname, dispatch, navigate]); // runs when route changes
};

export default useAuthCheck;