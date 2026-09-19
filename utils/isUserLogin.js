import { message } from "antd";
import api from "./api";

const PUBLIC_AUTH_ROUTES = [
    "/login",
    "/register",
    "/forgot-password",
];

const VERIFICATION_ROUTES = [
    "/verify",
    "/verify-account",
];

const getDashboardByRole = (role) => {
    if (role === "user") {
        return "/user/dashboard";
    }

    if (role === "admin" || role === "superAdmin") {
        return "/admin/dashboard";
    }

    return "/login";
};

export const verifyToken = async (navigate, options = {}) => {
    const {
        requireAuth = false,
        allowedRoles = [],
    } = options;

    const token = localStorage.getItem("userToken");
    const path = window.location.pathname;

    const redirect = (route) => {
        navigate(route, { replace: true });
    };

    const deleteToken = () => {
        localStorage.removeItem("userToken");
    };

    /*
    |--------------------------------------------------------------------------
    | NO TOKEN
    |--------------------------------------------------------------------------
    */

    if (!token) {

        // Public route -> allow
        if (!requireAuth) {
            return {
                success: true,
                authenticated: false,
            };
        }

        // Protected route -> login
        redirect("/login");

        return {
            success: false,
            authenticated: false,
        };
    }

    /*
    |--------------------------------------------------------------------------
    | VALIDATE TOKEN
    |--------------------------------------------------------------------------
    */

    try {

        const response = await api.post("/api/isAuth", {
            token,
        });

        const data = response?.data;

        if (data?.code !== "AUTHENTICATED") {
            return false;
        }

        const user = data.user;
        const role = user?.role;
        const verified = user?.verified;

        /*
        |--------------------------------------------------------------------------
        | LOGGED-IN USER
        |--------------------------------------------------------------------------
        */

        // ---------------------------------------------------------
        // 1. User is NOT verified
        // ---------------------------------------------------------

        if (!verified) {

            // Verification pages are allowed
            if (VERIFICATION_ROUTES.includes(path)) {
                return {
                    success: true,
                    authenticated: true,
                    verified: false,
                    user,
                };
            }

            // Everything else -> /verify
            redirect("/verify");

            return {
                success: false,
                authenticated: true,
                verified: false,
                user,
            };
        }

        // ---------------------------------------------------------
        // 2. User IS verified
        // ---------------------------------------------------------

        // Logged-in verified user cannot access auth/verification pages
        const guestOnlyRoutes = [
            ...PUBLIC_AUTH_ROUTES,
            ...VERIFICATION_ROUTES,
        ];

        if (guestOnlyRoutes.includes(path)) {

            redirect(getDashboardByRole(role));

            return {
                success: false,
                authenticated: true,
                verified: true,
                user,
            };
        }

        // ---------------------------------------------------------
        // 3. Role protection
        // ---------------------------------------------------------

        if (
            allowedRoles.length > 0 &&
            !allowedRoles.includes(role)
        ) {

            // User doesn't have permission
            if (role === "user") {
                redirect("/user/dashboard");
            }
            else if (
                role === "admin" ||
                role === "superAdmin"
            ) {
                redirect("/admin/dashboard");
            }
            else {
                redirect("/login");
            }

            return {
                success: false,
                authenticated: true,
                verified: true,
                authorized: false,
                user,
            };
        }

        /*
        |--------------------------------------------------------------------------
        | EVERYTHING IS OK
        |--------------------------------------------------------------------------
        */

        return {
            success: true,
            authenticated: true,
            verified: true,
            authorized: true,
            user,
        };

    } catch (err) {

        console.log(err);

        const code = err?.response?.data?.code;
        const role = err?.response?.data?.user?.role;

        /*
        |--------------------------------------------------------------------------
        | TOKEN INVALID / EXPIRED
        |--------------------------------------------------------------------------
        */

        if (
            code === "UNAUTHORIZED" ||
            code === "TOKEN_EXPIRED" ||
            code === "INVALID_TOKEN"
        ) {

            deleteToken();

            if (requireAuth) {
                redirect("/login");
            }

            return {
                success: false,
                authenticated: false,
            };
        }

        /*
        |--------------------------------------------------------------------------
        | USER NOT FOUND
        |--------------------------------------------------------------------------
        */

        if (code === "USER_NOT_FOUND") {

            deleteToken();

            redirect("/register");

            return false;
        }

        /*
        |--------------------------------------------------------------------------
        | ACCOUNT BLOCKED
        |--------------------------------------------------------------------------
        */

        if (code === "ACCESS_BLOCKED") {

            deleteToken();

            if (role === "user") {
                redirect("/user/blocked");
            }
            else if (
                role === "admin" ||
                role === "superAdmin"
            ) {
                redirect("/admin/blocked");
            }
            else {
                redirect("/login");
            }

            return false;
        }

        /*
        |--------------------------------------------------------------------------
        | NOT VERIFIED
        |--------------------------------------------------------------------------
        */

        if (code === "NOT_VERIFIED") {

            if (!VERIFICATION_ROUTES.includes(path)) {
                redirect("/verify");
            }

            return {
                success: false,
                authenticated: true,
                verified: false,
            };
        }

        /*
        |--------------------------------------------------------------------------
        | SERVER ERROR
        |--------------------------------------------------------------------------
        */

        message.error(
            err?.response?.data?.message ||
            "Something went wrong."
        );

        if (requireAuth) {
            redirect("/login");
        }

        return false;
    }
};