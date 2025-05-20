// AuthRestore.js
import { useEffect, useContext } from "react";
import { UserContext } from "./UserContext";
import axios from "./axiosConfig";

export function AuthRestore() {
  const { setUserInfo } = useContext(UserContext);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (token) {
          const response = await axios.get("/user/getUserInfo", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUserInfo(response.data.userInfo);
        }
      } catch (error) {
        localStorage.removeItem("accessToken");
        setUserInfo(null);
      }
    };
    checkAuth();
  }, [setUserInfo]);

  return null;
}