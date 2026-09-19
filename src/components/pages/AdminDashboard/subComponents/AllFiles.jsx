import React, { useState, useEffect, useMemo, useRef } from "react";
import SpinLoader from "../../../shared/SpinLoader";
import { useNavigate } from "react-router-dom";
import { verifyToken } from "../../../../../utils/isUserLogin";

// Mock Data for Files
const MOCK_FILES = [
    {
        id: "file-1",
        name: "Project_Proposal_2026.pdf",
        type: "PDF Document",
        size: "4.2 MB",
        rawSizeBytes: 4404019,
        uploadedAt: "2026-09-12T14:30:00",
        updatedAt: "2026-09-14T09:15:00",
        path: "/documents/proposals/",
        status: "Active",
        user: {
            name: "Rahul Sharma",
            email: "rahul@example.com",
        },
    },
    {
        id: "file-2",
        name: "UI_Design_Assets.zip",
        type: "ZIP Archive",
        size: "128.5 MB",
        rawSizeBytes: 134742016,
        uploadedAt: "2026-08-20T11:10:00",
        updatedAt: null,
        path: "/design/assets/",
        status: "Active",
        user: {
            name: "Priya Patel",
            email: "priya@example.com",
        },
    },
    {
        id: "file-3",
        name: "Quarterly_Financial_Report.xlsx",
        type: "Excel Spreadsheet",
        size: "1.8 MB",
        rawSizeBytes: 1887436,
        uploadedAt: "2026-09-01T16:45:00",
        updatedAt: "2026-09-02T10:00:00",
        path: "/finance/2026/",
        status: "Active",
        user: {
            name: "Amit Kumar",
            email: "amit.k@example.com",
        },
    },
    {
        id: "file-4",
        name: "Marketing_Banner_HD.png",
        type: "PNG Image",
        size: "15.4 MB",
        rawSizeBytes: 16148070,
        uploadedAt: "2026-07-15T08:20:00",
        updatedAt: null,
        path: "/media/images/",
        status: "Archived",
        user: {
            name: "Sneha Reddy",
            email: "sneha.reddy@example.com",
        },
    },
    {
        id: "file-5",
        name: "Product_Demo_Video.mp4",
        type: "MP4 Video",
        size: "450.0 MB",
        rawSizeBytes: 471859200,
        uploadedAt: "2026-09-10T18:00:00",
        updatedAt: null,
        path: "/media/videos/",
        status: "Active",
        user: {
            name: "Rahul Sharma",
            email: "rahul@example.com",
        },
    },
];

const ITEMS_PER_PAGE = 4;

const AllFiles = () => {

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
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("latest"); // "latest" | "oldest"
    const [currentPage, setCurrentPage] = useState(1);

    // Custom Sort Dropdown State & Ref
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
    const sortDropdownRef = useRef(null);

    // Modal & Action States
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [fileToDelete, setFileToDelete] = useState(null);

    // Toast State
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3500);
    };

    // Outside Click for Custom Dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
                setIsSortDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Initial Data Fetching Simulation
    useEffect(() => {
        const fetchFiles = async () => {
            setLoading(true);
            try {
                await new Promise((res) => setTimeout(res, 900)); // Simulating network latency
                setFiles(MOCK_FILES);
            } catch (err) {
                showToast("Failed to fetch files list", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchFiles();
    }, []);

    // Reset Page on Search or Sort Change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, sortBy]);

    // Filter and Sort Processing
    const processedFiles = useMemo(() => {
        let result = [...files];

        // Search Filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            result = result.filter(
                (file) =>
                    file.name.toLowerCase().includes(query) ||
                    file.type.toLowerCase().includes(query) ||
                    file.user.name.toLowerCase().includes(query) ||
                    file.user.email.toLowerCase().includes(query)
            );
        }

        // Sorting
        result.sort((a, b) => {
            const dateA = new Date(a.uploadedAt).getTime();
            const dateB = new Date(b.uploadedAt).getTime();
            return sortBy === "latest" ? dateB - dateA : dateA - dateB;
        });

        return result;
    }, [files, searchQuery, sortBy]);

    // Pagination Calculation
    const totalPages = Math.ceil(processedFiles.length / ITEMS_PER_PAGE);
    const paginatedFiles = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return processedFiles.slice(start, start + ITEMS_PER_PAGE);
    }, [processedFiles, currentPage]);

    // Handlers
    const handleOpenDeleteModal = (file) => {
        setFileToDelete(file);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!fileToDelete) return;
        try {
            setFiles((prev) => prev.filter((f) => f.id !== fileToDelete.id));
            showToast(`"${fileToDelete.name}" permanently deleted.`);
        } catch (error) {
            showToast("Failed to delete file. Please try again.", "error");
        } finally {
            setDeleteModalOpen(false);
            setFileToDelete(null);
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
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">All Files</h1>
                        <p className="text-sm font-medium text-slate-500 mt-1">Manage, search, and monitor user uploaded files across the system.</p>
                    </div>
                </div>

                {/* SEARCH AND FILTER CONTROLS */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm">
                    {/* Search Bar */}
                    <div className="relative flex-1">
                        <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by file name, type, or uploader..."
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
                                    <th className="py-4 px-6">File Details</th>
                                    <th className="py-4 px-6">Size & Path</th>
                                    <th className="py-4 px-6">Dates</th>
                                    <th className="py-4 px-6">Uploaded By</th>
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
                                                <div className="h-4 w-40 rounded bg-slate-200 mb-2" />
                                                <div className="h-3 w-20 rounded bg-slate-100" />
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="h-4 w-16 rounded bg-slate-200 mb-2" />
                                                <div className="h-3 w-28 rounded bg-slate-100" />
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
                                ) : paginatedFiles.length > 0 ? (
                                    /* FILES LIST */
                                    paginatedFiles.map((file) => (
                                        <tr key={file.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 font-bold">
                                                        <i className="ri-file-text-line text-xl" />
                                                    </div>
                                                    <div>
                                                        <p className="font-extrabold text-slate-900 text-base line-clamp-1">{file.name}</p>
                                                        <span className="text-xs font-semibold text-slate-400">{file.type}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <p className="font-bold text-slate-800">{file.size}</p>
                                                <p className="text-xs text-slate-400 font-mono line-clamp-1" title={file.path}>{file.path}</p>
                                            </td>
                                            <td className="py-4 px-6">
                                                <p className="text-xs text-slate-800"><strong className="text-slate-500 font-semibold">Uploaded:</strong> {formatDate(file.uploadedAt)}</p>
                                                {file.updatedAt && (
                                                    <p className="text-xs text-slate-500 mt-0.5"><strong className="font-semibold">Updated:</strong> {formatDate(file.updatedAt)}</p>
                                                )}
                                            </td>
                                            <td className="py-4 px-6">
                                                <p className="font-bold text-slate-900">{file.user.name}</p>
                                                <p className="text-xs font-semibold text-slate-500">{file.user.email}</p>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold ${file.status === "Active" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-amber-50 text-amber-700 border border-amber-100"
                                                    }`}>
                                                    <span className={`h-1.5 w-1.5 rounded-full ${file.status === "Active" ? "bg-emerald-500" : "bg-amber-500"}`} />
                                                    {file.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => handleOpenDeleteModal(file)}
                                                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 transition shadow-sm"
                                                    title="Delete File"
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
                    {!loading && processedFiles.length === 0 && (
                        <div className="flex flex-col items-center justify-center p-12 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-slate-400 mb-4">
                                <i className="ri-folder-unknow-line text-3xl" />
                            </div>
                            <h3 className="text-lg font-extrabold text-slate-800">No files found</h3>
                            <p className="text-sm font-medium text-slate-500 max-w-sm mt-1">
                                We couldn't find any files matching your current search query or filter.
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
                {!loading && processedFiles.length > 0 && (
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-slate-200/80 bg-white px-6 py-4 shadow-sm">
                        <p className="text-sm font-semibold text-slate-500 text-center sm:text-left">
                            Showing <strong className="text-slate-800">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</strong> to{" "}
                            <strong className="text-slate-800">{Math.min(currentPage * ITEMS_PER_PAGE, processedFiles.length)}</strong> of{" "}
                            <strong className="text-slate-800">{processedFiles.length}</strong> files
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
                {deleteModalOpen && fileToDelete && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
                        <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-7 shadow-2xl space-y-5">
                            <div className="flex items-center gap-3 text-red-600">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50">
                                    <i className="ri-delete-bin-fill text-2xl" />
                                </div>
                                <h3 className="text-xl font-extrabold">Permanently Delete File?</h3>
                            </div>

                            <div className="space-y-2 text-sm text-slate-600 font-medium">
                                <p>
                                    Are you sure you want to delete <strong className="text-slate-900">{fileToDelete.name}</strong> uploaded by{" "}
                                    <strong className="text-slate-900">{fileToDelete.user.name}</strong>?
                                </p>
                                <div className="rounded-2xl bg-red-50 p-3.5 text-xs text-red-700 border border-red-100 font-bold">
                                    Warning: This action is permanent and cannot be undone. The file will be removed completely from storage.
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setDeleteModalOpen(false);
                                        setFileToDelete(null);
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

export default AllFiles;