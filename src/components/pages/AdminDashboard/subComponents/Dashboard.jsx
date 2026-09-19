import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { verifyToken } from "../../../../../utils/isUserLogin";
import SpinLoader from "../../../shared/SpinLoader";

// Mock Data for Analytics
const INITIAL_STATS = {
    users: { total: 1250, active: 1120, inactive: 130 },
    folders: { total: 3420, favorites: 480 },
    files: {
        total: 18450,
        images: 8200,
        videos: 3100,
        audios: 1950,
        text: 1400,
        zip: 850,
        apk: 420,
        pdf: 2100,
        others: 430,
    },
};

const Dashboard = () => {

    const navigate = useNavigate();

    const [checkingAuth, setCheckingAuth] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {

        const checkAuth = async () => {

            const result = await verifyToken(navigate, {
                requireAuth: true,
                requireVerified: true,
                allowedRoles: ["admin", "superAdmin"],
            });

            if (result?.success) {
                setAuthenticated(true);
            }

            setCheckingAuth(false);
        };

        checkAuth();

    }, [navigate]);

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch Simulation
    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                await new Promise((res) => setTimeout(res, 600));
                setStats(INITIAL_STATS);
            } catch (err) {
                console.error("Failed to load dashboard stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    // Reusable Clickable Analytics Card
    const StatCard = ({ title, count, icon, colorClass, borderHoverClass, path, subtitle }) => (
        <div
            onClick={() => navigate(path)}
            className={`group relative cursor-pointer overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${borderHoverClass}`}
        >
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">{title}</p>
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900">{count?.toLocaleString()}</h3>
                    {subtitle && <p className="text-xs font-semibold text-slate-500">{subtitle}</p>}
                </div>
                <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 ${colorClass}`}>
                    <i className={`${icon} text-2xl sm:text-3xl`} />
                </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-slate-400 transition-colors group-hover:text-blue-600">
                <span>View Details</span>
                <i className="ri-arrow-right-line transition-transform duration-300 group-hover:translate-x-1" />
            </div>
        </div>
    );

    if (checkingAuth) {
        return <SpinLoader />;
    }

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8 pt-[90px] antialiased">
            <div className="mx-auto max-w-7xl space-y-8">

                {/* PAGE HEADER */}
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">System Overview Dashboard</h1>
                        <p className="text-sm font-medium text-slate-500 mt-1">Real-time statistics for users, storage folders, and file extensions.</p>
                    </div>
                    <button
                        onClick={() => navigate("/admin/manage-services")}
                        className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition"
                    >
                        <i className="ri-settings-4-line text-base" />
                        Manage Services
                    </button>
                </div>

                {loading ? (
                    /* LOADING SKELETON */
                    <div className="space-y-6 animate-pulse">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-36 rounded-3xl bg-slate-200" />
                            ))}
                        </div>
                        <div className="h-48 rounded-3xl bg-slate-200" />
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <div key={i} className="h-32 rounded-3xl bg-slate-200" />
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        {/* SECTION 1: USER MANAGEMENT STATS */}
                        <div>
                            <h2 className="text-lg font-extrabold text-slate-800 mb-4 flex items-center gap-2">
                                <i className="ri-user-star-line text-blue-600" />
                                User Metrics
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <StatCard
                                    title="Total Users"
                                    count={stats.users.total}
                                    icon="ri-group-line"
                                    colorClass="bg-blue-50 text-blue-600"
                                    borderHoverClass="hover:border-blue-500"
                                    path="/admin/all-users"
                                    subtitle="All registered accounts"
                                />
                                <StatCard
                                    title="Active Users"
                                    count={stats.users.active}
                                    icon="ri-user-line"
                                    colorClass="bg-emerald-50 text-emerald-600"
                                    borderHoverClass="hover:border-emerald-500"
                                    path="/admin/all-users"
                                    subtitle="Currently active accounts"
                                />
                                <StatCard
                                    title="Inactive Users"
                                    count={stats.users.inactive}
                                    icon="ri-user-unfollow-line"
                                    colorClass="bg-red-50 text-red-600"
                                    borderHoverClass="hover:border-red-500"
                                    path="/admin/all-users"
                                    subtitle="Suspended or dormant"
                                />
                            </div>
                        </div>

                        {/* SECTION 2: FOLDER & OVERALL FILES STATS */}
                        <div>
                            <h2 className="text-lg font-extrabold text-slate-800 mb-4 flex items-center gap-2">
                                <i className="ri-folder-shared-line text-amber-600" />
                                Directories & Storage
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <StatCard
                                    title="Total Folders"
                                    count={stats.folders.total}
                                    icon="ri-folder-3-line"
                                    colorClass="bg-amber-50 text-amber-600"
                                    borderHoverClass="hover:border-amber-500"
                                    path="/admin/all-folders"
                                    subtitle="User directory trees"
                                />
                                <StatCard
                                    title="Favorite Folders"
                                    count={stats.folders.favorites}
                                    icon="ri-star-fill"
                                    colorClass="bg-yellow-50 text-yellow-600"
                                    borderHoverClass="hover:border-yellow-500"
                                    path="/admin/all-folders"
                                    subtitle="Bookmarked by users"
                                />
                                <StatCard
                                    title="Total Files"
                                    count={stats.files.total}
                                    icon="ri-file-line"
                                    colorClass="bg-indigo-50 text-indigo-600"
                                    borderHoverClass="hover:border-indigo-500"
                                    path="/admin/all-files"
                                    subtitle="Overall uploaded files"
                                />
                            </div>
                        </div>

                        {/* SECTION 3: FILE TYPE BREAKDOWN */}
                        <div>
                            <h2 className="text-lg font-extrabold text-slate-800 mb-4 flex items-center gap-2">
                                <i className="ri-pie-chart-2-line text-purple-600" />
                                File Categories & Types
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                                <StatCard
                                    title="Images"
                                    count={stats.files.images}
                                    icon="ri-image-line"
                                    colorClass="bg-sky-50 text-sky-600"
                                    borderHoverClass="hover:border-sky-500"
                                    path="/admin/all-files"
                                />
                                <StatCard
                                    title="Videos"
                                    count={stats.files.videos}
                                    icon="ri-video-line"
                                    colorClass="bg-rose-50 text-rose-600"
                                    borderHoverClass="hover:border-rose-500"
                                    path="/admin/all-files"
                                />
                                <StatCard
                                    title="Audios"
                                    count={stats.files.audios}
                                    icon="ri-music-2-line"
                                    colorClass="bg-purple-50 text-purple-600"
                                    borderHoverClass="hover:border-purple-500"
                                    path="/admin/all-files"
                                />
                                <StatCard
                                    title="Documents & Text"
                                    count={stats.files.text}
                                    icon="ri-file-text-line"
                                    colorClass="bg-teal-50 text-teal-600"
                                    borderHoverClass="hover:border-teal-500"
                                    path="/admin/all-files"
                                />
                                <StatCard
                                    title="PDF Files"
                                    count={stats.files.pdf}
                                    icon="ri-file-pdf-line"
                                    colorClass="bg-orange-50 text-orange-600"
                                    borderHoverClass="hover:border-orange-500"
                                    path="/admin/all-files"
                                />
                                <StatCard
                                    title="ZIP Archives"
                                    count={stats.files.zip}
                                    icon="ri-file-zip-line"
                                    colorClass="bg-yellow-50 text-yellow-700"
                                    borderHoverClass="hover:border-yellow-600"
                                    path="/admin/all-files"
                                />
                                <StatCard
                                    title="APK Packages"
                                    count={stats.files.apk}
                                    icon="ri-android-line"
                                    colorClass="bg-emerald-50 text-emerald-600"
                                    borderHoverClass="hover:border-emerald-500"
                                    path="/admin/all-files"
                                />
                                <StatCard
                                    title="Other Extensions"
                                    count={stats.files.others}
                                    icon="ri-more-fill"
                                    colorClass="bg-slate-100 text-slate-700"
                                    borderHoverClass="hover:border-slate-400"
                                    path="/admin/all-files"
                                />
                            </div>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
};

export default Dashboard;