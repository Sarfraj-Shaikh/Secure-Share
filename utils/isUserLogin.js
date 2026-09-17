import api from "./api";
import { message } from "antd";

export const checkIsAuth = async (navigate) => {

    try {

        await api.get("/api/isAuth");

    } catch (err) {

        const code = err.response?.data?.code;

        if (code === "USER_NOT_FOUND") {
            navigate("/login", { replace: true });
            return;
        }

        if (code === "NOT_VERIFIED") {
            navigate("/verify", { replace: true });
            return;
        }

        if (code === "ACCESS_BLOCKED") {

            const role = err.response?.data?.user?.role;

            if (role === "user") {
                navigate("/user/blocked", { replace: true });
            }

            if (role === "admin" || role === "superAdmin") {
                navigate("/admin/blocked", { replace: true });
            }

            return;
        }

        message.error(err.response?.data?.message || "Something Went Wrong");
        navigate("/login", { replace: true });

    }
};