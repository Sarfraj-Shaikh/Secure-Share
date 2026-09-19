import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SpinLoader from "../../../shared/SpinLoader";
import { verifyToken } from "../../../../../utils/isUserLogin";

const UserDetails = () => {

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

    const { userId } = useParams();

    // =========================================================
    // STATE MANAGEMENT
    // =========================================================
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    // Editable Form States
    const [profileForm, setProfileForm] = useState({
        name: "",
        avatarUrl: "",
        verified: false,
        role: "User",
    });

    // Custom Dropdown Open States
    const [isVerifiedDropdownOpen, setIsVerifiedDropdownOpen] = useState(false);
    const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

    // Refs for Handling Outside Clicks
    const verifiedDropdownRef = useRef(null);
    const roleDropdownRef = useRef(null);

    // Custom Input States for Quick Limit/Credit Updates
    const [customStorage, setCustomStorage] = useState("");
    const [customShareLimit, setCustomShareLimit] = useState("");
    const [customFolderLimit, setCustomFolderLimit] = useState("");
    const [customCredits, setCustomCredits] = useState("");

    // Modal & Action States
    const [blockModalOpen, setBlockModalOpen] = useState(false);
    const [blockReason, setBlockReason] = useState("");
    const [blockError, setBlockError] = useState("");

    const [unblockModalOpen, setUnblockModalOpen] = useState(false);

    const [roleModalOpen, setRoleModalOpen] = useState(false);
    const [pendingRole, setPendingRole] = useState("");

    // Feedback Toast Notification State
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });

    // Helper for Toast Notifications
    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3500);
    };

    // Close Dropdowns on Outside Click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (verifiedDropdownRef.current && !verifiedDropdownRef.current.contains(event.target)) {
                setIsVerifiedDropdownOpen(false);
            }
            if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target)) {
                setIsRoleDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // =========================================================
    // INITIAL FETCH (MOCK DATA)
    // =========================================================
    useEffect(() => {
        const fetchUserDetails = async () => {
            setLoading(true);
            try {
                // API Call simulation
                await new Promise((res) => setTimeout(res, 800));

                const fetchedUser = {
                    id: userId || "1",
                    name: "Rahul Sharma",
                    email: "rahul@example.com",
                    phone: "+91 98765 43210",
                    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
                    lastLogin: "2026-09-14T10:30:00",
                    createdAt: "2026-01-10T08:20:00",
                    status: "Active", // "Active" | "Blocked"
                    blockReason: "",
                    verified: true,
                    role: "User", // "Super Admin" | "Admin" | "User"

                    // Storage & Limits
                    storageUsedGB: 45,
                    totalStorageGB: 100,

                    usedShares: 18,
                    totalShareLimit: 50,

                    usedFolders: 42,
                    totalFolderLimit: 100,

                    // Credits
                    totalCredits: 500,
                    spentCredits: 260,
                    transferredCredits: 120,

                    // Statistics
                    favouriteFolders: 12,
                    totalFilesUploaded: 340,
                };

                setUser(fetchedUser);
                setProfileForm({
                    name: fetchedUser.name,
                    avatarUrl: fetchedUser.avatarUrl,
                    verified: fetchedUser.verified,
                    role: fetchedUser.role,
                });
            } catch (error) {
                showToast("Failed to fetch user details", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, [userId]);

    // =========================================================
    // HANDLERS: PROFILE UPDATE
    // =========================================================
    const handleRoleChangeSelect = (newRole) => {
        setIsRoleDropdownOpen(false);
        if (newRole === user.role) return;
        setPendingRole(newRole);
        setRoleModalOpen(true);
    };

    const confirmRoleChange = () => {
        setProfileForm((prev) => ({ ...prev, role: pendingRole }));
        setRoleModalOpen(false);
        showToast(`Role change pending save: ${pendingRole}`);
    };

    const handleSaveProfile = (e) => {
        e.preventDefault();
        if (!profileForm.name.trim()) {
            showToast("Name cannot be empty", "error");
            return;
        }

        setUser((prev) => ({
            ...prev,
            name: profileForm.name,
            avatarUrl: profileForm.avatarUrl,
            verified: profileForm.verified,
            role: profileForm.role,
        }));

        showToast("Profile details updated successfully!");
    };

    // =========================================================
    // HANDLERS: BLOCK / UNBLOCK
    // =========================================================
    const handleConfirmBlock = () => {
        if (!blockReason.trim()) {
            setBlockError("Block reason is required.");
            return;
        }

        setUser((prev) => ({
            ...prev,
            status: "Blocked",
            blockReason: blockReason.trim(),
        }));

        setBlockModalOpen(false);
        setBlockReason("");
        setBlockError("");
        showToast("User has been blocked successfully.", "error");
    };

    const handleConfirmUnblock = () => {
        setUser((prev) => ({
            ...prev,
            status: "Active",
            blockReason: "",
        }));

        setUnblockModalOpen(false);
        showToast("User has been unblocked successfully.");
    };

    // =========================================================
    // HANDLERS: LIMITS & CREDITS MANAGEMENT
    // =========================================================
    const updateStorage = (amount, isCustom = false) => {
        const newValue = isCustom ? Number(customStorage) : user.totalStorageGB + amount;
        if (isNaN(newValue) || newValue < 0) {
            showToast("Invalid storage limit", "error");
            return;
        }
        setUser((prev) => ({ ...prev, totalStorageGB: newValue }));
        setCustomStorage("");
        showToast(`Total storage limit set to ${newValue} GB`);
    };

    const updateShareLimit = (amount, isCustom = false) => {
        const newValue = isCustom ? Number(customShareLimit) : user.totalShareLimit + amount;
        if (isNaN(newValue) || newValue < 0) {
            showToast("Invalid share limit", "error");
            return;
        }
        setUser((prev) => ({ ...prev, totalShareLimit: newValue }));
        setCustomShareLimit("");
        showToast(`Total share limit set to ${newValue}`);
    };

    const updateFolderLimit = (amount, isCustom = false) => {
        const newValue = isCustom ? Number(customFolderLimit) : user.totalFolderLimit + amount;
        if (isNaN(newValue) || newValue < 0) {
            showToast("Invalid folder limit", "error");
            return;
        }
        setUser((prev) => ({ ...prev, totalFolderLimit: newValue }));
        setCustomFolderLimit("");
        showToast(`Total folder limit set to ${newValue}`);
    };

    const updateCredits = (amount, isCustom = false) => {
        const newValue = isCustom ? Number(customCredits) : user.totalCredits + amount;
        if (isNaN(newValue) || newValue < 0) {
            showToast("Invalid credit amount", "error");
            return;
        }
        setUser((prev) => ({ ...prev, totalCredits: newValue }));
        setCustomCredits("");
        showToast(`Total credits set to ${newValue}`);
    };

    // Date Formatter
    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        return new Date(dateStr).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="flex flex-col items-center gap-4">
                    <i className="ri-loader-4-line text-5xl text-blue-600 animate-spin" />
                    <p className="text-base font-semibold text-slate-600">Loading user profile...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    if (checkingAuth) {
        return <SpinLoader />;
    }

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8 pt-10 sm:pt-[90px] antialiased">
            <div className="mx-auto max-w-7xl space-y-8">

                {/* TOAST NOTIFICATION */}
                {toast.show && (
                    <div
                        className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-4 text-base font-semibold text-white shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${toast.type === "error" ? "bg-red-600" : "bg-emerald-600"
                            }`}
                    >
                        <i className={toast.type === "error" ? "ri-error-warning-fill text-2xl" : "ri-checkbox-circle-fill text-2xl"} />
                        <span>{toast.message}</span>
                    </div>
                )}

                {/* BACK BUTTON & HEADER ACTIONS */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2.5 text-base font-bold text-slate-700 hover:text-blue-600 transition-colors"
                    >
                        <i className="ri-arrow-left-line text-xl" />
                        Back to Users
                    </button>

                    <div className="flex items-center gap-3">
                        {user.status === "Active" ? (
                            <button
                                type="button"
                                onClick={() => setBlockModalOpen(true)}
                                className="inline-flex items-center gap-2 rounded-2xl bg-red-50 px-5 py-2.5 text-sm font-bold text-red-600 border border-red-200 hover:bg-red-100 transition-all shadow-sm"
                            >
                                <i className="ri-lock-2-line text-lg" />
                                Block User
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setUnblockModalOpen(true)}
                                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-50 px-5 py-2.5 text-sm font-bold text-emerald-600 border border-emerald-200 hover:bg-emerald-100 transition-all shadow-sm"
                            >
                                <i className="ri-lock-unlock-line text-lg" />
                                Unblock User
                            </button>
                        )}
                    </div>
                </div>

                {/* BLOCK REASON ALERT BANNER */}
                {user.status === "Blocked" && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-5 flex items-start gap-4 text-red-800 shadow-sm">
                        <i className="ri-error-warning-fill text-2xl shrink-0 mt-0.5" />
                        <div>
                            <p className="font-bold text-base">This account is currently blocked.</p>
                            <p className="text-sm mt-1 leading-relaxed">
                                <span className="font-semibold">Reason:</span> {user.blockReason || "No specific reason provided."}
                            </p>
                        </div>
                    </div>
                )}

                {/* 1. TOP PROFILE SECTION */}
                <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
                            <img
                                src={user.avatarUrl}
                                alt={user.name}
                                className="h-24 w-24 shrink-0 rounded-2xl object-cover border-2 border-slate-100 shadow-md"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://via.placeholder.com/150?text=User";
                                }}
                            />
                            <div className="space-y-1.5">
                                <div className="flex flex-wrap items-center gap-3">
                                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{user.name}</h1>

                                    {/* VERIFICATION BADGE */}
                                    {user.verified ? (
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3.5 py-1 text-xs sm:text-sm font-bold text-blue-600 border border-blue-100">
                                            <i className="ri-verified-badge-fill text-blue-500 text-base" /> Verified
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs sm:text-sm font-bold text-slate-600">
                                            Not Verified
                                        </span>
                                    )}

                                    {/* STATUS BADGE */}
                                    <span
                                        className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs sm:text-sm font-bold ${user.status === "Active"
                                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                            : "bg-red-50 text-red-700 border border-red-100"
                                            }`}
                                    >
                                        <span className={`h-2 w-2 rounded-full ${user.status === "Active" ? "bg-emerald-500" : "bg-red-500"}`} />
                                        {user.status}
                                    </span>
                                </div>

                                <p className="text-base text-slate-600 font-medium">{user.email} • {user.phone}</p>

                                <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-xs sm:text-sm text-slate-500">
                                    <span><strong className="text-slate-800 font-semibold">Role:</strong> {user.role}</span>
                                    <span><strong className="text-slate-800 font-semibold">Registered:</strong> {formatDate(user.createdAt)}</span>
                                    <span><strong className="text-slate-800 font-semibold">Last Login:</strong> {formatDate(user.lastLogin)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. USER STATISTICS OVERVIEW */}
                <div className="space-y-3">
                    <h2 className="text-xs sm:text-sm font-extrabold text-slate-500 uppercase tracking-wider px-1">Activity & Statistics</h2>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm hover:border-slate-300 transition-all">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Folders</p>
                            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">{user.usedFolders}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm hover:border-slate-300 transition-all">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fav Folders</p>
                            <p className="text-2xl sm:text-3xl font-extrabold text-amber-500 mt-2">{user.favouriteFolders}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm hover:border-slate-300 transition-all">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Uploaded Files</p>
                            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">{user.totalFilesUploaded}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm hover:border-slate-300 transition-all">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Credits</p>
                            <p className="text-2xl sm:text-3xl font-extrabold text-blue-600 mt-2">{user.totalCredits}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm hover:border-slate-300 transition-all">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Spent Credits</p>
                            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">{user.spentCredits}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm hover:border-slate-300 transition-all">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Transferred</p>
                            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">{user.transferredCredits}</p>
                        </div>
                    </div>
                </div>

                {/* MAIN SECTION: 2 COLUMNS ON DESKTOP */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

                    {/* LEFT COLUMN: EDIT PROFILE FORM */}
                    <div className="lg:col-span-1">
                        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-sm space-y-6">
                            <h3 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-4">
                                Update Profile Details
                            </h3>

                            <form onSubmit={handleSaveProfile} className="space-y-5">
                                <div>
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">Name</label>
                                    <input
                                        type="text"
                                        value={profileForm.name}
                                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-base text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 font-medium"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">Profile Image URL</label>
                                    <input
                                        type="url"
                                        value={profileForm.avatarUrl}
                                        onChange={(e) => setProfileForm({ ...profileForm, avatarUrl: e.target.value })}
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-base text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 font-medium"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>

                                {/* CUSTOM DROPDOWN: VERIFICATION STATUS */}
                                <div className="relative" ref={verifiedDropdownRef}>
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">Verification Status</label>
                                    <button
                                        type="button"
                                        onClick={() => setIsVerifiedDropdownOpen((prev) => !prev)}
                                        className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-base font-medium text-slate-800 transition hover:bg-slate-100/70 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                    >
                                        <span>{profileForm.verified ? "Verified" : "Not Verified"}</span>
                                        <i className={`ri-arrow-down-s-line text-xl text-slate-500 transition-transform duration-200 ${isVerifiedDropdownOpen ? "rotate-180" : ""}`} />
                                    </button>

                                    {isVerifiedDropdownOpen && (
                                        <div className="absolute left-0 top-[108%] z-30 w-full rounded-2xl border border-slate-200/80 bg-white p-2 shadow-xl animate-in fade-in zoom-in-95">
                                            {[true, false].map((status) => (
                                                <button
                                                    key={String(status)}
                                                    type="button"
                                                    onClick={() => {
                                                        setProfileForm({ ...profileForm, verified: status });
                                                        setIsVerifiedDropdownOpen(false);
                                                    }}
                                                    className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition ${profileForm.verified === status ? "bg-blue-50 text-blue-600" : "text-slate-700 hover:bg-slate-50"
                                                        }`}
                                                >
                                                    <span>{status ? "Verified" : "Not Verified"}</span>
                                                    {profileForm.verified === status && <i className="ri-check-line text-lg text-blue-600" />}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* CUSTOM DROPDOWN: USER ROLE */}
                                <div className="relative" ref={roleDropdownRef}>
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">User Role</label>
                                    <button
                                        type="button"
                                        onClick={() => setIsRoleDropdownOpen((prev) => !prev)}
                                        className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-base font-medium text-slate-800 transition hover:bg-slate-100/70 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                    >
                                        <span>{profileForm.role}</span>
                                        <i className={`ri-arrow-down-s-line text-xl text-slate-500 transition-transform duration-200 ${isRoleDropdownOpen ? "rotate-180" : ""}`} />
                                    </button>

                                    {isRoleDropdownOpen && (
                                        <div className="absolute left-0 top-[108%] z-30 w-full rounded-2xl border border-slate-200/80 bg-white p-2 shadow-xl animate-in fade-in zoom-in-95">
                                            {["User", "Admin", "Super Admin"].map((role) => (
                                                <button
                                                    key={role}
                                                    type="button"
                                                    onClick={() => handleRoleChangeSelect(role)}
                                                    className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition ${profileForm.role === role ? "bg-blue-50 text-blue-600" : "text-slate-700 hover:bg-slate-50"
                                                        }`}
                                                >
                                                    <span>{role}</span>
                                                    {profileForm.role === role && <i className="ri-check-line text-lg text-blue-600" />}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="w-full rounded-2xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700 transition active:scale-[0.99]"
                                >
                                    Save Profile Changes
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: STORAGE, LIMITS & CREDITS MANAGEMENT */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* STORAGE & LIMITS MANAGEMENT */}
                        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-sm space-y-7">
                            <h3 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-4">
                                Manage Limits & Storage
                            </h3>

                            {/* 1. STORAGE LIMIT */}
                            <div className="space-y-3">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm font-bold gap-1">
                                    <span className="text-slate-700">Storage Usage</span>
                                    <span className="text-blue-600 text-base">{user.storageUsedGB} GB / {user.totalStorageGB} GB</span>
                                </div>
                                <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                                    <div
                                        className="h-full bg-blue-600 rounded-full transition-all duration-300"
                                        style={{ width: `${Math.min((user.storageUsedGB / user.totalStorageGB) * 100, 100)}%` }}
                                    />
                                </div>
                                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => updateStorage(10)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-100 transition">+10 GB</button>
                                        <button onClick={() => updateStorage(50)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-100 transition">+50 GB</button>
                                        <button onClick={() => updateStorage(-10)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-100 transition">-10 GB</button>
                                    </div>

                                    <div className="flex items-center gap-2 w-full sm:w-auto">
                                        <input
                                            type="number"
                                            placeholder="Custom GB"
                                            value={customStorage}
                                            onChange={(e) => setCustomStorage(e.target.value)}
                                            className="w-full sm:w-32 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 font-medium"
                                        />
                                        <button onClick={() => updateStorage(0, true)} className="rounded-xl bg-slate-900 px-4 py-2 text-xs sm:text-sm font-bold text-white hover:bg-slate-800 transition shrink-0">Set</button>
                                    </div>
                                </div>
                            </div>

                            {/* 2. SHARE LIMIT */}
                            <div className="space-y-3 border-t border-slate-100 pt-6">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm font-bold gap-1">
                                    <span className="text-slate-700">Share Limit</span>
                                    <span className="text-blue-600 text-base">{user.usedShares} / {user.totalShareLimit} Shares</span>
                                </div>
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => updateShareLimit(5)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-100 transition">+5 Shares</button>
                                        <button onClick={() => updateShareLimit(20)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-100 transition">+20 Shares</button>
                                        <button onClick={() => updateShareLimit(-5)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-100 transition">-5 Shares</button>
                                    </div>

                                    <div className="flex items-center gap-2 w-full sm:w-auto">
                                        <input
                                            type="number"
                                            placeholder="Custom Limit"
                                            value={customShareLimit}
                                            onChange={(e) => setCustomShareLimit(e.target.value)}
                                            className="w-full sm:w-32 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 font-medium"
                                        />
                                        <button onClick={() => updateShareLimit(0, true)} className="rounded-xl bg-slate-900 px-4 py-2 text-xs sm:text-sm font-bold text-white hover:bg-slate-800 transition shrink-0">Set</button>
                                    </div>
                                </div>
                            </div>

                            {/* 3. FOLDER LIMIT */}
                            <div className="space-y-3 border-t border-slate-100 pt-6">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm font-bold gap-1">
                                    <span className="text-slate-700">Folder Limit</span>
                                    <span className="text-blue-600 text-base">{user.usedFolders} / {user.totalFolderLimit} Folders</span>
                                </div>
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => updateFolderLimit(10)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-100 transition">+10 Folders</button>
                                        <button onClick={() => updateFolderLimit(50)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-100 transition">+50 Folders</button>
                                        <button onClick={() => updateFolderLimit(-10)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-100 transition">-10 Folders</button>
                                    </div>

                                    <div className="flex items-center gap-2 w-full sm:w-auto">
                                        <input
                                            type="number"
                                            placeholder="Custom Limit"
                                            value={customFolderLimit}
                                            onChange={(e) => setCustomFolderLimit(e.target.value)}
                                            className="w-full sm:w-32 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 font-medium"
                                        />
                                        <button onClick={() => updateFolderLimit(0, true)} className="rounded-xl bg-slate-900 px-4 py-2 text-xs sm:text-sm font-bold text-white hover:bg-slate-800 transition shrink-0">Set</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CREDITS MANAGEMENT */}
                        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-sm space-y-5">
                            <h3 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-4 flex items-center justify-between">
                                <span>Manage Credits</span>
                                <span className="text-base font-extrabold text-blue-600">Total: {user.totalCredits}</span>
                            </h3>

                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <button onClick={() => updateCredits(50)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-100 transition">+50 Credits</button>
                                    <button onClick={() => updateCredits(100)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-100 transition">+100 Credits</button>
                                    <button onClick={() => updateCredits(-50)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-100 transition">-50 Credits</button>
                                </div>

                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                    <input
                                        type="number"
                                        placeholder="Custom Balance"
                                        value={customCredits}
                                        onChange={(e) => setCustomCredits(e.target.value)}
                                        className="w-full sm:w-36 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 font-medium"
                                    />
                                    <button onClick={() => updateCredits(0, true)} className="rounded-xl bg-blue-600 px-4 py-2 text-xs sm:text-sm font-bold text-white hover:bg-blue-700 transition shrink-0">Set Credits</button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* =========================================================
                    MODALS (BLOCK, UNBLOCK, ROLE CONFIRMATION)
                ========================================================= */}

                {/* 1. BLOCK USER MODAL */}
                {blockModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
                        <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-7 shadow-2xl space-y-5">
                            <div className="flex items-center gap-3 text-red-600">
                                <i className="ri-error-warning-fill text-3xl" />
                                <h3 className="text-xl font-extrabold">Block User Confirmation</h3>
                            </div>

                            <p className="text-sm font-medium text-slate-600">
                                Are you sure you want to block <strong>{user.name}</strong>? Please provide a valid reason below.
                            </p>

                            <div>
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">Block Reason *</label>
                                <textarea
                                    value={blockReason}
                                    onChange={(e) => {
                                        setBlockReason(e.target.value);
                                        if (e.target.value.trim()) setBlockError("");
                                    }}
                                    rows="3"
                                    placeholder="Enter reason for blocking this account..."
                                    className="w-full rounded-2xl border border-slate-200 p-3.5 text-sm text-slate-800 outline-none focus:border-red-400 font-medium"
                                />
                                {blockError && <p className="text-xs font-bold text-red-500 mt-1.5">{blockError}</p>}
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setBlockModalOpen(false);
                                        setBlockError("");
                                    }}
                                    className="rounded-xl px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleConfirmBlock}
                                    className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-600/25 hover:bg-red-700 transition"
                                >
                                    Confirm Block
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. UNBLOCK CONFIRMATION MODAL */}
                {unblockModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
                        <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-7 shadow-2xl space-y-5">
                            <h3 className="text-xl font-extrabold text-slate-900">Unblock User</h3>
                            <p className="text-sm font-medium text-slate-600">
                                Are you sure you want to restore active access for <strong>{user.name}</strong>?
                            </p>
                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setUnblockModalOpen(false)}
                                    className="rounded-xl px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleConfirmUnblock}
                                    className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 transition"
                                >
                                    Unblock User
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. ROLE CHANGE CONFIRMATION MODAL */}
                {roleModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
                        <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-7 shadow-2xl space-y-5">
                            <div className="flex items-center gap-3 text-amber-500">
                                <i className="ri-shield-user-line text-3xl" />
                                <h3 className="text-xl font-extrabold text-slate-900">Change Role Confirmation</h3>
                            </div>
                            <p className="text-sm font-medium text-slate-600">
                                Are you sure you want to change role from <strong>{user.role}</strong> to <strong className="text-blue-600">{pendingRole}</strong>?
                            </p>
                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setRoleModalOpen(false);
                                        setProfileForm((prev) => ({ ...prev, role: user.role }));
                                    }}
                                    className="rounded-xl px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={confirmRoleChange}
                                    className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700 transition"
                                >
                                    Confirm Change
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default UserDetails;