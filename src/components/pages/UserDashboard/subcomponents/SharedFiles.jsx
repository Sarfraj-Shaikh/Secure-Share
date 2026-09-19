import { useEffect, useMemo, useState } from "react";
import { verifyToken } from "../../../../../utils/isUserLogin";
import SpinLoader from "../../../shared/SpinLoader";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 6;

const defaultFiles = [
    {
        id: "1",
        name: "Project Proposal.pdf",
        type: "PDF",
        size: "2.4 MB",
        sharedAt: "14 Sep 2026, 10:42 AM",
        receiverEmail: "john@example.com",
        password: null,
        expiresAt: "2026-09-20",
    },
    {
        id: "2",
        name: "Brand Guidelines.zip",
        type: "ZIP",
        size: "18.7 MB",
        sharedAt: "13 Sep 2026, 04:18 PM",
        receiverEmail: "sarah@example.com",
        password: "protected",
        expiresAt: "2026-09-30",
    },
    {
        id: "3",
        name: "Invoice September.xlsx",
        type: "XLSX",
        size: "842 KB",
        sharedAt: "12 Sep 2026, 11:05 AM",
        receiverEmail: "accounts@company.com",
        password: null,
        expiresAt: null,
    },
    {
        id: "4",
        name: "Presentation.pptx",
        type: "PPTX",
        size: "6.2 MB",
        sharedAt: "10 Sep 2026, 09:30 AM",
        receiverEmail: "client@example.com",
        password: "protected",
        expiresAt: "2026-09-18",
    },
    {
        id: "5",
        name: "Product Images.rar",
        type: "RAR",
        size: "42.1 MB",
        sharedAt: "08 Sep 2026, 02:45 PM",
        receiverEmail: "design@example.com",
        password: null,
        expiresAt: "2026-09-25",
    },
    {
        id: "6",
        name: "Requirements.docx",
        type: "DOCX",
        size: "1.1 MB",
        sharedAt: "05 Sep 2026, 06:12 PM",
        receiverEmail: "team@example.com",
        password: "protected",
        expiresAt: null,
    },
    {
        id: "7",
        name: "Database Backup.sql",
        type: "SQL",
        size: "24.8 MB",
        sharedAt: "03 Sep 2026, 12:20 PM",
        receiverEmail: "dev@example.com",
        password: null,
        expiresAt: "2026-09-17",
    },
];

const getFileIcon = (type) => {
    switch (type.toLowerCase()) {
        case "pdf":
            return "ri-file-pdf-2-line";
        case "docx":
            return "ri-file-word-2-line";
        case "xlsx":
            return "ri-file-excel-2-line";
        case "pptx":
            return "ri-file-ppt-2-line";
        case "zip":
        case "rar":
            return "ri-file-zip-line";
        default:
            return "ri-file-line";
    }
};

const getFileIconBackground = (type) => {
    switch (type.toLowerCase()) {
        case "pdf":
            return "bg-red-50 text-red-500";
        case "docx":
            return "bg-blue-50 text-blue-600";
        case "xlsx":
            return "bg-emerald-50 text-emerald-600";
        case "pptx":
            return "bg-orange-50 text-orange-500";
        case "zip":
        case "rar":
            return "bg-purple-50 text-purple-600";
        default:
            return "bg-slate-100 text-slate-500";
    }
};

export default function SharedFiles({ files = defaultFiles, loading = false, error = null, onPasswordChange, }) {

    const [localFiles, setLocalFiles] = useState(files);

    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("latest");
    const [sortOpen, setSortOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [activeMenu, setActiveMenu] = useState(null);

    const [passwordModal, setPasswordModal] = useState(null);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [expiresAt, setExpiresAt] = useState("");

    const [passwordError, setPasswordError] = useState("");
    const [savingPassword, setSavingPassword] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const navigate = useNavigate();

    const [checkingAuth, setCheckingAuth] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {

        const checkAuth = async () => {

            const result = await verifyToken(navigate, {
                requireAuth: true,
                requireVerified: true,
                allowedRoles: ["user"],
            });

            if (result?.success) {
                setAuthenticated(true);
            }

            setCheckingAuth(false);
        };

        checkAuth();

    }, [navigate]);

    /*
     * Selected File
     */
    const selectedFile = useMemo(() => {
        if (!passwordModal?.fileId) return null;
        return localFiles.find((f) => f.id === passwordModal.fileId) || null;
    }, [passwordModal, localFiles]);

    /*
     * Search + Sort
     */
    const filteredFiles = useMemo(() => {
        const query = search.trim().toLowerCase();

        const result = localFiles.filter((file) => {
            if (!query) return true;

            return (
                file.name.toLowerCase().includes(query) ||
                file.type.toLowerCase().includes(query) ||
                file.receiverEmail.toLowerCase().includes(query)
            );
        });

        return [...result].sort((a, b) => {
            const dateA = new Date(a.sharedAt).getTime();
            const dateB = new Date(b.sharedAt).getTime();

            return sort === "latest" ? dateB - dateA : dateA - dateB;
        });
    }, [localFiles, search, sort]);

    /*
     * Pagination
     */
    const totalPages = Math.ceil(filteredFiles.length / ITEMS_PER_PAGE);

    const paginatedFiles = filteredFiles.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    /*
     * Search
     */
    const handleSearch = (value) => {
        setSearch(value);
        setCurrentPage(1);
    };

    /*
     * Sort
     */
    const handleSort = (value) => {
        setSort(value);
        setSortOpen(false);
        setCurrentPage(1);
    };

    /*
     * Open Password Modal
     */
    const openPasswordModal = (file, mode) => {
        setActiveMenu(null);
        setPassword("");
        setConfirmPassword("");
        setExpiresAt(file.expiresAt || "");
        setPasswordError("");

        setPasswordModal({
            fileId: file.id,
            mode,
        });
    };

    /*
     * Close Password Modal
     */
    const closePasswordModal = () => {
        if (savingPassword) return;

        setPasswordModal(null);
        setPassword("");
        setConfirmPassword("");
        setExpiresAt("");
        setPasswordError("");
    };

    /*
     * Password Submit
     */
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        if (password.length < 6) {
            setPasswordError("Password must be at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setPasswordError("Passwords do not match.");
            return;
        }

        if (!passwordModal) return;

        try {
            setSavingPassword(true);
            setPasswordError("");

            if (onPasswordChange) {
                await onPasswordChange(passwordModal.fileId, password, expiresAt);
            }

            setLocalFiles((currentFiles) =>
                currentFiles.map((file) =>
                    file.id === passwordModal.fileId
                        ? {
                            ...file,
                            password: "protected",
                            expiresAt: expiresAt || null,
                        }
                        : file
                )
            );

            setSuccessMessage("File settings updated successfully.");

            closePasswordModal();

            setTimeout(() => {
                setSuccessMessage("");
            }, 3000);
        } catch (err) {
            setPasswordError("Unable to update settings. Please try again.");
        } finally {
            setSavingPassword(false);
        }
    };

    /*
     * Pagination Buttons
     */
    const renderPagination = () => {
        if (totalPages <= 1) return null;

        return (
            <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <p className="text-center text-sm text-slate-500 sm:text-left">
                    Showing{" "}
                    <span className="font-medium text-slate-700">
                        {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                    </span>{" "}
                    -{" "}
                    <span className="font-medium text-slate-700">
                        {Math.min(
                            currentPage * ITEMS_PER_PAGE,
                            filteredFiles.length
                        )}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-slate-700">
                        {filteredFiles.length}
                    </span>
                </p>

                <div className="flex items-center justify-center gap-1">
                    <button
                        type="button"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((page) => page - 1)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-all duration-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <i className="ri-arrow-left-s-line text-lg" />
                    </button>

                    {Array.from({ length: totalPages }).map((_, index) => {
                        const pageNumber = index + 1;

                        return (
                            <button
                                key={pageNumber}
                                type="button"
                                onClick={() => setCurrentPage(pageNumber)}
                                className={`flex h-9 min-w-[36px] items-center justify-center rounded-lg px-2 text-sm font-medium transition-all duration-200 ${currentPage === pageNumber
                                    ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                                    : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                                    }`}
                            >
                                {pageNumber}
                            </button>
                        );
                    })}

                    <button
                        type="button"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((page) => page + 1)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-all duration-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <i className="ri-arrow-right-s-line text-lg" />
                    </button>
                </div>
            </div>
        );
    };

    if (checkingAuth) {
        return <SpinLoader />;
    }

    return (
        <section className="w-full pt-[90px] pb-5 overflow-hidden">
            {/* ================= HEADER ================= */}
            <div className="border-b border-slate-100 p-4 sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                            Shared Files
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Manage and monitor files you have shared.
                        </p>
                    </div>

                    {/* Search + Filter */}
                    <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
                        {/* Search */}
                        <div className="relative w-full sm:w-72 lg:w-80">
                            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-lg text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="Search shared files..."
                                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm text-slate-700 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={() => handleSearch("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                                >
                                    <i className="ri-close-circle-fill text-lg" />
                                </button>
                            )}
                        </div>

                        {/* Custom Dropdown */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setSortOpen((open) => !open)}
                                className="flex h-10 w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-blue-200 hover:bg-blue-50/50 sm:w-36"
                            >
                                <span className="flex items-center gap-2">
                                    <i className="ri-equalizer-2-line text-base text-blue-600" />
                                    {sort === "latest" ? "Latest" : "Oldest"}
                                </span>
                                <i
                                    className={`ri-arrow-down-s-line transition-transform duration-200 ${sortOpen ? "rotate-180" : ""
                                        }`}
                                />
                            </button>

                            {sortOpen && (
                                <>
                                    <button
                                        type="button"
                                        aria-label="Close sort menu"
                                        className="fixed inset-0 z-10 cursor-default"
                                        onClick={() => setSortOpen(false)}
                                    />

                                    <div className="absolute right-0 z-20 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-200/50 sm:w-36">
                                        <button
                                            type="button"
                                            onClick={() => handleSort("latest")}
                                            className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition ${sort === "latest"
                                                ? "bg-blue-50 font-medium text-blue-600"
                                                : "text-slate-600 hover:bg-slate-50"
                                                }`}
                                        >
                                            Latest
                                            {sort === "latest" && (
                                                <i className="ri-check-line" />
                                            )}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleSort("oldest")}
                                            className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition ${sort === "oldest"
                                                ? "bg-blue-50 font-medium text-blue-600"
                                                : "text-slate-600 hover:bg-slate-50"
                                                }`}
                                        >
                                            Oldest
                                            {sort === "oldest" && (
                                                <i className="ri-check-line" />
                                            )}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ================= SUCCESS MESSAGE ================= */}
            {successMessage && (
                <div className="mx-4 mt-4 flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 sm:mx-6">
                    <i className="ri-checkbox-circle-fill text-lg" />
                    <span>{successMessage}</span>
                    <button
                        type="button"
                        onClick={() => setSuccessMessage("")}
                        className="ml-auto text-emerald-500 transition hover:text-emerald-700"
                    >
                        <i className="ri-close-line text-lg" />
                    </button>
                </div>
            )}

            {/* ================= FILE LIST ================= */}
            {!loading && !error && paginatedFiles.length > 0 && (
                <>
                    {/* Desktop Header */}
                    <div className="hidden border-b border-slate-100 bg-slate-50/60 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400 lg:grid lg:grid-cols-[2fr_1.3fr_1.1fr_1.5fr_1fr_40px] lg:items-center lg:gap-4">
                        <span>File</span>
                        <span>Receiver</span>
                        <span>Shared At</span>
                        <span>Password</span>
                        <span>Expires</span>
                        <span />
                    </div>

                    <div className="divide-y divide-slate-100">
                        {paginatedFiles.map((file) => (
                            <div
                                key={file.id}
                                className="group relative p-4 transition-all duration-200 hover:bg-blue-50/30 sm:p-5 lg:px-6"
                            >
                                <div className="grid gap-3 sm:gap-4 lg:grid-cols-[2fr_1.3fr_1.1fr_1.5fr_1fr_40px] lg:items-center lg:gap-4">
                                    {/* File */}
                                    <div className="flex min-w-0 items-center gap-3 pr-10 lg:pr-0">
                                        <div
                                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${getFileIconBackground(
                                                file.type
                                            )}`}
                                        >
                                            <i
                                                className={`${getFileIcon(
                                                    file.type
                                                )} text-xl`}
                                            />
                                        </div>

                                        <div className="min-w-0">
                                            <p
                                                className="truncate text-sm font-semibold text-slate-800"
                                                title={file.name}
                                            >
                                                {file.name}
                                            </p>
                                            <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                                                <span>{file.type}</span>
                                                <span className="h-1 w-1 rounded-full bg-slate-300" />
                                                <span>{file.size}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Receiver */}
                                    <div className="min-w-0">
                                        <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-slate-400 lg:hidden">
                                            Receiver
                                        </p>
                                        <div className="flex min-w-0 items-center gap-2">
                                            <i className="ri-mail-line shrink-0 text-slate-400" />
                                            <span
                                                className="truncate text-sm text-slate-600"
                                                title={file.receiverEmail}
                                            >
                                                {file.receiverEmail}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Shared At */}
                                    <div>
                                        <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-slate-400 lg:hidden">
                                            Shared At
                                        </p>
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <i className="ri-time-line text-slate-400" />
                                            <span>{file.sharedAt}</span>
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div>
                                        <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-slate-400 lg:hidden">
                                            Password
                                        </p>
                                        {file.password ? (
                                            <div className="flex items-center gap-2">
                                                <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-700">
                                                    <i className="ri-lock-line" />
                                                    Protected
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-500">
                                                <i className="ri-lock-unlock-line" />
                                                No password
                                            </span>
                                        )}
                                    </div>

                                    {/* Expiry */}
                                    <div>
                                        <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-slate-400 lg:hidden">
                                            Expires
                                        </p>
                                        {file.expiresAt ? (
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <i className="ri-calendar-event-line text-slate-400" />
                                                <span>{file.expiresAt}</span>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-slate-400">
                                                Never
                                            </span>
                                        )}
                                    </div>

                                    {/* Three Dot Menu */}
                                    <div className="absolute right-4 top-4 lg:static lg:flex lg:justify-end">
                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setActiveMenu((current) =>
                                                        current === file.id
                                                            ? null
                                                            : file.id
                                                    )
                                                }
                                                className={`flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-slate-700 ${activeMenu === file.id
                                                    ? "bg-slate-100 text-slate-700"
                                                    : ""
                                                    }`}
                                            >
                                                <i className="ri-more-2-fill text-lg" />
                                            </button>

                                            {activeMenu === file.id && (
                                                <>
                                                    <button
                                                        type="button"
                                                        aria-label="Close menu"
                                                        className="fixed inset-0 z-10 cursor-default"
                                                        onClick={() =>
                                                            setActiveMenu(null)
                                                        }
                                                    />

                                                    <div className="absolute right-0 top-10 z-20 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-200/50">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                openPasswordModal(
                                                                    file,
                                                                    file.password
                                                                        ? "change"
                                                                        : "add"
                                                                )
                                                            }
                                                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
                                                        >
                                                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                                                <i className="ri-settings-4-line" />
                                                            </span>
                                                            <span>
                                                                Manage Access
                                                            </span>
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {renderPagination()}
                </>
            )}

            {/* ================= PASSWORD & EXPIRATION MODAL ================= */}
            {passwordModal && selectedFile && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-[2px]">
                    <div
                        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-start justify-between border-b border-slate-100 p-5 sm:p-6">
                            <div className="flex items-start gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                    <i className="ri-shield-keyhole-line text-xl" />
                                </div>

                                <div>
                                    <h3 className="font-semibold text-slate-900">
                                        Access & Expiry Settings
                                    </h3>
                                    <p className="mt-1 max-w-xs text-sm text-slate-500">
                                        Update password protection and expiration date.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={closePasswordModal}
                                disabled={savingPassword}
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                            >
                                <i className="ri-close-line text-xl" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form
                            onSubmit={handlePasswordSubmit}
                            className="p-5 sm:p-6"
                        >
                            {/* File Info */}
                            <div className="mb-5 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                                <div
                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${getFileIconBackground(
                                        selectedFile.type
                                    )}`}
                                >
                                    <i
                                        className={`${getFileIcon(
                                            selectedFile.type
                                        )} text-lg`}
                                    />
                                </div>

                                <div className="min-w-0">
                                    <p
                                        className="truncate text-sm font-medium text-slate-800"
                                        title={selectedFile.name}
                                    >
                                        {selectedFile.name}
                                    </p>
                                    <p className="truncate text-xs text-slate-400">
                                        Shared with {selectedFile.receiverEmail}
                                    </p>
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label
                                    htmlFor="shared-file-password"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    New Password
                                </label>

                                <div className="relative">
                                    <i className="ri-lock-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        id="shared-file-password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            setPasswordError("");
                                        }}
                                        placeholder="Enter password"
                                        autoComplete="new-password"
                                        className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                                    />
                                </div>
                                <p className="mt-1.5 text-xs text-slate-400">
                                    Minimum 6 characters.
                                </p>
                            </div>

                            {/* Confirm Password */}
                            <div className="mt-4">
                                <label
                                    htmlFor="shared-file-confirm-password"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Confirm Password
                                </label>

                                <div className="relative">
                                    <i className="ri-shield-check-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        id="shared-file-confirm-password"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value);
                                            setPasswordError("");
                                        }}
                                        placeholder="Confirm password"
                                        autoComplete="new-password"
                                        className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                                    />
                                </div>
                            </div>

                            {/* Expiry Date Selection */}
                            <div className="mt-4">
                                <label
                                    htmlFor="shared-file-expiry"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Expiration Date
                                </label>

                                <div className="relative">
                                    <i className="ri-calendar-event-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        id="shared-file-expiry"
                                        type="date"
                                        value={expiresAt}
                                        min={new Date().toISOString().split("T")[0]}
                                        onChange={(e) => setExpiresAt(e.target.value)}
                                        className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                                    />
                                </div>
                                <p className="mt-1.5 text-xs text-slate-400">
                                    Leave blank for no expiration date.
                                </p>
                            </div>

                            {/* Validation Error */}
                            {passwordError && (
                                <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-sm text-red-600">
                                    <i className="ri-error-warning-line mt-0.5" />
                                    <span>{passwordError}</span>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={closePasswordModal}
                                    disabled={savingPassword}
                                    className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={savingPassword}
                                    className="flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-medium text-white shadow-sm shadow-blue-200 transition-all duration-200 hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {savingPassword ? (
                                        <>
                                            <i className="ri-loader-4-line animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <i className="ri-check-line" />
                                            Save Settings
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}