import { useState, useEffect, useMemo, useRef } from "react";
import SpinLoader from "../../../shared/SpinLoader";
import { verifyToken } from "../../../../../utils/isUserLogin";
import { useNavigate } from "react-router-dom";

// Mock Data for User Activity History
const MOCK_HISTORY = [
    {
        id: "hist-1",
        user: { name: "Rahul Sharma", email: "rahul@example.com" },
        action: "File Upload",
        details: "Uploaded 'Project_Proposal_2026.pdf' (4.2 MB)",
        timestamp: "2026-09-15T12:45:00",
        status: "Completed",
    },
    {
        id: "hist-2",
        user: { name: "Priya Patel", email: "priya@example.com" },
        action: "Role Change",
        details: "Updated user role from 'User' to 'Manager'",
        timestamp: "2026-09-15T11:20:00",
        status: "Completed",
    },
    {
        id: "hist-3",
        user: { name: "Amit Kumar", email: "amit.k@example.com" },
        action: "Credit Adjustment",
        details: "Added +500 AI Generation Credits to workspace",
        timestamp: "2026-09-14T16:30:00",
        status: "Pending Approval",
    },
    {
        id: "hist-4",
        user: { name: "Sneha Reddy", email: "sneha.reddy@example.com" },
        action: "Folder Delete",
        details: "Deleted folder 'Old_Backups_2025' containing 14 files",
        timestamp: "2026-09-14T10:15:00",
        status: "Flagged",
    },
    {
        id: "hist-5",
        user: { name: "Vikram Singh", email: "vikram@example.com" },
        action: "Account Blocked",
        details: "Suspended due to suspicious login attempts",
        timestamp: "2026-09-13T18:00:00",
        status: "Under Review",
    },
    {
        id: "hist-6",
        user: { name: "Rahul Sharma", email: "rahul@example.com" },
        action: "File Share",
        details: "Shared 'Q4_Roadmap.pdf' with 3 recipients",
        timestamp: "2026-09-12T09:10:00",
        status: "Completed",
    },
];

const ITEMS_PER_PAGE = 5;

// Status Options mapping based on Activity context
const STATUS_OPTIONS = ["Completed", "Pending Approval", "Under Review", "Flagged", "Cancelled"];

const History = () => {

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

    // States
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("latest"); // "latest" | "oldest"
    const [currentPage, setCurrentPage] = useState(1);

    // Custom Sort Dropdown State & Ref
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
    const sortDropdownRef = useRef(null);

    // Status Update Modal State
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [newStatus, setNewStatus] = useState("");

    // Toast State
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3500);
    };

    // Outside Click for Custom Sort Dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
                setIsSortDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Initial Data Fetch Simulation
    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            try {
                await new Promise((res) => setTimeout(res, 900));
                setHistory(MOCK_HISTORY);
            } catch (err) {
                showToast("Failed to fetch history logs", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    // Reset Page on Search or Sort Change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, sortBy]);

    // Filter and Sort Processing
    const processedHistory = useMemo(() => {
        let result = [...history];

        // Search Filter (User, Action, Details, Status)
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            result = result.filter(
                (item) =>
                    item.user.name.toLowerCase().includes(query) ||
                    item.user.email.toLowerCase().includes(query) ||
                    item.action.toLowerCase().includes(query) ||
                    item.details.toLowerCase().includes(query) ||
                    item.status.toLowerCase().includes(query)
            );
        }

        // Sorting by Date & Time
        result.sort((a, b) => {
            const dateA = new Date(a.timestamp).getTime();
            const dateB = new Date(b.timestamp).getTime();
            return sortBy === "latest" ? dateB - dateA : dateA - dateB;
        });

        return result;
    }, [history, searchQuery, sortBy]);

    // Pagination Calculation
    const totalPages = Math.ceil(processedHistory.length / ITEMS_PER_PAGE);
    const paginatedHistory = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return processedHistory.slice(start, start + ITEMS_PER_PAGE);
    }, [processedHistory, currentPage]);

    // Handlers
    const handleOpenStatusModal = (record) => {
        setSelectedRecord(record);
        setNewStatus(record.status);
        setStatusModalOpen(true);
    };

    const handleUpdateStatus = () => {
        if (!selectedRecord || !newStatus) return;
        try {
            setHistory((prev) =>
                prev.map((item) => (item.id === selectedRecord.id ? { ...item, status: newStatus } : item))
            );
            showToast(`Status updated to "${newStatus}" for ${selectedRecord.action}`);
        } catch (error) {
            showToast("Failed to update status. Please try again.", "error");
        } finally {
            setStatusModalOpen(false);
            setSelectedRecord(null);
        }
    };

    const clearFilters = () => {
        setSearchQuery("");
        setSortBy("latest");
    };

    const formatDateTime = (dateStr) => {
        if (!dateStr) return "-";
        return new Date(dateStr).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    // Activity Badge Styling Helper
    const getActivityBadgeClass = (action) => {
        if (action.includes("Delete") || action.includes("Block")) return "bg-red-50 text-red-700 border-red-100";
        if (action.includes("Upload") || action.includes("Create")) return "bg-blue-50 text-blue-700 border-blue-100";
        if (action.includes("Share")) return "bg-indigo-50 text-indigo-700 border-indigo-100";
        if (action.includes("Role") || action.includes("Credit")) return "bg-purple-50 text-purple-700 border-purple-100";
        return "bg-slate-100 text-slate-700 border-slate-200";
    };

    // Status Badge Styling Helper
    const getStatusBadgeClass = (status) => {
        switch (status) {
            case "Completed":
                return "bg-emerald-50 text-emerald-700 border-emerald-100";
            case "Pending Approval":
                return "bg-amber-50 text-amber-700 border-amber-100";
            case "Under Review":
                return "bg-blue-50 text-blue-700 border-blue-100";
            case "Flagged":
            case "Cancelled":
                return "bg-red-50 text-red-700 border-red-100";
            default:
                return "bg-slate-50 text-slate-700 border-slate-100";
        }
    };

    if (checkingAuth) {
        return <SpinLoader />;
    }

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8 pt-[90px] antialiased">
            <div className="mx-auto max-w-7xl space-y-6">

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

                {/* PAGE HEADER */}
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Activity History</h1>
                        <p className="text-sm font-medium text-slate-500 mt-1">Audit logs, user actions, system modifications, and activity statuses.</p>
                    </div>
                </div>

                {/* SEARCH AND FILTER CONTROLS */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm">
                    {/* Search Bar */}
                    <div className="relative flex-1">
                        <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by user, action, activity details, or status..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-11 pr-4 py-3 text-sm sm:text-base font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                <i className="ri-close-circle-fill text-xl" />
                            </button>
                        )}
                    </div>

                    {/* Custom Sort Dropdown */}
                    <div className="relative" ref={sortDropdownRef}>
                        <button
                            type="button"
                            onClick={() => setIsSortDropdownOpen((prev) => !prev)}
                            className="flex w-full sm:w-52 items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm sm:text-base font-bold text-slate-700 hover:bg-slate-100/70 transition"
                        >
                            <span className="flex items-center gap-2">
                                <i className="ri-sort-desc text-lg text-slate-500" />
                                {sortBy === "latest" ? "Sort: Latest" : "Sort: Oldest"}
                            </span>
                            <i className={`ri-arrow-down-s-line text-xl text-slate-500 transition-transform duration-200 ${isSortDropdownOpen ? "rotate-180" : ""}`} />
                        </button>

                        {isSortDropdownOpen && (
                            <div className="absolute right-0 top-[108%] z-30 w-full rounded-2xl border border-slate-200/80 bg-white p-2 shadow-xl animate-in fade-in zoom-in-95">
                                {[
                                    { key: "latest", label: "Latest First" },
                                    { key: "oldest", label: "Oldest First" },
                                ].map((option) => (
                                    <button
                                        key={option.key}
                                        type="button"
                                        onClick={() => {
                                            setSortBy(option.key);
                                            setIsSortDropdownOpen(false);
                                        }}
                                        className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition ${sortBy === option.key ? "bg-blue-50 text-blue-600" : "text-slate-700 hover:bg-slate-50"
                                            }`}
                                    >
                                        <span>{option.label}</span>
                                        {sortBy === option.key && <i className="ri-check-line text-lg text-blue-600" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* MAIN DATA TABLE SECTION */}
                <div className="rounded-3xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-extrabold uppercase tracking-wider text-slate-500">
                                    <th className="py-4 px-6">User</th>
                                    <th className="py-4 px-6">Action & Details</th>
                                    <th className="py-4 px-6">Date & Time</th>
                                    <th className="py-4 px-6">Status</th>
                                    <th className="py-4 px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                                {loading ? (
                                    /* LOADING SKELETON STATE */
                                    Array.from({ length: 5 }).map((_, idx) => (
                                        <tr key={idx} className="animate-pulse">
                                            <td className="py-4 px-6">
                                                <div className="h-4 w-32 rounded bg-slate-200 mb-2" />
                                                <div className="h-3 w-40 rounded bg-slate-100" />
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="h-4 w-28 rounded bg-slate-200 mb-2" />
                                                <div className="h-3 w-48 rounded bg-slate-100" />
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="h-4 w-32 rounded bg-slate-200" />
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="h-6 w-20 rounded-full bg-slate-200" />
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <div className="h-9 w-28 rounded-xl bg-slate-200 ml-auto" />
                                            </td>
                                        </tr>
                                    ))
                                ) : paginatedHistory.length > 0 ? (
                                    /* HISTORY LOGS */
                                    paginatedHistory.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                                            {/* User Details */}
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 font-extrabold">
                                                        {item.user.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-extrabold text-slate-900 text-base">{item.user.name}</p>
                                                        <p className="text-xs font-semibold text-slate-500">{item.user.email}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Action & Details */}
                                            <td className="py-4 px-6 max-w-xs">
                                                <span className={`inline-block rounded-lg px-2.5 py-1 text-xs font-extrabold border mb-1 ${getActivityBadgeClass(item.action)}`}>
                                                    {item.action}
                                                </span>
                                                <p className="text-xs font-medium text-slate-600 line-clamp-2">{item.details}</p>
                                            </td>

                                            {/* Date & Time */}
                                            <td className="py-4 px-6 whitespace-nowrap">
                                                <p className="text-xs font-bold text-slate-800">{formatDateTime(item.timestamp)}</p>
                                            </td>

                                            {/* Status */}
                                            <td className="py-4 px-6">
                                                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold border ${getStatusBadgeClass(item.status)}`}>
                                                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                                    {item.status}
                                                </span>
                                            </td>

                                            {/* Actions CTA */}
                                            <td className="py-4 px-6 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => handleOpenStatusModal(item)}
                                                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition shadow-sm"
                                                >
                                                    <i className="ri-edit-box-line text-blue-600 text-sm" />
                                                    Update Status
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : null}
                            </tbody>
                        </table>
                    </div>

                    {/* EMPTY STATE */}
                    {!loading && processedHistory.length === 0 && (
                        <div className="flex flex-col items-center justify-center p-12 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-slate-400 mb-4">
                                <i className="ri-history-line text-3xl" />
                            </div>
                            <h3 className="text-lg font-extrabold text-slate-800">No history found</h3>
                            <p className="text-sm font-medium text-slate-500 max-w-sm mt-1">
                                We couldn't find any history logs matching your current search query or filter.
                            </p>
                            {(searchQuery || sortBy !== "latest") && (
                                <button
                                    onClick={clearFilters}
                                    className="mt-5 rounded-2xl bg-blue-50 px-5 py-2.5 text-sm font-bold text-blue-600 hover:bg-blue-100 transition"
                                >
                                    Clear Search & Filters
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* PAGINATION CONTROLS */}
                {!loading && processedHistory.length > 0 && (
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-slate-200/80 bg-white px-6 py-4 shadow-sm">
                        <p className="text-sm font-semibold text-slate-500 text-center sm:text-left">
                            Showing <strong className="text-slate-800">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</strong> to{" "}
                            <strong className="text-slate-800">{Math.min(currentPage * ITEMS_PER_PAGE, processedHistory.length)}</strong> of{" "}
                            <strong className="text-slate-800">{processedHistory.length}</strong> records
                        </p>

                        <div className="flex items-center justify-center gap-2">
                            {/* Previous Button */}
                            <button
                                type="button"
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="flex h-10 px-4 items-center justify-center rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition"
                            >
                                <i className="ri-arrow-left-s-line text-lg mr-1" /> Previous
                            </button>

                            {/* Page Indicator Buttons */}
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`h-10 w-10 rounded-xl text-sm font-extrabold transition ${currentPage === pageNum
                                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                                        : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            ))}

                            {/* Next Button */}
                            <button
                                type="button"
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="flex h-10 px-4 items-center justify-center rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition"
                            >
                                Next <i className="ri-arrow-right-s-line text-lg ml-1" />
                            </button>
                        </div>
                    </div>
                )}

                {/* STATUS UPDATE MODAL */}
                {statusModalOpen && selectedRecord && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
                        <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-7 shadow-2xl space-y-5">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                        <i className="ri-edit-box-line text-xl" />
                                    </div>
                                    <h3 className="text-xl font-extrabold text-slate-900">Update Activity Status</h3>
                                </div>
                                <button
                                    onClick={() => setStatusModalOpen(false)}
                                    className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                                >
                                    <i className="ri-close-line text-xl" />
                                </button>
                            </div>

                            <div className="space-y-3">
                                <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-100">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Activity Context</p>
                                    <p className="text-sm font-extrabold text-slate-900 mt-0.5">{selectedRecord.action}</p>
                                    <p className="text-xs font-semibold text-slate-600 mt-1">{selectedRecord.details}</p>
                                    <p className="text-xs text-slate-400 mt-2">By: {selectedRecord.user.name} ({selectedRecord.user.email})</p>
                                </div>

                                <div>
                                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                                        Select New Status
                                    </label>
                                    <div className="space-y-2">
                                        {STATUS_OPTIONS.map((statusOpt) => (
                                            <label
                                                key={statusOpt}
                                                className={`flex items-center justify-between rounded-xl p-3 border text-sm font-bold cursor-pointer transition ${newStatus === statusOpt
                                                    ? "border-blue-500 bg-blue-50/50 text-blue-700"
                                                    : "border-slate-200 hover:bg-slate-50 text-slate-700"
                                                    }`}
                                            >
                                                <span>{statusOpt}</span>
                                                <input
                                                    type="radio"
                                                    name="activityStatus"
                                                    value={statusOpt}
                                                    checked={newStatus === statusOpt}
                                                    onChange={(e) => setNewStatus(e.target.value)}
                                                    className="accent-blue-600 h-4 w-4"
                                                />
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setStatusModalOpen(false)}
                                    className="rounded-xl px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleUpdateStatus}
                                    className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700 transition"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default History;