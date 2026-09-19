import { message } from "antd";
import api from "./api";

const AUTH_ROUTES = [
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
        requireVerified = false,
        allowedRoles = [],
    } = options;

    const token = localStorage.getItem("userToken");
    const path = window.location.pathname;

    const redirect = (route) => {
        if (path !== route) {
            navigate(route, {
                replace: true,
            });
        }
    };

    const deleteToken = () => {
        localStorage.removeItem("userToken");
    };


    // ============================================================
    // NO TOKEN
    // ============================================================

    if (!token) {

        // Public route
        if (!requireAuth) {
            return {
                success: true,
                authenticated: false,
                verified: false,
                authorized: true,
                user: null,
            };
        }

        // Protected route
        redirect("/login");

        return {
            success: false,
            authenticated: false,
            verified: false,
            authorized: false,
            user: null,
        };
    }


    // ============================================================
    // VERIFY TOKEN
    // ============================================================

    try {

        const response = await api.post("/api/isAuth", {
            token,
        });

        const data = response?.data;

        if (data?.code !== "AUTHENTICATED") {
            return {
                success: false,
                authenticated: false,
                verified: false,
                authorized: false,
            };
        }


        const user = data.user;

        const role = user?.role;

        const verified = user?.verified;


        // ========================================================
        // LOGGED IN + NOT VERIFIED
        // ========================================================

        if (!verified) {

            // /verify and /verify-account are allowed
            if (VERIFICATION_ROUTES.includes(path)) {
                return {
                    success: true,
                    authenticated: true,
                    verified: false,
                    authorized: true,
                    user,
                };
            }

            // /login, /register, /forgot-password are NOT allowed
            if (AUTH_ROUTES.includes(path)) {
                redirect("/verify");

                return {
                    success: false,
                    authenticated: true,
                    verified: false,
                    authorized: false,
                    user,
                };
            }

            // Protected page
            if (requireAuth || requireVerified) {
                redirect("/verify");

                return {
                    success: false,
                    authenticated: true,
                    verified: false,
                    authorized: false,
                    user,
                };
            }

            // Other public pages are allowed
            return {
                success: true,
                authenticated: true,
                verified: false,
                authorized: true,
                user,
            };
        }


        // ========================================================
        // LOGGED IN + VERIFIED
        // ========================================================

        /*
         * Logged-in verified user cannot access:
         *
         * /login
         * /register
         * /forgot-password
         * /verify
         * /verify-account
         */

        if (
            AUTH_ROUTES.includes(path) ||
            VERIFICATION_ROUTES.includes(path)
        ) {

            redirect(getDashboardByRole(role));

            return {
                success: false,
                authenticated: true,
                verified: true,
                authorized: false,
                user,
            };
        }


        // ========================================================
        // ROLE AUTHORIZATION
        // ========================================================

        if (allowedRoles.length > 0) {

            if (!allowedRoles.includes(role)) {

                /*
                 * User tried to access admin route
                 */

                if (role === "user") {
                    redirect("/user/dashboard");
                }

                /*
                 * Admin/SuperAdmin tried unauthorized route
                 */

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
        }


        // ========================================================
        // EVERYTHING OK
        // ========================================================

        return {
            success: true,
            authenticated: true,
            verified: true,
            authorized: true,
            user,
        };


    } catch (err) {

        console.log("verifyToken error:", err);

        const code = err?.response?.data?.code;

        const errorRole = err?.response?.data?.user?.role;


        // ========================================================
        // INVALID / EXPIRED TOKEN
        // ========================================================

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
                verified: false,
                authorized: false,
                user: null,
            };
        }


        // ========================================================
        // USER NOT FOUND
        // ========================================================

        if (code === "USER_NOT_FOUND") {

            deleteToken();

            redirect("/register");

            return {
                success: false,
                authenticated: false,
                verified: false,
                authorized: false,
                user: null,
            };
        }


        // ========================================================
        // BLOCKED
        // ========================================================

        if (code === "ACCESS_BLOCKED") {

            deleteToken();

            if (errorRole === "user") {
                redirect("/user/blocked");
            }
            else if (
                errorRole === "admin" ||
                errorRole === "superAdmin"
            ) {
                redirect("/admin/blocked");
            }
            else {
                redirect("/login");
            }

            return {
                success: false,
                authenticated: false,
                verified: false,
                authorized: false,
                user: null,
            };
        }


        // ========================================================
        // NOT VERIFIED
        // ========================================================

        if (code === "NOT_VERIFIED") {

            if (!VERIFICATION_ROUTES.includes(path)) {
                redirect("/verify");
            }

            return {
                success: false,
                authenticated: true,
                verified: false,
                authorized: false,
            };
        }


        // ========================================================
        // SERVER ERROR
        // ========================================================

        message.error(
            err?.response?.data?.message ||
            "Something went wrong."
        );

        if (requireAuth) {
            redirect("/login");
        }

        return {
            success: false,
            authenticated: false,
            verified: false,
            authorized: false,
        };
    }
};