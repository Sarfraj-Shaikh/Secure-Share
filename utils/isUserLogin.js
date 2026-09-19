import { message } from "antd";
import api from "./api";

export const verifyToken = async (navigate) => {

    const token = localStorage.getItem("userToken");

    const redirect = (path) => {
        navigate(path);
    };

    const deleteToken = () => {
        if (token) {
            localStorage.removeItem("userToken");
        }
    };

    if (!token) {

        if (window.location.pathname !== "/login") {
            navigate("/login");
        }

        return false;
    }

    try {

        const payLoad = {
            token,
        }

        const response = await api.post("/api/isAuth", payLoad);
        message.success(response.data.message);

    } catch (err) {

        const code = err?.response?.data?.code;
        const role = err?.response?.data?.user?.role;
        message.error(err?.response?.data?.message || "Something went wrong.");

        if (code === "UNAUTHORIZED" || code === "TOKEN_EXPIRED" || code === "INVALID_TOKEN") {
            deleteToken();
            if (window.location.pathname !== "/login") {
                redirect("/login");
            }
            return;
        };

        if (code === "USER_NOT_FOUND") {
            deleteToken();
            if (window.location.pathname !== "/register") {
                redirect("/register");
            }
            return;
        };

        if (code === "ACCESS_BLOCKED") {

            deleteToken();

            if (role === "user") {
                if (window.location.pathname !== "/user/blocked") {
                    redirect("/user/blocked");
                }
            }
            else if (role === "admin" || role === "superAdmin") {
                if (window.location.pathname !== "/admin/blocked") {
                    redirect("/admin/blocked");
                }
            }
            return;
        };

        if (code === "NOT_VERIFIED") {
            if (window.location.pathname !== "/verify" || window.location.pathname !== "/verify-account") {
                redirect("/verify");
            }
            return;
        };

        if (window.location.pathname !== "/login") {
            redirect("/login");
        };

        return false;
    }
};