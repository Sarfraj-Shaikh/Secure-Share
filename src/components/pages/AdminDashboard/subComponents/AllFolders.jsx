import { useState, useEffect, useMemo, useRef } from "react";
import SpinLoader from "../../../shared/SpinLoader";
import { useNavigate } from "react-router-dom";
import { verifyToken } from "../../../../../utils/isUserLogin";

// Mock Data for Folders
const MOCK_FOLDERS = [
    {
        id: "folder-1",
        name: "Marketing_Campaign_2026",
        totalFiles: 24,
        size: "142.8 MB",
        createdAt: "2026-09-10T11:20:00",
        updatedAt: "2026-09-15T08:45:00",
        path: "/workspaces/marketing/",
        status: "Active",
        user: {
            name: "Rahul Sharma",
            email: "rahul@example.com",
        },
    },
    {
        id: "folder-2",
        name: "UI_UX_Design_System",
        totalFiles: 86,
        size: "1.2 GB",
        createdAt: "2026-08-05T09:15:00",
        updatedAt: "2026-09-01T14:10:00",
        path: "/design/assets/",
        status: "Active",
        user: {
            name: "Priya Patel",
            email: "priya@example.com",
        },
    },
    {
        id: "folder-3",
        name: "Financial_Audit_Q2",
        totalFiles: 12,
        size: "45.2 MB",
        createdAt: "2026-09-01T16:30:00",
        updatedAt: null,
        path: "/finance/audits/",
        status: "Archived",
        user: {
            name: "Amit Kumar",
            email: "amit.k@example.com",
        },
    },
    {
        id: "folder-4",
        name: "Client_Presentations",
        totalFiles: 5,
        size: "18.5 MB",
        createdAt: "2026-07-12T10:00:00",
        updatedAt: "2026-08-19T11:25:00",
        path: "/sales/decks/",
        status: "Active",
        user: {
            name: "Sneha Reddy",
            email: "sneha.reddy@example.com",
        },
    },
    {
        id: "folder-5",
        name: "Website_Media_Backup",
        totalFiles: 140,
        size: "3.4 GB",
        createdAt: "2026-09-14T15:10:00",
        updatedAt: null,
        path: "/backups/media/",
        status: "Active",
        user: {
            name: "Rahul Sharma",
            email: "rahul@example.com",
        },
    },
];

const ITEMS_PER_PAGE = 4;

const AllFolders = () => {

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
    const [folders, setFolders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("latest"); // "latest" | "oldest"
    const [currentPage, setCurrentPage] = useState(1);

    // Custom Sort Dropdown State & Ref
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
    const sortDropdownRef = useRef(null);

    // Modal & Action States
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [folderToDelete, setFolderToDelete] = useState(null);

    // Toast State
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3500);
    };

    // Outside Click Handler for Custom Dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
                setIsSortDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Fetch Simulation
    useEffect(() => {
        const fetchFolders = async () => {
            setLoading(true);
            try {
                await new Promise((res) => setTimeout(res, 900));
                setFolders(MOCK_FOLDERS);
            } catch (err) {
                showToast("Failed to fetch folders list", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchFolders();
    }, []);

    // Reset Page on Search/Sort Change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, sortBy]);

    // Filter and Sort Processing
    const processedFolders = useMemo(() => {
        let result = [...folders];

        // Search Filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            result = result.filter(
                (folder) =>
                    folder.name.toLowerCase().includes(query) ||
                    folder.path.toLowerCase().includes(query) ||
                    folder.user.name.toLowerCase().includes(query) ||
                    folder.user.email.toLowerCase().includes(query)
            );
        }

        // Sorting
        result.sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return sortBy === "latest" ? dateB - dateA : dateA - dateB;
        });

        return result;
    }, [folders, searchQuery, sortBy]);

    // Pagination Calculation
    const totalPages = Math.ceil(processedFolders.length / ITEMS_PER_PAGE);
    const paginatedFolders = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return processedFolders.slice(start, start + ITEMS_PER_PAGE);
    }, [processedFolders, currentPage]);

    // Handlers
    const handleOpenDeleteModal = (folder) => {
        setFolderToDelete(folder);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!folderToDelete) return;
        try {
            setFolders((prev) => prev.filter((f) => f.id !== folderToDelete.id));
            showToast(`Folder "${folderToDelete.name}" deleted successfully.`);
        } catch (error) {
            showToast("Failed to delete folder. Please try again.", "error");
        } finally {
            setDeleteModalOpen(false);
            setFolderToDelete(null);
        }
    };

    const clearFilters = () => {
        setSearchQuery("");
        setSortBy("latest");
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        return new Date(dateStr).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
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
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">All Folders</h1>
                        <p className="text-sm font-medium text-slate-500 mt-1">Manage user folders, check directory sizes, and monitor workspace data.</p>
                    </div>
                </div>

                {/* SEARCH AND FILTER CONTROLS */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm">
                    {/* Search Bar */}
                    <div className="relative flex-1">
                        <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by folder name, path, or creator..."
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
                                    <th className="py-4 px-6">Folder Details</th>
                                    <th className="py-4 px-6">Contents & Size</th>
                                    <th className="py-4 px-6">Dates</th>
                                    <th className="py-4 px-6">Created By</th>
                                    <th className="py-4 px-6">Status</th>
                                    <th className="py-4 px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                                {loading ? (
                                    /* LOADING SKELETON STATE */
                                    Array.from({ length: 4 }).map((_, idx) => (
                                        <tr key={idx} className="animate-pulse">
                                            <td className="py-4 px-6">
                                                <div className="h-4 w-44 rounded bg-slate-200 mb-2" />
                                                <div className="h-3 w-28 rounded bg-slate-100" />
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="h-4 w-20 rounded bg-slate-200 mb-2" />
                                                <div className="h-3 w-16 rounded bg-slate-100" />
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="h-4 w-24 rounded bg-slate-200 mb-2" />
                                                <div className="h-3 w-20 rounded bg-slate-100" />
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="h-4 w-28 rounded bg-slate-200 mb-2" />
                                                <div className="h-3 w-36 rounded bg-slate-100" />
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="h-6 w-16 rounded-full bg-slate-200" />
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <div className="h-8 w-8 rounded-xl bg-slate-200 ml-auto" />
                                            </td>
                                        </tr>
                                    ))
                                ) : paginatedFolders.length > 0 ? (
                                    /* FOLDERS LIST */
                                    paginatedFolders.map((folder) => (
                                        <tr key={folder.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 font-bold">
                                                        <i className="ri-folder-3-fill text-xl" />
                                                    </div>
                                                    <div>
                                                        <p className="font-extrabold text-slate-900 text-base line-clamp-1">{folder.name}</p>
                                                        <span className="text-xs font-mono text-slate-400 line-clamp-1" title={folder.path}>{folder.path}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <p className="font-bold text-slate-800">{folder.totalFiles} Files</p>
                                                <p className="text-xs font-semibold text-slate-400 mt-0.5">{folder.size}</p>
                                            </td>
                                            <td className="py-4 px-6">
                                                <p className="text-xs text-slate-800"><strong className="text-slate-500 font-semibold">Created:</strong> {formatDate(folder.createdAt)}</p>
                                                {folder.updatedAt && (
                                                    <p className="text-xs text-slate-500 mt-0.5"><strong className="font-semibold">Updated:</strong> {formatDate(folder.updatedAt)}</p>
                                                )}
                                            </td>
                                            <td className="py-4 px-6">
                                                <p className="font-bold text-slate-900">{folder.user.name}</p>
                                                <p className="text-xs font-semibold text-slate-500">{folder.user.email}</p>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold ${folder.status === "Active" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-amber-50 text-amber-700 border border-amber-100"
                                                    }`}>
                                                    <span className={`h-1.5 w-1.5 rounded-full ${folder.status === "Active" ? "bg-emerald-500" : "bg-amber-500"}`} />
                                                    {folder.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => handleOpenDeleteModal(folder)}
                                                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 transition shadow-sm"
                                                    title="Delete Folder"
                                                >
                                                    <i className="ri-delete-bin-line text-lg" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : null}
                            </tbody>
                        </table>
                    </div>

                    {/* EMPTY STATE */}
                    {!loading && processedFolders.length === 0 && (
                        <div className="flex flex-col items-center justify-center p-12 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-slate-400 mb-4">
                                <i className="ri-folder-unknow-line text-3xl" />
                            </div>
                            <h3 className="text-lg font-extrabold text-slate-800">No folders found</h3>
                            <p className="text-sm font-medium text-slate-500 max-w-sm mt-1">
                                We couldn't find any folders matching your current search query or filter.
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
                {!loading && processedFolders.length > 0 && (
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-slate-200/80 bg-white px-6 py-4 shadow-sm">
                        <p className="text-sm font-semibold text-slate-500 text-center sm:text-left">
                            Showing <strong className="text-slate-800">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</strong> to{" "}
                            <strong className="text-slate-800">{Math.min(currentPage * ITEMS_PER_PAGE, processedFolders.length)}</strong> of{" "}
                            <strong className="text-slate-800">{processedFolders.length}</strong> folders
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

                {/* DELETE CONFIRMATION DIALOG */}
                {deleteModalOpen && folderToDelete && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
                        <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-7 shadow-2xl space-y-5">
                            <div className="flex items-center gap-3 text-red-600">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50">
                                    <i className="ri-folder-reduce-fill text-2xl" />
                                </div>
                                <h3 className="text-xl font-extrabold">Delete Folder Confirmation</h3>
                            </div>

                            <div className="space-y-3 text-sm text-slate-600 font-medium">
                                <p>
                                    Are you sure you want to delete folder <strong className="text-slate-900">{folderToDelete.name}</strong> created by{" "}
                                    <strong className="text-slate-900">{folderToDelete.user.name}</strong>?
                                </p>

                                {/* IMPACT WARNING BOX */}
                                <div className="rounded-2xl bg-red-50 p-4 text-xs text-red-700 border border-red-100 space-y-1">
                                    <p className="font-extrabold text-sm flex items-center gap-1.5">
                                        <i className="ri-error-warning-fill text-lg" /> Impact Warning:
                                    </p>
                                    <p className="font-semibold">
                                        This folder contains <strong className="underline">{folderToDelete.totalFiles} files</strong> taking up <strong className="underline">{folderToDelete.size}</strong>. Deleting this folder will permanently erase all associated nested files.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setDeleteModalOpen(false);
                                        setFolderToDelete(null);
                                    }}
                                    className="rounded-xl px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleConfirmDelete}
                                    className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-600/25 hover:bg-red-700 transition"
                                >
                                    Confirm Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default AllFolders;