import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [logoutOpen, setLogoutOpen] = useState(false);

    const [cursor, setCursor] = useState({
        x: 0,
        y: 0,
    });

    const menuList = [
        { name: "Dashboard", path: "/admin/dashboard", icon: "ri-dashboard-3-line", },
        { name: "All Users", path: "/admin/all-users", icon: "ri-group-line", },
        { name: "All Folders", path: "/admin/all-folders", icon: "ri-folder-3-line", },
        { name: "All Files", path: "/admin/all-files", icon: "ri-file-3-line", },
        { name: "All Shared Files", path: "/admin/all-shared-files", icon: "ri-share-forward-line", },
        { name: "History", path: "/admin/history", icon: "ri-history-line", },
        { name: "Manage Services", path: "/admin/manage-services", icon: "ri-settings-3-line", },
    ];


    // BODY SCROLL LOCK
    useEffect(() => {

        if (sidebarOpen || logoutOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };

    }, [sidebarOpen, logoutOpen]);


    // ACTIVE MENU
    const isActive = (path) => {

        if (path === "/admin/dashboard") {
            return (
                location.pathname === "/admin/dashboard" || location.pathname === "/"
            );
        }

        return (
            location.pathname === path ||
            location.pathname.startsWith(path + "/")
        );
    };


    // LOGOUT
    const handleLogout = () => {

        setLogoutOpen(false);
        setSidebarOpen(false);

        // Apna logout logic yahan add kar sakte ho
        // localStorage.removeItem("token");
        // localStorage.removeItem("user");

        navigate("/login", {
            replace: true,
        });
    };


    return (
        <>

            {/* ================= NAVBAR ================= */}

            <nav
                className=" fixed top-0 left-0 right-0 z-[1000] h-[70px] border-b border-slate-200 bg-white/95 backdrop-blur-xl"
            >

                <div className=" flex h-full items-center justify-between px-4 sm:px-6 lg:px-8 " >

                    {/* LEFT */}

                    <div className="flex items-center gap-3">

                        <button
                            type="button"
                            onClick={() =>
                                setSidebarOpen(true)
                            }
                            className="group flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md active:scale-95 cursor-pointer"
                        >
                            <i className="ri-menu-line text-xl transition-transform duration-300 group-hover:scale-110" />
                        </button>

                        <div>

                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-600">
                                Admin Panel
                            </p>

                            <p className="text-sm font-bold text-slate-900 sm:text-base">
                                {
                                    menuList.find(
                                        (item) =>
                                            isActive(item.path)
                                    )?.name || "Dashboard"
                                }
                            </p>

                        </div>

                    </div>


                    {/* RIGHT */}

                    <div className="flex items-center gap-3">

                        {/* COINS */}

                        <div className="hidden items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 sm:flex">

                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
                                <i className="ri-coin-line" />
                            </div>

                            <span className="text-sm font-semibold text-blue-700" >
                                -
                            </span>

                        </div>


                        {/* PROFILE */}

                        <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-slate-200 bg-blue-100 shadow-sm">

                            {/* <img src="/assets/Secure-Share-Logo.png" alt="Profile" className="h-full w-full object-cover" /> */}

                            <div
                                className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700 text-white cursor-pointer"
                                onClick={() => navigate("/admin/profile")}
                            >
                                <i className="ri-user-3-line text-lg" />
                            </div>

                        </div>

                    </div>

                </div>

            </nav>


            {/* ================= BACKDROP ================= */}

            <div
                onClick={() => setSidebarOpen(false)}
                className={`fixed inset-0 z-[1100] bg-slate-950/40 backdrop-blur-[2px] transition-all duration-300 ${sidebarOpen ? "visible opacity-100" : "invisible opacity-0"}`}
            />


            {/* ================= SIDEBAR ================= */}

            <aside
                className={`fixed left-0 top-0 bottom-0 z-[1200] flex w-[285px] flex-col border-r border-slate-200 bg-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
            >

                {/* SIDEBAR HEADER */}

                <div
                    className="flex h-[85px] shrink-0 items-center justify-between border-b border-slate-100 px-5"
                >

                    <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/20" >
                            <i className="ri-cloud-line text-xl" />
                        </div>

                        <div>

                            <h2 className="font-bold text-slate-900">
                                {import.meta.env.VITE_SITE_NAME}
                            </h2>

                            <p className="text-[11px] text-slate-400 capitalize">
                                {location.pathname.split("/admin/")}
                            </p>

                        </div>

                    </div>


                    {/* CLOSE */}

                    <button
                        type="button"
                        onClick={() =>
                            setSidebarOpen(false)
                        }
                        className=" flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition-all duration-300 hover:rotate-90 hover:bg-slate-100 hover:text-slate-700 active:scale-90 "
                    >
                        <i className="ri-close-line text-xl" />
                    </button>

                </div>


                {/* MENU */}

                <div className=" flex-1 overflow-y-auto px-3 py-5 " >

                    <p className=" mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 " >
                        Main Menu
                    </p>


                    <div className="space-y-1">

                        {menuList.map((item) => {

                            const active = isActive(
                                item.path
                            );

                            return (
                                <button
                                    key={item.path}
                                    type="button"
                                    onClick={() => {
                                        navigate(item.path);
                                        setSidebarOpen(false);
                                    }}
                                    className={`group relative flex w-full items-center gap-3 cursor-pointer overflow-hidden rounded-xl px-3 py-3 text-left text-sm font-medium transition-all duration-300 ${active ? `bg-blue-600 text-white shadow-lg shadow-blue-600/20` : `text-slate-600 hover:translate-x-1 hover:bg-blue-50 hover:text-blue-600`}`}
                                >

                                    {/* ACTIVE LINE */}

                                    {active && (
                                        <span className=" absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-white " />
                                    )}


                                    {/* ICON */}

                                    <span
                                        className={` flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all duration-300 ${active ? ` bg-white/15 text-white ` : ` bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 `} `}
                                    >
                                        <i
                                            className={`${item.icon} text-lg`}
                                        />
                                    </span>


                                    {/* NAME */}

                                    <span className="flex-1">
                                        {item.name}
                                    </span>


                                    {/* ARROW */}

                                    <i
                                        className={` ri-arrow-right-s-line text-lg transition-all duration-300 ${active ? ` translate-x-0 opacity-100 ` : ` -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 `} `}
                                    />

                                </button>
                            );

                        })}

                    </div>

                </div>


                {/* LOGOUT */}

                <div className=" shrink-0 border-t border-slate-100 bg-slate-50/70 p-3 " >

                    <button
                        type="button"
                        onClick={() =>
                            setLogoutOpen(true)
                        }
                        className=" group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-500 transition-all duration-300 hover:bg-red-50 hover:text-red-600 active:scale-[0.98] "
                    >

                        <span
                            className=" flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 text-red-500 transition-all duration-300 group-hover:bg-red-500 group-hover:text-white "
                        >
                            <i className="ri-logout-box-r-line text-lg" />
                        </span>

                        <span>
                            Logout
                        </span>

                        <i className=" ri-arrow-right-line ml-auto opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100 " />

                    </button>

                </div>

            </aside>


            {/* ================= LOGOUT MODAL ================= */}

            <div className={` fixed inset-0 z-[2000] flex items-center justify-center px-4 transition-all duration-300 ${logoutOpen ? "visible opacity-100" : "invisible opacity-0"} `} >

                {/* MODAL BACKDROP */}

                <div onClick={() => setLogoutOpen(false)} className=" absolute inset-0 bg-slate-950/50 backdrop-blur-sm " />


                {/* MODAL */}

                <div className={` relative w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl transition-all duration-300 ${logoutOpen ? "translate-y-0 scale-100" : "translate-y-4 scale-95"} `} >

                    {/* ICON */}

                    <div className=" mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500 " >
                        <i className=" ri-logout-box-r-line text-2xl " />
                    </div>


                    <h3 className=" text-xl font-bold text-slate-900 " >
                        Logout?
                    </h3>


                    <p className=" mt-2 text-sm leading-6 text-slate-500 " >
                        Are you sure you want to logout?
                        You will need to login again to
                        access your account.
                    </p>


                    {/* BUTTONS */}

                    <div className="mt-7 flex gap-3">

                        <button
                            type="button"
                            onClick={() =>
                                setLogoutOpen(false)
                            }
                            className=" flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition-all duration-300 hover:bg-slate-50 active:scale-[0.98] "
                        >
                            Cancel
                        </button>


                        <button
                            type="button"
                            onClick={handleLogout}
                            className=" flex-1 rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-600 active:translate-y-0 "
                        >
                            <i className="ri-logout-box-r-line mr-2" />
                            Logout
                        </button>

                    </div>

                </div>

            </div>

        </>
    );
};

export default Navbar;