import api from "./api";
import { message } from "antd";

export const checkIsAuth = async (navigate) => {
    try {
        const response = await api.get("/api/isAuth");

        // User is authenticated
        const user = response.data?.user;

        if (user?.role === "user") {
            return {
                isAuthenticated: true,
                role: "user",
                user,
            };
        }

        if (user?.role === "admin") {
            return {
                isAuthenticated: true,
                role: "admin",
                user,
            };
        }

        if (user?.role === "superAdmin") {
            return {
                isAuthenticated: true,
                role: "superAdmin",
                user,
            };
        }

        return {
            isAuthenticated: true,
            role: user?.role,
            user,
        };

    } catch (err) {
        const code = err.response?.data?.code;

        if (code === "USER_NOT_FOUND") {
            return {
                isAuthenticated: false,
                role: null,
            };
        }

        if (code === "NOT_VERIFIED") {
            navigate("/verify", { replace: true });

            return {
                isAuthenticated: false,
                role: null,
            };
        }

        if (code === "ACCESS_BLOCKED") {
            const role = err.response?.data?.user?.role;

            if (role === "user") {
                navigate("/user/blocked", { replace: true });
            }

            if (role === "admin" || role === "superAdmin") {
                navigate("/admin/blocked", { replace: true });
            }

            return {
                isAuthenticated: false,
                role,
            };
        }

        // message.error( err.response?.data?.message || "Something Went Wrong" );

        return {
            isAuthenticated: false,
            role: null,
        };
    }
};