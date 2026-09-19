import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../../../utils/api";
import SpinLoader from "../../../shared/SpinLoader";
import { verifyToken } from "../../../../../utils/isUserLogin";


const INITIAL_BLOCKED_DATA = {
    title: "Account Suspended",
    description:
        "Your account has been suspended due to security violations or violations of policy guidelines.",
    reason: "Something Went Wrong.",
    contactInfo: {
        phone: "+91 98765 43210",
        email: "support@example.com",
        address: "Building 4B, Tech Park, Cyber City, Gurugram, India",
        website: "https://example.com/help",
        socials: {
            instagram: "https://instagram.com/example",
            facebook: "https://facebook.com/example",
            twitter: "https://x.com/example",
            linkedin: "https://linkedin.com/company/example",
        },
    },
};

export default function Blocked() {

    const navigate = useNavigate();

    const [checkingAuth, setCheckingAuth] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {

        const checkAuth = async () => {

            const result = await verifyToken(navigate, {
                requireAuth: true,
                requireVerified: true,
                allowedRoles: ["user", "admin", "superAdmin"],
            });

            if (result?.success) {
                setAuthenticated(true);
            }

            setCheckingAuth(false);
        };

        checkAuth();

    }, [navigate]);

    const [blockedDetails, setBlockedDetails] = useState(
        INITIAL_BLOCKED_DATA
    );

    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState(null);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const checkAuth = async () => {

            try {

                setLoading(true);
                setApiError(null);

                const response = await api.get("/api/isAuth");

                /*
                 * Agar API successful response mein blocked user ki
                 * information bhejti hai, to yahan handle karo.
                 *
                 * Example:
                 * response.data.user.reason
                 */

                if (response?.data?.user) {

                    const user = response.data.user;

                    if (user.blocked || user.status === "blocked") {
                        if (isMounted) {
                            setBlockedDetails((prev) => ({ ...prev, reason: user.reason || prev.reason || "Something Went Wrong.", }));
                        }

                        return;
                    }
                }

                if (response?.data?.user.role === "user") {
                    navigate("/user/dashboard", { replace: true });

                } else if (response?.data?.user.role === "admin" || response?.data?.user.role === "superAdmin") {
                    navigate("/admin/dashboard", { replace: true });
                }

            } catch (err) {
                const code = err?.response?.data?.code;

                if (code === "USER_NOT_FOUND") {
                    navigate("/login", { replace: true });
                    return;
                }

                if (code === "NOT_VERIFIED") {
                    navigate("/verify", { replace: true });
                    return;
                }

                if (code === "ACCESS_BLOCKED") {
                    const user = err?.response?.data?.user;

                    if (isMounted) {
                        setBlockedDetails((prev) => ({
                            ...prev,
                            reason:
                                user?.reason ||
                                err?.response?.data?.message ||
                                "Something Went Wrong.",
                        }));
                    }

                    return;
                }

                if (isMounted) {
                    setApiError(
                        err?.response?.data?.message ||
                        "Something Went Wrong."
                    );
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        checkAuth();

        return () => {
            isMounted = false;
        };
    }, [navigate]);

    // -----------------------------
    // Contact Handlers
    // -----------------------------

    const handlePhoneClick = (phone) => {
        window.location.href = `tel:${phone.replace(/\s+/g, "")}`;
    };

    const handleEmailClick = (email) => {
        window.location.href = `mailto:${email}`;
    };

    const handleExternalLink = (url) => {
        if (!url) return;

        window.open(url, "_blank", "noopener,noreferrer");
    };

    // -----------------------------
    // Loading UI
    // -----------------------------

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-500">
                <div className="relative h-[180px] w-[180px]">
                    {Array.from({ length: 15 }, (_, index) => (
                        <div
                            key={index}
                            style={{
                                "--s": index,
                                "--delay": `${index * -0.1}s`,
                            }}
                            className="
                                absolute
                                [inset:calc(var(--s)*7px)]
                                [box-shadow:inset_0_0_50px_dodgerblue]
                                [clip-path:polygon(50%_0%,61%_35%,98%_35%,68%_57%,79%_91%,50%_70%,21%_91%,32%_57%,2%_35%,39%_35%)]
                                animate-standalone
                                [animation-delay:var(--delay)]
                            "
                        />
                    ))}
                </div>

                <p className="mt-6 text-sm font-medium">
                    Loading...
                </p>
            </div>
        );
    }

    // -----------------------------
    // API Error UI
    // -----------------------------

    if (apiError || !blockedDetails) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-md w-full text-center space-y-4">
                    <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto text-2xl">
                        <i className="ri-wifi-off-line" />
                    </div>

                    <h2 className="text-lg font-bold text-slate-800">
                        Data Fetching Error
                    </h2>

                    <p className="text-sm text-slate-500">
                        {apiError ||
                            "Blocked state information fetch nahi ho saki."}
                    </p>

                    <button
                        onClick={() => window.location.reload()}
                        className="
                            px-5 py-2.5
                            bg-blue-600
                            hover:bg-blue-700
                            text-white
                            font-semibold
                            text-sm
                            rounded-xl
                            transition
                            duration-200
                        "
                    >
                        Retry Loading
                    </button>
                </div>
            </div>
        );
    }

    // -----------------------------
    // Main UI
    // -----------------------------

    const contactInfo = blockedDetails?.contactInfo;
    const socials = contactInfo?.socials;

    const hasContactInfo = Boolean(
        contactInfo?.phone ||
        contactInfo?.email ||
        contactInfo?.address ||
        contactInfo?.website ||
        (socials &&
            Object.values(socials).some((value) => Boolean(value)))
    );

    if (checkingAuth) {
        return <SpinLoader />;
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8 font-sans antialiased flex items-center justify-center">
            <div className="w-full max-w-2xl mx-auto">
                {/* Main Blocked Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8 text-center space-y-6 relative overflow-hidden">
                    {/* Top Alert Bar */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-rose-500" />

                    {/* Alert Icon */}
                    <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto text-3xl border border-rose-100 shadow-sm">
                        <i className="ri-lock-password-line" />
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                            {blockedDetails.title || "Access Restricted"}
                        </h1>

                        <p className="text-sm sm:text-base text-slate-500 max-w-lg mx-auto leading-relaxed">
                            {blockedDetails.description ||
                                "Aapka access administrator dvaara restrict kiya gaya hai."}
                        </p>
                    </div>

                    {/* Reason */}
                    <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4 sm:p-5 text-left">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Reason for Block
                        </span>

                        <p className="text-sm text-slate-700 bg-white p-3 rounded-xl border border-slate-200/80 font-medium leading-normal">
                            {blockedDetails.reason ||
                                "Koi specific reason mention nahi kiya gaya hai."}
                        </p>
                    </div>

                    {/* Contact Button */}
                    <div className="pt-2">
                        <button
                            onClick={() => setIsContactModalOpen(true)}
                            className="
                                w-full sm:w-auto
                                px-6 py-3
                                bg-blue-600
                                hover:bg-blue-700
                                active:scale-95
                                text-white
                                font-bold
                                text-sm
                                rounded-xl
                                shadow-md
                                shadow-blue-200
                                transition
                                duration-200
                                flex
                                items-center
                                justify-center
                                gap-2
                                mx-auto
                            "
                        >
                            <i className="ri-customer-service-2-line text-lg" />
                            Contact Support Team
                        </button>
                    </div>
                </div>
            </div>

            {/* Contact Modal */}
            {isContactModalOpen && (
                <div
                    className="
                        fixed inset-0 z-50
                        flex items-center justify-center
                        bg-slate-900/40
                        backdrop-blur-sm
                        p-4
                    "
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) {
                            setIsContactModalOpen(false);
                        }
                    }}
                >
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-5 max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <i className="ri-contacts-book-2-line text-blue-600" />
                                Support Contact Details
                            </h3>

                            <button
                                type="button"
                                onClick={() =>
                                    setIsContactModalOpen(false)
                                }
                                className="text-slate-400 hover:text-slate-600 text-xl transition"
                            >
                                <i className="ri-close-line" />
                            </button>
                        </div>

                        {/* Contact Details */}
                        {hasContactInfo ? (
                            <div className="space-y-3">
                                {/* Phone */}
                                {contactInfo?.phone && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handlePhoneClick(
                                                contactInfo.phone
                                            )
                                        }
                                        className="
                                            w-full p-3
                                            bg-slate-50
                                            hover:bg-blue-50/50
                                            rounded-xl
                                            border border-slate-200/80
                                            flex items-center justify-between
                                            group transition
                                            text-left
                                        "
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-lg group-hover:bg-blue-600 group-hover:text-white transition">
                                                <i className="ri-phone-line" />
                                            </div>

                                            <div>
                                                <span className="text-[11px] font-bold text-slate-400 uppercase block">
                                                    Phone Number
                                                </span>

                                                <span className="text-sm font-semibold text-slate-800">
                                                    {contactInfo.phone}
                                                </span>
                                            </div>
                                        </div>

                                        <i className="ri-arrow-right-s-line text-slate-400 group-hover:text-blue-600 transition" />
                                    </button>
                                )}

                                {/* Email */}
                                {contactInfo?.email && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleEmailClick(
                                                contactInfo.email
                                            )
                                        }
                                        className="
                                            w-full p-3
                                            bg-slate-50
                                            hover:bg-blue-50/50
                                            rounded-xl
                                            border border-slate-200/80
                                            flex items-center justify-between
                                            group transition
                                            text-left
                                        "
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg group-hover:bg-indigo-600 group-hover:text-white transition">
                                                <i className="ri-mail-line" />
                                            </div>

                                            <div>
                                                <span className="text-[11px] font-bold text-slate-400 uppercase block">
                                                    Email Address
                                                </span>

                                                <span className="text-sm font-semibold text-slate-800">
                                                    {contactInfo.email}
                                                </span>
                                            </div>
                                        </div>

                                        <i className="ri-arrow-right-s-line text-slate-400 group-hover:text-indigo-600 transition" />
                                    </button>
                                )}

                                {/* Website */}
                                {contactInfo?.website && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleExternalLink(
                                                contactInfo.website
                                            )
                                        }
                                        className="
                                            w-full p-3
                                            bg-slate-50
                                            hover:bg-emerald-50/50
                                            rounded-xl
                                            border border-slate-200/80
                                            flex items-center justify-between
                                            group transition
                                            text-left
                                        "
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg group-hover:bg-emerald-600 group-hover:text-white transition">
                                                <i className="ri-global-line" />
                                            </div>

                                            <div>
                                                <span className="text-[11px] font-bold text-slate-400 uppercase block">
                                                    Official Website
                                                </span>

                                                <span className="text-sm font-semibold text-slate-800 break-all">
                                                    {contactInfo.website}
                                                </span>
                                            </div>
                                        </div>

                                        <i className="ri-external-link-line text-slate-400 group-hover:text-emerald-600 transition" />
                                    </button>
                                )}

                                {/* Address */}
                                {contactInfo?.address && (
                                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-lg shrink-0">
                                            <i className="ri-map-pin-line" />
                                        </div>

                                        <div>
                                            <span className="text-[11px] font-bold text-slate-400 uppercase block">
                                                Support Office Address
                                            </span>

                                            <p className="text-xs font-semibold text-slate-700 leading-normal mt-0.5">
                                                {contactInfo.address}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Socials */}
                                {socials && (
                                    <div className="pt-2">
                                        <span className="text-xs font-semibold text-slate-500 uppercase block mb-2">
                                            Social Channels
                                        </span>

                                        <div className="flex items-center gap-2 flex-wrap">
                                            {socials.instagram && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleExternalLink(
                                                            socials.instagram
                                                        )
                                                    }
                                                    className="p-2.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-xl transition text-lg"
                                                    title="Instagram"
                                                >
                                                    <i className="ri-instagram-line" />
                                                </button>
                                            )}

                                            {socials.facebook && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleExternalLink(
                                                            socials.facebook
                                                        )
                                                    }
                                                    className="p-2.5 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-xl transition text-lg"
                                                    title="Facebook"
                                                >
                                                    <i className="ri-facebook-circle-line" />
                                                </button>
                                            )}

                                            {socials.twitter && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleExternalLink(
                                                            socials.twitter
                                                        )
                                                    }
                                                    className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 rounded-xl transition text-lg"
                                                    title="X / Twitter"
                                                >
                                                    <i className="ri-twitter-x-line" />
                                                </button>
                                            )}

                                            {socials.linkedin && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleExternalLink(
                                                            socials.linkedin
                                                        )
                                                    }
                                                    className="p-2.5 bg-slate-100 hover:bg-sky-50 text-slate-600 hover:text-sky-600 rounded-xl transition text-lg"
                                                    title="LinkedIn"
                                                >
                                                    <i className="ri-linkedin-box-line" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="py-8 text-center text-slate-400">
                                <i className="ri-customer-service-line text-3xl block mb-2 opacity-50" />

                                <p className="text-sm font-medium">
                                    Koi contact details configure nahi kiye
                                    gaye hain.
                                </p>
                            </div>
                        )}

                        {/* Close */}
                        <button
                            type="button"
                            onClick={() => setIsContactModalOpen(false)}
                            className="
                                w-full py-2.5
                                bg-slate-100
                                hover:bg-slate-200
                                text-slate-700
                                font-semibold
                                text-sm
                                rounded-xl
                                transition
                            "
                        >
                            Close Window
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}