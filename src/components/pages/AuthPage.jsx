import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkIsAuth } from "../../../utils/isUserLogin";
import { message } from "antd";

const AuthPage = ({ children }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            try {
                setLoading(true);

                const result = await checkIsAuth(navigate);

                if (result?.isAuthenticated) {
                    if (result.role === "user") {
                        navigate("/user/dashboard", { replace: true });
                        return;
                    }

                    if (
                        result.role === "admin" ||
                        result.role === "superAdmin"
                    ) {
                        navigate("/admin/dashboard", { replace: true });
                        return;
                    }
                }
            } catch (err) {
                message.error(
                    err?.message || "Something went wrong"
                );
            } finally {
                setLoading(false);
            }
        };

        checkUser();
    }, [navigate]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div
                    className="
                        relative flex h-[150px] w-[150px]
                        items-center justify-center
                        overflow-hidden rounded-full
                        border border-[#333]
                        bg-transparent

                        before:absolute before:inset-[20px]
                        before:rounded-full
                        before:border before:border-dashed
                        before:border-[#444]
                        before:bg-transparent
                        before:shadow-[inset_-5px_-5px_25px_rgba(0,0,0,0.25),inset_5px_5px_35px_rgba(0,0,0,0.25)]

                        after:absolute after:h-[50px] after:w-[50px]
                        after:rounded-full
                        after:border after:border-dashed
                        after:border-[#444]
                        after:bg-transparent
                        after:shadow-[inset_-5px_-5px_25px_rgba(0,0,0,0.25),inset_5px_5px_35px_rgba(0,0,0,0.25)]
                    "
                >
                    <span
                        className="
                            absolute left-1/2 top-1/2
                            h-full w-1/2
                            origin-top-left
                            border-t border-dashed border-white
                            bg-transparent
                            animate-[radar81_2s_linear_infinite]

                            before:absolute before:left-0 before:top-0
                            before:h-full before:w-full
                            before:origin-top-left
                            before:rotate-[-55deg]
                            before:bg-seagreen
                            before:blur-[30px]
                            before:drop-shadow-[20px_20px_20px_seagreen]
                        "
                    />
                </div>
            </div>
        );
    }

    return children;
};

export default AuthPage;