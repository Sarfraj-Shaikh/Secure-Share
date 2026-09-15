import React, { useState, useEffect, useMemo, useRef } from "react";

// Mock Data for Shared Files
const MOCK_SHARED_FILES = [
    {
        id: "shared-1",
        name: "Q4_Product_Roadmap_2026.pdf",
        type: "PDF Document",
        size: "8.4 MB",
        uploadedAt: "2026-09-01T10:00:00",
        updatedAt: "2026-09-05T12:30:00",
        sharedAt: "2026-09-10T14:20:00",
        status: "Active",
        sharedBy: {
            name: "Rahul Sharma",
            email: "rahul@example.com",
        },
        sharedWith: [
            { name: "Priya Patel", email: "priya@example.com" },
            { name: "Amit Kumar", email: "amit.k@example.com" },
            { name: "Sneha Reddy", email: "sneha.reddy@example.com" },
            { name: "Vikram Singh", email: "vikram@example.com" },
        ],
    },
    {
        id: "shared-2",
        name: "Brand_Identity_Guidelines.zip",
        type: "ZIP Archive",
        size: "210.5 MB",
        uploadedAt: "2026-08-15T09:00:00",
        updatedAt: null,
        sharedAt: "2026-08-20T16:45:00",
        status: "Active",
        sharedBy: {
            name: "Priya Patel",
            email: "priya@example.com",
        },
        sharedWith: [
            { name: "Rahul Sharma", email: "rahul@example.com" },
        ],
    },
    {
        id: "shared-3",
        name: "Annual_Budget_Allocation.xlsx",
        type: "Excel Spreadsheet",
        size: "3.1 MB",
        uploadedAt: "2026-09-02T11:15:00",
        updatedAt: "2026-09-03T10:00:00",
        sharedAt: "2026-09-12T08:30:00",
        status: "Active",
        sharedBy: {
            name: "Amit Kumar",
            email: "amit.k@example.com",
        },
        sharedWith: [
            { name: "Priya Patel", email: "priya@example.com" },
            { name: "Sneha Reddy", email: "sneha.reddy@example.com" },
        ],
    },
    {
        id: "shared-4",
        name: "App_Promo_Video_Final.mp4",
        type: "MP4 Video",
        size: "512.0 MB",
        uploadedAt: "2026-07-20T14:00:00",
        updatedAt: null,
        sharedAt: "2026-07-25T17:10:00",
        status: "Revoked Access",
        sharedBy: {
            name: "Sneha Reddy",
            email: "sneha.reddy@example.com",
        },
        sharedWith: [
            { name: "Rahul Sharma", email: "rahul@example.com" },
            { name: "Amit Kumar", email: "amit.k@example.com" },
            { name: "Vikram Singh", email: "vikram@example.com" },
        ],
    },
    {
        id: "shared-5",
        name: "Security_Audit_Report.docx",
        type: "Word Document",
        size: "1.5 MB",
        uploadedAt: "2026-09-14T09:30:00",
        updatedAt: null,
        sharedAt: "2026-09-15T07:45:00",
        status: "Active",
        sharedBy: {
            name: "Rahul Sharma",
            email: "rahul@example.com",
        },
        sharedWith: [
            { name: "Amit Kumar", email: "amit.k@example.com" },
        ],
    },
];

const ITEMS_PER_PAGE = 4;

const AllSharedFiles = () => {
    // States
    const [sharedFiles, setSharedFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("latest"); // "latest" | "oldest"
    const [currentPage, setCurrentPage] = useState(1);

    // Custom Sort Dropdown State & Ref
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
    const sortDropdownRef = useRef(null);

    // Delete Modal & Action States
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [fileToDelete, setFileToDelete] = useState(null);

    // View Recipients Modal State
    const [recipientsModalOpen, setRecipientsModalOpen] = useState(false);
    const [selectedRecipients, setSelectedRecipients] = useState([]);
    const [selectedFileName, setSelectedFileName] = useState("");

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

    // Initial Data Fetching Simulation
    useEffect(() => {
        const fetchSharedFiles = async () => {
            setLoading(true);
            try {
                await new Promise((res) => setTimeout(res, 900));
                setSharedFiles(MOCK_SHARED_FILES);
            } catch (err) {
                showToast("Failed to fetch shared files list", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchSharedFiles();
    }, []);

    // Reset Page on Search or Sort Change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, sortBy]);

    // Filter and Sort Processing
    const processedFiles = useMemo(() => {
        let result = [...sharedFiles];

        // Search Filter (File Name, Type, Shared By, or Shared With Users)
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            result = result.filter((file) => {
                const matchesFile =
                    file.name.toLowerCase().includes(query) ||
                    file.type.toLowerCase().includes(query);
                const matchesSharedBy =
                    file.sharedBy.name.toLowerCase().includes(query) ||
                    file.sharedBy.email.toLowerCase().includes(query);
                const matchesSharedWith = file.sharedWith.some(
                    (u) => u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query)
                );
                return matchesFile || matchesSharedBy || matchesSharedWith;
            });
        }

        // Sorting by Shared Date
        result.sort((a, b) => {
            const dateA = new Date(a.sharedAt).getTime();
            const dateB = new Date(b.sharedAt).getTime();
            return sortBy === "latest" ? dateB - dateA : dateA - dateB;
        });

        return result;
    }, [sharedFiles, searchQuery, sortBy]);

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
            setSharedFiles((prev) => prev.filter((f) => f.id !== fileToDelete.id));
            showToast(`Shared file "${fileToDelete.name}" deleted and access revoked.`);
        } catch (error) {
            showToast("Failed to delete shared file. Please try again.", "error");
        } finally {
            setDeleteModalOpen(false);
            setFileToDelete(null);
        }
    };

    const handleOpenRecipientsModal = (fileName, recipients) => {
        setSelectedFileName(fileName);
        setSelectedRecipients(recipients);
        setRecipientsModalOpen(true);
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
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">All Shared Files</h1>
                        <p className="text-sm font-medium text-slate-500 mt-1">Monitor cross-user file sharing, permissions, and access privileges.</p>
                    </div>
                </div>

                {/* SEARCH AND FILTER CONTROLS */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm">
                    {/* Search Bar */}
                    <div className="relative flex-1">
                        <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by file, owner, or shared user..."
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
                                    <th className="py-4 px-6">Shared File Details</th>
                                    <th className="py-4 px-6">Dates</th>
                                    <th className="py-4 px-6">Shared By</th>
                                    <th className="py-4 px-6">Shared With</th>
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
                                                <div className="h-3 w-20 rounded bg-slate-100" />
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
                                    /* SHARED FILES LIST */
                                    paginatedFiles.map((file) => {
                                        const firstRecipient = file.sharedWith[0];
                                        const extraRecipientsCount = file.sharedWith.length - 1;

                                        return (
                                            <tr key={file.id} className="hover:bg-slate-50/80 transition-colors">
                                                {/* File Details */}
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 font-bold">
                                                            <i className="ri-share-forward-fill text-xl" />
                                                        </div>
                                                        <div>
                                                            <p className="font-extrabold text-slate-900 text-base line-clamp-1">{file.name}</p>
                                                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                                                                <span>{file.type}</span>
                                                                <span>•</span>
                                                                <span className="text-slate-600 font-bold">{file.size}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Dates */}
                                                <td className="py-4 px-6">
                                                    <p className="text-xs text-slate-800"><strong className="text-indigo-600 font-semibold">Shared:</strong> {formatDate(file.sharedAt)}</p>
                                                    <p className="text-xs text-slate-500 mt-0.5"><strong className="font-semibold">Uploaded:</strong> {formatDate(file.uploadedAt)}</p>
                                                </td>

                                                {/* Shared By */}
                                                <td className="py-4 px-6">
                                                    <p className="font-bold text-slate-900">{file.sharedBy.name}</p>
                                                    <p className="text-xs font-semibold text-slate-500">{file.sharedBy.email}</p>
                                                </td>

                                                {/* Shared With */}
                                                <td className="py-4 px-6">
                                                    <div>
                                                        <p className="font-bold text-slate-900">{firstRecipient.name}</p>
                                                        <p className="text-xs font-semibold text-slate-500">{firstRecipient.email}</p>
                                                        {extraRecipientsCount > 0 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleOpenRecipientsModal(file.name, file.sharedWith)}
                                                                className="mt-1 inline-flex items-center gap-1 text-xs font-extrabold text-blue-600 hover:text-blue-700 hover:underline"
                                                            >
                                                                <i className="ri-user-shared-line" />
                                                                +{extraRecipientsCount} more recipient{extraRecipientsCount > 1 ? "s" : ""}
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Status */}
                                                <td className="py-4 px-6">
                                                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold ${file.status === "Active" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-700 border border-red-100"
                                                        }`}>
                                                        <span className={`h-1.5 w-1.5 rounded-full ${file.status === "Active" ? "bg-emerald-500" : "bg-red-500"}`} />
                                                        {file.status}
                                                    </span>
                                                </td>

                                                {/* Actions */}
                                                <td className="py-4 px-6 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleOpenDeleteModal(file)}
                                                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 transition shadow-sm"
                                                        title="Delete Shared File & Revoke Access"
                                                    >
                                                        <i className="ri-delete-bin-line text-lg" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : null}
                            </tbody>
                        </table>
                    </div>

                    {/* EMPTY STATE */}
                    {!loading && processedFiles.length === 0 && (
                        <div className="flex flex-col items-center justify-center p-12 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-slate-400 mb-4">
                                <i className="ri-share-line text-3xl" />
                            </div>
                            <h3 className="text-lg font-extrabold text-slate-800">No shared files found</h3>
                            <p className="text-sm font-medium text-slate-500 max-w-sm mt-1">
                                We couldn't find any shared files matching your current search query or filter.
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
                            <strong className="text-slate-800">{processedFiles.length}</strong> shared files
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

                {/* VIEW ALL RECIPIENTS MODAL */}
                {recipientsModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
                        <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-7 shadow-2xl space-y-5">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                <div>
                                    <h3 className="text-xl font-extrabold text-slate-900">Shared Recipients</h3>
                                    <p className="text-xs font-semibold text-slate-500 mt-0.5 line-clamp-1">File: {selectedFileName}</p>
                                </div>
                                <button
                                    onClick={() => setRecipientsModalOpen(false)}
                                    className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                                >
                                    <i className="ri-close-line text-xl" />
                                </button>
                            </div>

                            <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 pr-1">
                                {selectedRecipients.map((user, idx) => (
                                    <div key={idx} className="flex items-center gap-3 py-3">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 font-bold text-sm">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-extrabold text-slate-900 text-sm">{user.name}</p>
                                            <p className="text-xs font-semibold text-slate-500">{user.email}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end pt-2">
                                <button
                                    type="button"
                                    onClick={() => setRecipientsModalOpen(false)}
                                    className="rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-200 transition"
                                >
                                    Close
                                </button>
                            </div>
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
                                <h3 className="text-xl font-extrabold">Delete Shared File?</h3>
                            </div>

                            <div className="space-y-3 text-sm text-slate-600 font-medium">
                                <p>
                                    Are you sure you want to delete <strong className="text-slate-900">{fileToDelete.name}</strong> uploaded by{" "}
                                    <strong className="text-slate-900">{fileToDelete.sharedBy.name}</strong>?
                                </p>

                                {/* ACCESS IMPACT WARNING */}
                                <div className="rounded-2xl bg-red-50 p-4 text-xs text-red-700 border border-red-100 space-y-1">
                                    <p className="font-extrabold text-sm flex items-center gap-1.5">
                                        <i className="ri-error-warning-fill text-lg" /> Access Impact:
                                    </p>
                                    <p className="font-semibold">
                                        Deleting this shared file will permanently remove access for all <strong className="underline">{fileToDelete.sharedWith.length} shared recipient(s)</strong> and delete the file completely from the system.
                                    </p>
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

export default AllSharedFiles;