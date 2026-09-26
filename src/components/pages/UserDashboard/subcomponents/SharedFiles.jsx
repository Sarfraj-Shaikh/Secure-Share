import React, { useEffect, useRef, useState } from "react";
import api from "../../../../../utils/api";

const SharedFiles = () => {

    // ------------------------------------------------------------------------
    // Config
    // ------------------------------------------------------------------------

    const serverUrl = import.meta.env.VITE_SERVER_URL;

    // Your project stores the JWT in localStorage with this key.
    const userToken = localStorage.getItem("userToken");

    // ------------------------------------------------------------------------
    // States
    // ------------------------------------------------------------------------

    const [files, setFiles] = useState([]);
    const [search, setSearch] = useState("");

    const [filter, setFilter] = useState("Latest");
    const [pageNo, setPageNo] = useState(1);
    const [limit, setLimit] = useState(10);

    const [isLoadMore, setIsLoadMore] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const [error, setError] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // ------------------------------------------------------------------------
    // Fetch Shared Files
    // ------------------------------------------------------------------------

    const fetchSharedFiles = async (page, append = false) => {

        try {

            if (!userToken) {
                setError("Authentication token not found.");
                setFiles([]);
                setIsLoadMore(false);
                return;
            }

            if (!serverUrl) {
                setError("VITE_SERVER_URL is not configured.");
                setFiles([]);
                setIsLoadMore(false);
                return;
            }

            if (append) {

                setLoadingMore(true);

            } else {

                setLoading(true);
                setError("");

            }

            const response = await api.get(
                `${serverUrl}/api/share-file?page=${page}&limit=${limit}&filter=${filter}`,
                {
                    headers: {
                        Authorization: userToken,
                    },
                }
            );

            const data = response?.data;

            if (!data?.success) {
                throw new Error(data?.message || "Unable to fetch shared files.");
            }

            const newFiles = Array.isArray(data?.files) ? data.files : [];

            // First page => replace files.
            if (!append) { setFiles(newFiles); }

            // Next pages => preserve old files and append new files.
            if (append) {

                setFiles((previousFiles) => {

                    const existingIds = new Set(
                        previousFiles.map((item) => getFileId(item))
                    );

                    const uniqueNewFiles = newFiles.filter(
                        (item) => !existingIds.has(getFileId(item))
                    );

                    return [...previousFiles, ...uniqueNewFiles];

                });
            }

            setPageNo(data?.currentPage || page);
            setIsLoadMore(Boolean(data?.isLoadMore));

        } catch (err) {

            const errorMessage = err?.response?.data?.message || err?.message || "Something went wrong.";

            setError(errorMessage);

            // Only clear existing files when the first request fails.
            // If Load More fails, already loaded files remain visible.

            if (!append) {
                setFiles([]);
                setIsLoadMore(false);
            }

        } finally {

            setLoading(false);
            setLoadingMore(false);

        }

    };

    // ------------------------------------------------------------------------
    // Initial Fetch + Page / Filter Change
    // ------------------------------------------------------------------------

    useEffect(() => {
        fetchSharedFiles(pageNo, pageNo > 1);
    }, [pageNo, filter]);

    // ------------------------------------------------------------------------
    // Load More
    // ------------------------------------------------------------------------

    const handleLoadMore = () => {

        if (loadingMore || !isLoadMore) {
            return;
        }

        // Do NOT call API here.
        // pageNo change will trigger useEffect and API call.
        setPageNo((previousPage) => previousPage + 1);

    };

    // ------------------------------------------------------------------------
    // Filter
    // ------------------------------------------------------------------------

    const handleFilterChange = (value) => {

        setIsDropdownOpen(false);

        if (value === filter) {
            return;
        }

        // New filter means new pagination.
        setFiles([]);
        setIsLoadMore(false);
        setPageNo(1);
        setFilter(value);

    };

    // ------------------------------------------------------------------------
    // Search
    // ------------------------------------------------------------------------

    const filteredFiles = files.filter((file) => {

        const fileData = file?.fileId || {};
        const fileName = fileData?.fileName || "";

        const receiverEmail =
            file?.receiverEmail ||
            file?.email ||
            file?.receiver?.email ||
            "";

        const mimetype = fileData?.mimetype || "";

        const searchableText = [
            fileName,
            receiverEmail,
            mimetype,
        ]
            .join(" ")
            .toLowerCase();

        return searchableText.includes(
            search.trim().toLowerCase()
        );

    });

    // ------------------------------------------------------------------------
    // Dropdown Outside Click
    // ------------------------------------------------------------------------

    useEffect(() => {

        const handleOutsideClick = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );
        };
    }, []);

    // ------------------------------------------------------------------------
    // UI
    // ------------------------------------------------------------------------

    return (

        <section className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-7xl">

                {/* ============================================================
                    Header
                ============================================================ */}

                <div className="mb-6">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                        Shared Files
                    </h1>

                    <p className="mt-1 text-sm text-slate-500 sm:text-base">
                        Manage and monitor files you have shared.
                    </p>
                </div>

                {/* ============================================================
                    Search + Filter
                ============================================================ */}

                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                    {/* Search */}

                    <div className="relative w-full sm:max-w-md">
                        <i className="ri-search-line pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400" />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Search shared files..."
                            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-11 text-sm text-slate-700 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                        />

                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch("")}
                                className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-slate-700"
                                aria-label="Clear search"
                            >
                                <i className="ri-close-line text-lg" />
                            </button>
                        )}
                    </div>

                    {/* Custom Filter Dropdown */}

                    <div
                        ref={dropdownRef}
                        className="relative w-full sm:w-44"
                    >
                        <button
                            type="button"
                            onClick={() =>
                                setIsDropdownOpen(
                                    (previous) => !previous
                                )
                            }
                            className="flex h-11 w-full cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow focus:outline-none"
                        >
                            <span className="flex items-center gap-2">
                                <i className="ri-filter-3-line text-base text-slate-500" />
                                <span>{filter}</span>
                            </span>

                            <i
                                className={`ri-arrow-down-s-line text-lg text-slate-500 transition-transform duration-200 ${isDropdownOpen
                                    ? "rotate-180"
                                    : ""
                                    }`}
                            />
                        </button>

                        <div
                            className={`absolute right-0 z-50 mt-2 w-full origin-top rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl transition-all duration-200 ${isDropdownOpen
                                ? "visible translate-y-0 scale-100 opacity-100"
                                : "invisible -translate-y-2 scale-95 opacity-0"
                                }`}
                        >
                            {["Latest", "Oldest"].map(
                                (option) => (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() =>
                                            handleFilterChange(
                                                option
                                            )
                                        }
                                        className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-all duration-150 ${filter === option
                                            ? "bg-slate-100 font-semibold text-slate-900"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                            }`}
                                    >
                                        <span className="flex items-center gap-2">
                                            <i
                                                className={
                                                    option ===
                                                        "Latest"
                                                        ? "ri-sort-desc"
                                                        : "ri-sort-asc"
                                                }
                                            />

                                            {option}
                                        </span>

                                        {filter === option && (
                                            <i className="ri-check-line text-base" />
                                        )}
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                </div>

                {/* ============================================================
                    Main Content
                ============================================================ */}

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    {/* Loading */}

                    {loading ? (
                        <LoadingState />
                    ) : error && files.length === 0 ? (
                        <ErrorState
                            message={error}
                            onRetry={() =>
                                fetchSharedFiles(
                                    1,
                                    false
                                )
                            }
                        />
                    ) : files.length === 0 ? (
                        <EmptyState
                            title="No shared files"
                            description="You haven't shared any files yet."
                            icon="ri-folder-shared-line"
                        />
                    ) : filteredFiles.length === 0 ? (
                        <EmptyState
                            title="No files found"
                            description={`No shared files match "${search}".`}
                            icon="ri-search-line"
                        />
                    ) : (
                        <>
                            {/* =================================================
                                Desktop Table
                            ================================================= */}

                            <div className="hidden overflow-x-auto md:block">
                                <table className="w-full min-w-[1100px]">
                                    <thead>
                                        <tr className="border-b border-slate-100 bg-slate-50/80">
                                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                File
                                            </th>

                                            <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                Size
                                            </th>

                                            <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                Receiver
                                            </th>

                                            <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                Shared At
                                            </th>

                                            <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                Password
                                            </th>

                                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                Expiry
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-slate-100">
                                        {filteredFiles.map(
                                            (file) => (
                                                <FileRow
                                                    key={getFileId(
                                                        file
                                                    )}
                                                    file={file}
                                                />
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* =================================================
                                Mobile Cards
                            ================================================= */}

                            <div className="divide-y divide-slate-100 md:hidden">
                                {filteredFiles.map(
                                    (file) => (
                                        <FileCard
                                            key={getFileId(
                                                file
                                            )}
                                            file={file}
                                        />
                                    )
                                )}
                            </div>

                            {/* =================================================
                                Load More
                            ================================================= */}

                            <div className="border-t border-slate-100 p-4 sm:p-5">

                                {isLoadMore ? (
                                    <button
                                        type="button"
                                        onClick={
                                            handleLoadMore
                                        }
                                        disabled={
                                            loadingMore
                                        }
                                        className="mx-auto flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {loadingMore ? (
                                            <>
                                                <Spinner />
                                                Loading...
                                            </>
                                        ) : (
                                            <>
                                                <i className="ri-add-line text-lg" />
                                                Load More
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <p className="text-center text-xs text-slate-400">
                                        You've reached the end
                                        of your shared files.
                                    </p>
                                )}

                                {/* Load More Error */}

                                {error && files.length > 0 && (
                                    <div className="mt-3 flex items-center justify-center gap-2 text-xs text-red-500">
                                        <i className="ri-error-warning-line" />
                                        <span>
                                            {error}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                fetchSharedFiles(
                                                    pageNo +
                                                    1,
                                                    true
                                                )
                                            }
                                            className="cursor-pointer font-semibold underline"
                                        >
                                            Retry
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

/* ============================================================================
   File Row
============================================================================ */

const FileRow = ({ file }) => {
    const fileData = file?.fileId || {};

    const fileName =
        fileData?.fileName || "Unnamed file";

    const extension = getExtension(fileName);

    const receiverEmail =
        file?.receiverEmail ||
        file?.email ||
        file?.receiver?.email ||
        "Not available";

    return (
        <tr className="group transition-colors duration-200 hover:bg-slate-50/70">

            {/* File */}

            <td className="px-6 py-4">
                <div className="flex min-w-0 items-center gap-3">
                    <FileIcon
                        extension={extension}
                    />

                    <div className="min-w-0">
                        <p
                            className="max-w-[280px] truncate text-sm font-semibold text-slate-800"
                            title={fileName}
                        >
                            {fileName}
                        </p>

                        <p className="mt-0.5 text-xs uppercase text-slate-400">
                            {extension || "FILE"}
                        </p>
                    </div>
                </div>
            </td>

            {/* Size */}

            <td className="px-4 py-4 text-sm text-slate-600">
                {formatFileSize(
                    fileData?.fileSize
                )}
            </td>

            {/* Receiver */}

            <td className="px-4 py-4">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                        <i className="ri-mail-line text-sm" />
                    </div>

                    <span
                        className="max-w-[220px] truncate text-sm text-slate-600"
                        title={receiverEmail}
                    >
                        {receiverEmail}
                    </span>
                </div>
            </td>

            {/* Shared At */}

            <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">
                {formatDate(
                    file?.createdAt ||
                    file?.sharedAt
                )}
            </td>

            {/* Password */}

            <td className="px-4 py-4">
                <PasswordBadge
                    password={
                        fileData?.password
                    }
                />
            </td>

            {/* Expiry */}

            <td className="whitespace-nowrap px-6 py-4">
                <ExpiryBadge
                    expiresAt={
                        fileData?.expiresAt
                    }
                />
            </td>
        </tr>
    );
};

/* ============================================================================
   Mobile File Card
============================================================================ */

const FileCard = ({ file }) => {
    const fileData = file?.fileId || {};

    const fileName =
        fileData?.fileName || "Unnamed file";

    const extension = getExtension(fileName);

    const receiverEmail =
        file?.receiverEmail ||
        file?.email ||
        file?.receiver?.email ||
        "Not available";

    return (
        <div className="p-4 transition-colors duration-200 hover:bg-slate-50 sm:p-5">

            {/* File Header */}

            <div className="flex items-start gap-3">
                <FileIcon
                    extension={extension}
                />

                <div className="min-w-0 flex-1">
                    <p
                        className="truncate text-sm font-semibold text-slate-800"
                        title={fileName}
                    >
                        {fileName}
                    </p>

                    <p className="mt-0.5 text-xs uppercase text-slate-400">
                        {extension || "FILE"}
                    </p>
                </div>
            </div>

            {/* File Details */}

            <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-5">

                <InfoItem
                    icon="ri-hard-drive-2-line"
                    label="Size"
                    value={formatFileSize(
                        fileData?.fileSize
                    )}
                />

                <InfoItem
                    icon="ri-time-line"
                    label="Shared At"
                    value={formatDate(
                        file?.createdAt ||
                        file?.sharedAt
                    )}
                />

                <InfoItem
                    icon="ri-mail-line"
                    label="Receiver"
                    value={receiverEmail}
                    full
                />

                <InfoItem
                    icon="ri-lock-line"
                    label="Password"
                    value={fileData?.password !== null ? "Protected" : "No Password"}
                />

                <InfoItem
                    icon="ri-calendar-close-line"
                    label="Expiry"
                    value={formatDate(
                        fileData?.expiresAt
                    )}
                />
            </div>
        </div>
    );
};

/* ============================================================================
   File Icon
============================================================================ */

const FileIcon = ({ extension }) => {
    const ext = extension?.toLowerCase();

    let icon = "ri-file-line";

    if (
        [
            "jpg",
            "jpeg",
            "png",
            "gif",
            "webp",
            "svg",
        ].includes(ext)
    ) {
        icon = "ri-image-line";
    } else if (
        [
            "mp4",
            "mkv",
            "mov",
            "avi",
            "webm",
        ].includes(ext)
    ) {
        icon = "ri-video-line";
    } else if (
        [
            "mp3",
            "wav",
            "ogg",
            "m4a",
        ].includes(ext)
    ) {
        icon = "ri-music-2-line";
    } else if (ext === "pdf") {
        icon = "ri-file-pdf-2-line";
    } else if (
        ["doc", "docx"].includes(ext)
    ) {
        icon = "ri-file-word-2-line";
    } else if (
        ["xls", "xlsx", "csv"].includes(ext)
    ) {
        icon = "ri-file-excel-2-line";
    } else if (
        ["zip", "rar", "7z", "tar", "gz"].includes(
            ext
        )
    ) {
        icon = "ri-file-zip-line";
    } else if (
        ["ppt", "pptx"].includes(ext)
    ) {
        icon = "ri-file-ppt-2-line";
    } else if (
        ["txt", "md"].includes(ext)
    ) {
        icon = "ri-file-text-line";
    }

    return (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-all duration-200 group-hover:bg-slate-200">
            <i
                className={`${icon} text-xl`}
            />
        </div>
    );
};

/* ============================================================================
   Password Badge
============================================================================ */

const PasswordBadge = ({ password }) => {

    if (!password) {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                <i className="ri-lock-unlock-line" />
                No Password
            </span>
        );
    }

    if (password === null || password === "") {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                <i className="ri-lock-unlock-line" />
                No Password
            </span>
        );
    }

    return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
            <i className="ri-lock-line" />
            Protected
        </span>
    );

};

/* ============================================================================
   Expiry Badge
============================================================================ */

const ExpiryBadge = ({ expiresAt }) => {
    if (!expiresAt) {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                <i className="ri-infinity-line" />
                No expiry
            </span>
        );
    }

    const expiryDate = new Date(
        expiresAt
    );

    if (
        Number.isNaN(
            expiryDate.getTime()
        )
    ) {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                <i className="ri-question-line" />
                Invalid date
            </span>
        );
    }

    const expired =
        expiryDate.getTime() < Date.now();

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${expired
                ? "bg-red-50 text-red-600"
                : "bg-emerald-50 text-emerald-600"
                }`}
        >
            <i
                className={
                    expired
                        ? "ri-error-warning-line"
                        : "ri-calendar-check-line"
                }
            />

            {expired
                ? "Expired"
                : formatDate(expiresAt)}
        </span>
    );
};

/* ============================================================================
   Info Item
============================================================================ */

const InfoItem = ({
    icon,
    label,
    value,
    full = false,
}) => {
    return (
        <div
            className={
                full ? "col-span-2" : ""
            }
        >
            <p className="mb-1 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-400">
                <i className={icon} />
                {label}
            </p>

            <p
                className="truncate text-sm text-slate-600"
                title={value}
            >
                {value}
            </p>
        </div>
    );
};

/* ============================================================================
   Loading
============================================================================ */

const LoadingState = () => {
    return (
        <div className="divide-y divide-slate-100">
            {[1, 2, 3, 4].map(
                (item) => (
                    <div
                        key={item}
                        className="flex animate-pulse items-center gap-4 px-6 py-5"
                    >
                        <div className="h-11 w-11 shrink-0 rounded-xl bg-slate-100" />

                        <div className="flex-1">
                            <div className="h-3.5 w-48 rounded bg-slate-100" />

                            <div className="mt-2 h-3 w-24 rounded bg-slate-100" />
                        </div>

                        <div className="hidden h-3 w-20 rounded bg-slate-100 md:block" />

                        <div className="hidden h-3 w-40 rounded bg-slate-100 md:block" />
                    </div>
                )
            )}
        </div>
    );
};

/* ============================================================================
   Empty State
============================================================================ */

const EmptyState = ({ title, description, icon, }) => {

    return (
        <div className="flex min-h-[350px] flex-col items-center justify-center px-6 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <i
                    className={`${icon} text-3xl`}
                />
            </div>

            <h3 className="text-base font-semibold text-slate-800">
                {title}
            </h3>

            <p className="mt-1 max-w-sm text-sm text-slate-500">
                {description}
            </p>
        </div>
    );
};

/* ============================================================================
   Error State
============================================================================ */

const ErrorState = ({ message, onRetry, }) => {
    
    return (
        <div className="flex min-h-[350px] flex-col items-center justify-center px-6 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                <i className="ri-error-warning-line text-3xl" />
            </div>

            <h3 className="text-base font-semibold text-slate-800">
                Data unavailable
            </h3>

            <p className="mt-1 max-w-md text-sm text-slate-500">
                {message ||
                    "We couldn't load your shared files."}
            </p>

            <button
                type="button"
                onClick={onRetry}
                className="mt-5 flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-medium text-white transition-all duration-200 hover:bg-slate-800 hover:shadow-md active:scale-95"
            >
                <i className="ri-refresh-line" />
                Try Again
            </button>
        </div>
    );
};

/* ============================================================================
   Spinner
============================================================================ */

const Spinner = () => {
    return (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
    );
};

/* ============================================================================
   Helpers
============================================================================ */

function getFileId(file) {
    return (
        file?._id ||
        file?.id ||
        `${file?.fileId?._id || file?.fileId?.fileName}-${file?.createdAt || ""}`
    );
}

function getExtension(fileName = "") {
    const cleanName =
        fileName.split("?")[0];

    const parts =
        cleanName.split(".");

    if (parts.length <= 1) {
        return "";
    }

    return parts
        .pop()
        .toUpperCase();
}

function formatFileSize(bytes) {
    if (
        bytes === undefined ||
        bytes === null ||
        bytes === ""
    ) {
        return "N/A";
    }

    const size = Number(bytes);

    if (Number.isNaN(size)) {
        return "N/A";
    }

    if (size === 0) {
        return "0 Bytes";
    }

    const units = [
        "Bytes",
        "KB",
        "MB",
        "GB",
        "TB",
    ];

    const index = Math.floor(
        Math.log(size) /
        Math.log(1024)
    );

    return `${parseFloat(
        (
            size /
            Math.pow(1024, index)
        ).toFixed(
            index === 0 ? 0 : 2
        )
    )} ${units[index] || "TB"}`;
}

function formatDate(date) {
    if (!date) {
        return "Not available";
    }

    const parsedDate =
        new Date(date);

    if (
        Number.isNaN(
            parsedDate.getTime()
        )
    ) {
        return "Not available";
    }

    return parsedDate.toLocaleString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }
    );
}

export default SharedFiles;
