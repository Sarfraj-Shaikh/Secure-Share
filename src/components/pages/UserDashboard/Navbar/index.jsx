import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate, } from "react-router-dom";

export const Navbar = () => {

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [logoutPopup, setLogoutPopup] = useState(false);

    const profileRef = useRef(null);

    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { name: "Dashboard", path: "/user/dashboard", icon: "ri-dashboard-3-line", },
        { name: "My Files", path: "/user/my-files", icon: "ri-user-3-line", },
        { name: "Shared Files", path: "/user/shared-files", icon: "ri-folder-shared-line", },
        { name: "Favourite", path: "/user/favourite", icon: "ri-star-line", },
        { name: "Upgrade", path: "/user/upgrade", icon: "ri-vip-crown-line", },
        { name: "Wallet", path: "/user/wallet", icon: "ri-wallet-3-line", },
        { name: "History", path: "/user/history", icon: "ri-history-line", },
    ];

    // =========================================================
    // PROFILE POPUP: OUTSIDE CLICK + ESCAPE
    // =========================================================

    useEffect(() => {

        const handleOutsideClick = (event) => {

            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileOpen(false);
            }
        };

        const handleEscape = (event) => {

            if (event.key === "Escape") {
                setProfileOpen(false);
                setLogoutPopup(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("keydown", handleEscape);

        return () => {

            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );

            document.removeEventListener(
                "keydown",
                handleEscape
            );
        };

    }, []);

    // =========================================================
    // MOBILE ROUTE CHANGE
    // =========================================================

    useEffect(() => {
        if (window.innerWidth < 1024) {
            setSidebarOpen(false);
        }
    }, [location.pathname]);

    // =========================================================
    // PROFILE NAVIGATION
    // =========================================================

    const handleProfileNavigation = () => {

        setProfileOpen(false);

        if (window.innerWidth < 1024) {
            setSidebarOpen(false);
        }

        navigate("/profile");
    };

    // =========================================================
    // LOGOUT
    // =========================================================

    const handleLogoutClick = () => {
        setProfileOpen(false);
        setLogoutPopup(true);
    };

    const confirmLogout = () => {

        // Actual logout logic yahan rakho
        //
        // localStorage.removeItem("token");
        // localStorage.removeItem("user");

        setLogoutPopup(false);
        setSidebarOpen(false);
        navigate("/login");

    };

    const cancelLogout = () => {
        setLogoutPopup(false);
    };

    // =========================================================
    // SIDEBAR TOGGLE
    // =========================================================

    const toggleSidebar = () => {
        setSidebarOpen((previous) => !previous);
        setProfileOpen(false);
    };

    return (

        <div className="bg-[#F8FAFC]">

            {/* =====================================================
                CUSTOM SCROLLBAR
            ====================================================== */}

            <style>
                {`
                    /* Sidebar Scrollbar */
                    .custom-sidebar-scrollbar::-webkit-scrollbar {
                        width: 5px;
                    }

                    .custom-sidebar-scrollbar::-webkit-scrollbar-track {
                        background: transparent;
                    }

                    .custom-sidebar-scrollbar::-webkit-scrollbar-thumb {
                        background: #334155;
                        border-radius: 9999px;
                    }

                    .custom-sidebar-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: #2563EB;
                    }

                    /* Firefox */
                    .custom-sidebar-scrollbar {
                        scrollbar-width: thin;
                        scrollbar-color: #334155 transparent;
                    }

                    /* Main scrollbar */
                    .custom-main-scrollbar::-webkit-scrollbar {
                        width: 7px;
                    }

                    .custom-main-scrollbar::-webkit-scrollbar-track {
                        background: #F8FAFC;
                    }

                    .custom-main-scrollbar::-webkit-scrollbar-thumb {
                        background: #CBD5E1;
                        border-radius: 9999px;
                    }

                    .custom-main-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: #2563EB;
                    }

                    .custom-main-scrollbar {
                        scrollbar-width: thin;
                        scrollbar-color: #CBD5E1 #F8FAFC;
                    }
                `}
            </style>

            {/* =====================================================
                MOBILE OVERLAY
            ====================================================== */}

            <div
                onClick={() => setSidebarOpen(false)}
                className={` fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-[2px] transition-all duration-300 lg:hidden ${sidebarOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"} `}
            />

            {/* =====================================================
                SIDEBAR
            ====================================================== */}

            <aside className={` fixed left-0 top-0 z-50 flex h-screen flex-col overflow-hidden bg-[#0F172A] text-white transition-all duration-300 ease-in-out ${sidebarOpen ? "w-[280px] translate-x-0" : "w-0 -translate-x-full"} lg:translate-x-0 max-lg:w-[280px] max-lg:${sidebarOpen ? "translate-x-0" : "-translate-x-full"} `} >

                {/* =================================================
                    SIDEBAR HEADER
                ================================================== */}

                <div
                    className={`flex h-[70px] shrink-0 items-center border-b border-white/10 transition-all duration-300 ${sidebarOpen ? "justify-between px-5" : "justify-center px-2"} `}
                >

                    {/* Logo */}

                    <img
                        src="/assets/upload.png"
                        onClick={() => navigate("/user/dashboard")}
                        className={`w-10 h-10 object-cover flex cursor-pointer items-center gap-3 rounded-xl transition-all duration-200 hover:opacity-90 active:scale-95`}
                    />

                    {/* Website Name */}

                    <div className={`overflow-hidden text-left whitespace-nowrap transition-all duration-300`}>

                        <p className="text-[15px] font-bold">
                            {import.meta.env.VITE_SITE_NAME}
                        </p>

                        <p className=" text-[10px] font-medium uppercase tracking-[0.15em] text-slate-400 " >
                            {location.pathname.replace("/user/", "").replaceAll("-", " ")}
                        </p>

                    </div>

                    {/* Close Button */}

                    <button
                        type="button"
                        onClick={toggleSidebar}
                        aria-label={
                            sidebarOpen
                                ? "Collapse sidebar"
                                : "Expand sidebar"
                        }
                        className=" flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-all duration-200 hover:bg-white/10 hover:text-white active:scale-90 "
                    >
                        <i className={` text-xl transition-transform duration-300 ${sidebarOpen ? "ri-menu-fold-line" : "ri-menu-unfold-line"} `} />
                    </button>

                </div>

                {/* =================================================
                    NAVIGATION
                ================================================== */}

                <div className=" custom-sidebar-scrollbar mt-6 flex-1 overflow-x-hidden overflow-y-auto px-3 pb-4 " >

                    {/* Section Title */}

                    <p className={` mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500 whitespace-nowrap transition-all duration-300 ${sidebarOpen ? "opacity-100" : "text-center opacity-0"} `} >
                        Main Menu
                    </p>

                    <nav className="space-y-1">

                        {menuItems.map((item) => (

                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                // Fix 1: Sidebar band (collapsed) hone par title/tooltip dikhao
                                title={!sidebarOpen ? item.name : undefined}
                                className={({ isActive }) =>
                                    `group relative flex h-[50px] cursor-pointer items-center rounded-xl transition-all duration-200 ${sidebarOpen ? "gap-3 px-3" : "justify-center px-0"
                                    } ${isActive
                                        ? "bg-[#2563EB] text-white shadow-lg shadow-blue-900/20"
                                        : "text-slate-400 hover:bg-white/[0.06] hover:text-white hover:translate-x-1"
                                    }`
                                }
                            >

                                {({ isActive }) => (

                                    <>

                                        {/* Active indicator */}

                                        {isActive && (
                                            <span className=" absolute -left-3 h-6 w-1 rounded-r-full bg-blue-400 " />
                                        )}

                                        {/* Icon */}

                                        <span
                                            className={` flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${isActive ? "bg-white/15" : "bg-white/[0.04] group-hover:bg-white/[0.08]"} `}
                                        >
                                            <i className={`${item.icon} text-lg`} />
                                        </span>

                                        {/* Name */}

                                        <span
                                            className={` whitespace-nowrap overflow-hidden transition-all duration-300 ${sidebarOpen ? "w-auto opacity-100" : "w-0 opacity-0"} `}
                                        >
                                            {item.name}
                                        </span>

                                        {/* Active arrow */}

                                        {isActive &&
                                            sidebarOpen && (
                                                <i className=" ri-arrow-right-s-line ml-auto text-blue-100 " />
                                            )}

                                    </>
                                )}

                            </NavLink>
                        ))}

                        {/* Divider */}

                        <div className=" my-4 border-t border-white/10 " />

                        {/* Logout */}

                        <button
                            type="button"
                            onClick={handleLogoutClick}
                            title={
                                !sidebarOpen
                                    ? "Logout"
                                    : undefined
                            }
                            className={` group flex h-[50px] w-full cursor-pointer items-center rounded-xl text-sm font-medium text-red-400 transition-all duration-200 hover:bg-red-500/10 hover:text-red-300 hover:translate-x-1 active:scale-[0.98] ${sidebarOpen ? "gap-3 px-3" : "justify-center px-0"} `}
                        >

                            <span
                                className=" flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-500/10 "
                            >
                                <i className=" ri-logout-box-r-line text-lg " />
                            </span>

                            <span className={` whitespace-nowrap overflow-hidden transition-all duration-300 ${sidebarOpen ? "w-auto opacity-100" : "w-0 opacity-0"} `} >
                                Logout
                            </span>

                            {sidebarOpen && (
                                <i className=" ri-arrow-right-s-line ml-auto opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100 " />
                            )}

                        </button>

                    </nav>

                </div>

                {/* =================================================
                    SIDEBAR FOOTER
                ================================================== */}

                <div className={` shrink-0 border-t border-white/10 transition-all duration-300 ${sidebarOpen ? "p-4" : "p-2"} `} >

                    <div
                        className={`rounded-xl bg-blue-500/[0.08] ${sidebarOpen ? "p-3" : "flex justify-center p-2"} `}
                        title={!sidebarOpen ? "Secure & Protected" : undefined}
                    >

                        <div className={` flex items-center ${sidebarOpen ? "gap-2" : "justify-center"} `} >

                            <i className=" ri-shield-check-line text-blue-400 " />

                            {sidebarOpen && (<p className=" text-xs font-medium text-slate-300 " > Secure & Protected </p>)}

                        </div>

                        {sidebarOpen && (
                            <p className=" mt-1 text-[10px] text-slate-500 " >
                                Your data is safe with us.
                            </p>
                        )}

                    </div>

                </div>

            </aside>

            {/* =====================================================
                TOP NAVBAR
            ====================================================== */}

            <header
                className={`w-full fixed right-0 top-0 z-30 h-[70px] border-b border-gray-200 bg-white/95 backdrop-blur-md transition-all duration-300 max-lg:left-0`}
            >

                <div className="flex h-full items-center justify-between px-3 sm:px-5 md:px-8">

                    {/* ================= LEFT ================= */}

                    <div className="flex items-center gap-2">

                        {/* MENU BUTTON */}

                        <button
                            type="button"
                            onClick={toggleSidebar}
                            aria-label="Toggle sidebar"
                            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-gray-600 transition-all duration-200 hover:bg-blue-50 hover:text-[#2563EB] active:scale-90"
                        >
                            <i className={`text-xl transition-transform duration-300 ${sidebarOpen ? "ri-side-bar-fill" : "ri-side-bar-line"}`} />

                        </button>

                        {/* Page Title */}

                        <div className="hidden sm:block">

                            <p className=" text-sm font-semibold capitalize text-gray-800">
                                {location.pathname.replace("/user/", "").replaceAll("-", " ")}
                            </p>

                        </div>

                    </div>

                    {/* ================= RIGHT ================= */}

                    <div className="flex items-center gap-2 sm:gap-3">

                        {/* Coins */}

                        <button
                            type="button"
                            className=" flex cursor-pointer items-center gap-2 rounded-xl bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-blue-50 hover:text-[#2563EB] active:scale-95 "
                        >

                            <i className="ri-coin-line text-lg" />
                            <span>0</span>

                        </button>

                        {/* =================================================
                            PROFILE
                        ================================================== */}

                        <div ref={profileRef} className="relative" >

                            {/* Profile Button */}

                            <button
                                type="button"
                                onClick={() =>
                                    setProfileOpen(
                                        (previous) =>
                                            !previous
                                    )
                                }
                                aria-label="Open profile menu"
                                aria-expanded={profileOpen}
                                className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-all duration-300 hover:bg-blue-50 hover:text-[#2563EB] hover:scale-105 active:scale-95 ${profileOpen ? "bg-blue-50 text-[#2563EB]" : ""}`}
                            >
                                <i className="ri-user-6-line text-lg" />

                            </button>

                            {/* PROFILE POPUP */}

                            <div
                                className={` absolute right-0 top-[calc(100%+12px)] w-[calc(100vw-24px)] max-w-[350px] origin-top-right rounded-2xl border border-gray-200 bg-white p-4 shadow-2xl shadow-gray-900/10 transition-all duration-300 ease-out ${profileOpen ? ` pointer-events-auto translate-y-0 scale-100 opacity-100 ` : ` pointer-events-none -translate-y-2 scale-95 opacity-0 `} `}
                            >

                                {/* User Details */}

                                <div className=" flex items-center gap-3 border-b border-gray-100 pb-4">

                                    <div className=" flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#2563EB] ">

                                        <i className=" ri-user-6-line text-xl " />

                                    </div>

                                    <div className="min-w-0 flex-1">

                                        <div className=" flex flex-wrap items-center gap-2 " >

                                            <p className="truncate text-sm font-semibold text-gray-900">
                                                John Doe
                                            </p>

                                            <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-[#2563EB]">
                                                User
                                            </span>

                                        </div>

                                        <p className=" mt-1 truncate text-xs text-gray-500 " >
                                            john@example.com
                                        </p>

                                        <p className=" mt-1 text-[11px] text-gray-400 " >
                                            Last Login: 25 Aug 2026
                                        </p>

                                    </div>

                                </div>

                                {/* Popup Buttons */}

                                <div className="mt-3 space-y-1">

                                    {/* My Profile */}

                                    <button
                                        type="button"
                                        onClick={
                                            handleProfileNavigation
                                        }
                                        className="group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-blue-50 hover:text-[#2563EB]"
                                    >

                                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">

                                            <i className="ri-user-line" />

                                        </span>

                                        <span>
                                            My Profile
                                        </span>

                                        <i className="ri-arrow-right-s-line ml-auto text-gray-400 transition-all duration-200 group-hover:translate-x-1" />

                                    </button>

                                    {/* Logout */}

                                    <button
                                        type="button"
                                        onClick={handleLogoutClick}
                                        className=" group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-red-600 transition-all duration-200 hover:bg-red-50 "
                                    >

                                        <span className=" flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 " >
                                            <i className=" ri-logout-box-r-line " />
                                        </span>

                                        <span>
                                            Logout
                                        </span>

                                        <i className=" ri-arrow-right-s-line ml-auto text-red-400 transition-all duration-200 group-hover:translate-x-1 " />

                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </header>

            {/* =====================================================
                LOGOUT CONFIRMATION MODAL
            ====================================================== */}

            <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm transition-all duration-300 ${logoutPopup ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"} `}>

                {/* Modal */}

                <div className={`w-full max-w-[400px] rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl transition-all duration-300 ease-out ${logoutPopup ? "translate-y-0 scale-100" : "translate-y-3 scale-95"}`}>

                    {/* Icon */}

                    <div className="flex items-center gap-4">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">

                            <i className="ri-logout-box-r-line text-xl" />

                        </div>

                        <div>

                            <h3 className=" text-base font-semibold text-gray-900 " >
                                Logout Confirmation
                            </h3>

                            <p className=" mt-0.5 text-xs text-gray-500 " >
                                Are you sure you want to logout?
                            </p>

                        </div>

                    </div>

                    {/* Message */}

                    <div className=" mt-4 rounded-xl bg-gray-50 p-3 " >
                        <p className=" text-sm leading-5 text-gray-600 " >
                            You will need to sign in again to
                            access your account.
                        </p>
                    </div>

                    {/* Buttons */}

                    <div className=" mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end " >

                        {/* Cancel */}

                        <button
                            type="button"
                            onClick={cancelLogout}
                            className=" cursor-pointer rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:border-gray-300 active:scale-95 "
                        >
                            Cancel
                        </button>

                        {/* Confirm */}

                        <button
                            type="button"
                            onClick={confirmLogout}
                            className=" cursor-pointer rounded-xl bg-red-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-red-500/20 transition-all duration-200 hover:bg-red-600 hover:shadow-md active:scale-95 "
                        >
                            Yes, Logout
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
};