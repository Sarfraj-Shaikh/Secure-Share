import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

import { verifyToken } from "../../../../../utils/isUserLogin";
import SpinLoader from "../../../shared/SpinLoader";
import api from "../../../../../utils/api";

const FOLDER_API_URL = "/api/fav-folders";

const folderColorList = [
    {
        name: "Default",
        key: "default",
        hex: "#62748E",
        bg: "bg-slate-100",
        text: "text-slate-600",
    },
    {
        name: "Blue",
        key: "blue",
        hex: "#2B7FFF",
        bg: "bg-blue-50",
        text: "text-blue-600",
    },
    {
        name: "Rose",
        key: "rose",
        hex: "#FF2056",
        bg: "bg-rose-50",
        text: "text-rose-600",
    },
    {
        name: "Green",
        key: "green",
        hex: "#00BC7D",
        bg: "bg-emerald-50",
        text: "text-emerald-600",
    },
    {
        name: "Purple",
        key: "purple",
        hex: "#AD46FF",
        bg: "bg-purple-50",
        text: "text-purple-600",
    },
    {
        name: "Pink",
        key: "pink",
        hex: "#F6339A",
        bg: "bg-pink-50",
        text: "text-pink-600",
    },
];

const sortOptions = [
    {
        value: "latest",
        label: "Latest",
        icon: "ri-sort-desc",
    },
    {
        value: "oldest",
        label: "Oldest",
        icon: "ri-sort-asc",
    },
];

const getAuthConfig = () => {

    const token = localStorage.getItem("userToken");

    return {
        headers: {
            Authorization: token || "",
        },
    };
};

const getFolderColor = (colorName) => {

    return (folderColorList.find((item) => item.name.toLowerCase() === colorName?.toLowerCase()) || folderColorList[0]);

};

const formatDate = (date) => {

    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "-";
    }

    return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(parsedDate);
};

const Favourites = () => {

    const navigate = useNavigate();

    const [messageApi, contextHolder] = message.useMessage();

    const [checkingAuth, setCheckingAuth] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    const [folders, setFolders] = useState([]);

    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("latest");
    const [sortOpen, setSortOpen] = useState(false);

    const [pageNo, setPageNo] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalDocs, setTotalDocs] = useState(0);

    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const [menuFolderId, setMenuFolderId] = useState(null);

    const [modal, setModal] = useState({
        type: null,
        folder: null,
    });

    const [folderName, setFolderName] = useState("");
    const [folderColor, setFolderColor] = useState(
        folderColorList[0]
    );

    const [formErrors, setFormErrors] = useState({
        name: "",
        color: "",
    });

    // --------------------------------------------------
    // Authentication
    // --------------------------------------------------

    useEffect(() => {

        let mounted = true;

        const checkAuth = async () => {
            try {
                const result = await verifyToken(navigate, {
                    requireAuth: true,
                    requireVerified: true,
                    allowedRoles: ["user"],
                });

                if (mounted && result?.success) {
                    setAuthenticated(true);
                }
            } finally {
                if (mounted) {
                    setCheckingAuth(false);
                }
            }
        };

        checkAuth();

        return () => {
            mounted = false;
        };
    }, [navigate]);

    // --------------------------------------------------
    // Fetch
    // --------------------------------------------------

    const handleFetch = useCallback(async () => {

        try {

            setLoading(true);

            const response = await api.get(
                `${FOLDER_API_URL}?page=${pageNo}`,
                getAuthConfig()
            );

            const data = response?.data;

            setFolders(data?.folders || []);
            setTotalPages(Number(data?.totalPages) || 0);
            setTotalDocs(Number(data?.totalDocs) || 0);

        } catch (error) {

            console.error("Fetch folders error:", error);

            messageApi.error(
                error?.response?.data?.message ||
                error?.message ||
                "Unable to fetch folders."
            );

            setFolders([]);

        } finally {

            setLoading(false);

        }

    }, [pageNo, messageApi]);

    useEffect(() => {

        handleFetch();

    }, [authenticated, handleFetch]);

    // --------------------------------------------------
    // Search + Sort
    // --------------------------------------------------

    const displayedFolders = useMemo(() => {

        const query = search.trim().toLowerCase();

        const result = folders.filter((folder) =>
            folder?.name?.toLowerCase().includes(query)
        );

        return [...result].sort((a, b) => {
            const firstDate = new Date(a?.createdAt || 0);
            const secondDate = new Date(b?.createdAt || 0);

            return sortBy === "latest"
                ? secondDate - firstDate
                : firstDate - secondDate;
        });
    }, [folders, search, sortBy]);

    // --------------------------------------------------
    // Pagination
    // --------------------------------------------------

    const paginationItems = useMemo(() => {
        const maxVisiblePages = 7;

        if (totalPages <= maxVisiblePages) {
            return Array.from(
                { length: totalPages },
                (_, index) => index + 1
            );
        }

        let startPage = Math.max(
            1,
            pageNo - Math.floor(maxVisiblePages / 2)
        );

        let endPage = startPage + maxVisiblePages - 1;

        if (endPage > totalPages) {
            endPage = totalPages;
            startPage =
                totalPages - maxVisiblePages + 1;
        }

        const pages = [];

        if (startPage > 1) {
            pages.push(1);

            if (startPage > 2) {
                pages.push("left-dots");
            }
        }

        for (
            let page = startPage;
            page <= endPage;
            page++
        ) {
            pages.push(page);
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push("right-dots");
            }

            pages.push(totalPages);
        }

        return pages;
    }, [pageNo, totalPages]);

    const handlePageChange = (page) => {
        if (
            loading ||
            page === pageNo ||
            page < 1 ||
            page > totalPages
        ) {
            return;
        }

        setPageNo(page);
        setMenuFolderId(null);
        setSortOpen(false);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // --------------------------------------------------
    // Folder Navigation
    // --------------------------------------------------

    const handleFolderOpen = (folderId) => {
        if (!folderId) return;

        navigate(`/user/my-files/${folderId}`);
    };

    // --------------------------------------------------
    // Modal Helpers
    // --------------------------------------------------

    const resetForm = () => {
        setFolderName("");
        setFolderColor(folderColorList[0]);

        setFormErrors({
            name: "",
            color: "",
        });
    };

    const openCreateModal = () => {
        if (actionLoading) return;

        resetForm();

        setMenuFolderId(null);

        setModal({
            type: "create",
            folder: null,
        });
    };

    const openEditModal = (folder) => {
        if (actionLoading) return;

        const selectedColor =
            getFolderColor(folder?.color);

        setFolderName(folder?.name || "");
        setFolderColor(selectedColor);

        setFormErrors({
            name: "",
            color: "",
        });

        setMenuFolderId(null);

        setModal({
            type: "edit",
            folder,
        });
    };

    const openDeleteModal = (folder) => {
        if (actionLoading) return;

        setMenuFolderId(null);

        setModal({
            type: "delete",
            folder,
        });
    };

    const closeModal = () => {
        if (actionLoading) return;

        setModal({
            type: null,
            folder: null,
        });

        resetForm();
    };

    // --------------------------------------------------
    // Validation
    // --------------------------------------------------

    const validateFolderForm = () => {
        const errors = {
            name: "",
            color: "",
        };

        const name = folderName.trim();

        if (!name) {
            errors.name = "Folder name is required.";
        } else if (name.length < 2) {
            errors.name =
                "Folder name must contain at least 2 characters.";
        } else if (name.length > 50) {
            errors.name =
                "Folder name cannot exceed 50 characters.";
        } else if (
            !/^[a-zA-Z0-9][a-zA-Z0-9 _-]*$/.test(name)
        ) {
            errors.name =
                "Only letters, numbers, spaces, hyphens and underscores are allowed.";
        }

        if (!folderColor?.name) {
            errors.color = "Please select a folder color.";
        }

        setFormErrors(errors);

        return !errors.name && !errors.color;
    };

    const handleFolderNameChange = (e) => {
        const value = e.target.value;

        setFolderName(value);

        if (formErrors.name) {
            setFormErrors((prev) => ({
                ...prev,
                name: "",
            }));
        }
    };

    const handleColorChange = (color) => {
        setFolderColor(color);

        if (formErrors.color) {
            setFormErrors((prev) => ({
                ...prev,
                color: "",
            }));
        }
    };

    // --------------------------------------------------
    // Create / Update
    // --------------------------------------------------

    const handleCreateOrUpdate = async () => {

        if (actionLoading) return;

        if (!validateFolderForm()) {
            messageApi.warning(
                "Please fix the highlighted fields."
            );
            return;
        }

        const isEdit = modal.type === "edit";

        try {

            setActionLoading(true);

            const url = isEdit ? `${FOLDER_API_URL}/${modal.folder?._id}` : FOLDER_API_URL;

            const response = await api({
                method: isEdit ? "PUT" : "POST",
                url,
                ...getAuthConfig(),
                data: { name: folderName.trim(), color: folderColor.name, },
            });

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong.");
            };

            messageApi.success(
                isEdit
                    ? "Folder updated successfully."
                    : "Folder created successfully."
            );

            closeModal();

            await handleFetch();

        } catch (error) {
            console.error(
                "Create/Update folder error:",
                error
            );

            messageApi.error(
                error?.response?.data?.message ||
                error?.message ||
                "Unable to complete the request."
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleFav = async (folder) => {

        try {

            const favStatus = !folder?.isFavorite;

            setActionLoading(true);

            const url = `${FOLDER_API_URL}/${folder?._id}`

            const response = await api({
                method: "PUT",
                url,
                ...getAuthConfig(),
                data: { isFavorite: favStatus, },
            });

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong.");
            };

            messageApi.success("Folder updated successfully.");

            setMenuFolderId(null);

            await handleFetch();

        } catch (err) {

            console.error("Add to favorite error:", err);

            messageApi.error(err?.response?.data?.message || err?.message || "Unable to complete the request.");

        } finally {

            setActionLoading(false);

        }

    };

    // --------------------------------------------------
    // Delete
    // --------------------------------------------------

    const handleDelete = async () => {

        const folderId = modal.folder?._id;

        if (!folderId || actionLoading) {
            return;
        }

        try {
            setActionLoading(true);

            const response = await api.delete(
                `${FOLDER_API_URL}/${folderId}`,
                getAuthConfig()
            );

            if (!response?.data?.success) {
                throw new Error(
                    response?.data?.message ||
                    "Failed to delete folder."
                );
            }

            messageApi.success(
                "Folder deleted successfully."
            );

            setModal({
                type: null,
                folder: null,
            });

            resetForm();

            // Current page becomes empty after delete.
            if (folders.length === 1 && pageNo > 1) {
                setPageNo((prev) => prev - 1);
            } else {
                await handleFetch();
            }
        } catch (error) {
            console.error(
                "Delete folder error:",
                error
            );

            messageApi.error(
                error?.response?.data?.message ||
                error?.message ||
                "Unable to delete folder."
            );
        } finally {
            setActionLoading(false);
        }
    };

    // --------------------------------------------------
    // Loading
    // --------------------------------------------------

    if (checkingAuth) {
        return <SpinLoader />;
    }

    if (!authenticated) {
        return null;
    }

    return (
        <>
            {contextHolder}

            <main
                className="min-h-dvh bg-slate-50 px-3 pb-8 pt-[90px] sm:px-5 lg:px-[5%]"
                onClick={() => {
                    setMenuFolderId(null);
                    setSortOpen(false);
                }}
            >
                <section className="mx-auto max-w-7xl">

                    {/* Header */}
                    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                Favourites
                            </h1>

                            <p className="mt-1 text-sm text-slate-500">
                                Organize and manage all your favourites folders in one place.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                openCreateModal();
                            }}
                            disabled={actionLoading}
                            className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-blue-600/30 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                        >
                            <i className="ri-add-line text-lg" />
                            Create Folder
                        </button>
                    </div>

                    {/* Toolbar */}
                    <div
                        className="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Search */}
                        <div className="relative flex-1">
                            <i className="ri-search-line pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400" />

                            <input
                                type="text"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPageNo(1);
                                }}
                                placeholder="Search folders..."
                                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-11 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                            />

                            {search && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearch("");
                                        setPageNo(1);
                                    }}
                                    className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-200 hover:text-slate-600"
                                >
                                    <i className="ri-close-line" />
                                </button>
                            )}
                        </div>

                        {/* Sort */}
                        <div className="relative sm:w-48">
                            <button
                                type="button"
                                onClick={() =>
                                    setSortOpen((prev) => !prev)
                                }
                                className="flex h-11 w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50/50"
                            >
                                <span className="flex items-center gap-2">
                                    <i
                                        className={`${sortOptions.find(
                                            (item) =>
                                                item.value === sortBy
                                        )?.icon ||
                                            "ri-sort-desc"
                                            } text-lg text-blue-600`}
                                    />

                                    {
                                        sortOptions.find(
                                            (item) =>
                                                item.value === sortBy
                                        )?.label
                                    }
                                </span>

                                <i
                                    className={`ri-arrow-down-s-line text-lg transition-transform ${sortOpen
                                        ? "rotate-180"
                                        : ""
                                        }`}
                                />
                            </button>

                            {sortOpen && (
                                <div className="absolute right-0 z-40 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10">
                                    {sortOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => {
                                                setSortBy(
                                                    option.value
                                                );
                                                setSortOpen(false);
                                            }}
                                            className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition ${sortBy === option.value
                                                ? "bg-blue-50 font-semibold text-blue-600"
                                                : "text-slate-600 hover:bg-slate-50"
                                                }`}
                                        >
                                            <span className="flex items-center gap-2">
                                                <i
                                                    className={`${option.icon} text-base`}
                                                />
                                                {option.label}
                                            </span>

                                            {sortBy === option.value && (
                                                <i className="ri-check-line text-lg" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Summary */}
                    {!loading && (
                        <div className="mb-4 flex items-center justify-between">
                            <p className="text-xs text-slate-500">
                                {search
                                    ? `${displayedFolders.length} result${displayedFolders.length !== 1
                                        ? "s"
                                        : ""
                                    }`
                                    : `${totalDocs} folder${totalDocs !== 1
                                        ? "s"
                                        : ""
                                    }`}
                            </p>

                            {totalPages > 1 && !search && (
                                <p className="text-xs text-slate-400">
                                    Page {pageNo} of {totalPages}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Content */}
                    {loading ? (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {Array.from({ length: 8 }).map(
                                (_, index) => (
                                    <div
                                        key={index}
                                        className="h-[245px] animate-pulse rounded-2xl border border-slate-200 bg-white"
                                    />
                                )
                            )}
                        </div>
                    ) : displayedFolders.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {displayedFolders.map((folder) => {
                                const color = getFolderColor(
                                    folder?.color
                                );

                                return (
                                    <article
                                        key={folder?._id}
                                        onClick={() =>
                                            handleFolderOpen(
                                                folder?._id
                                            )
                                        }
                                        className="group relative cursor-pointer overflow-visible rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5"
                                    >
                                        {/* Card Top */}
                                        <div className="flex items-start justify-between gap-3">
                                            <div
                                                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${color.bg} ${color.text} transition-transform duration-300 group-hover:scale-105`}
                                            >
                                                <i className="ri-folder-5-fill text-2xl" />
                                            </div>

                                            <div className="relative">
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();

                                                        setMenuFolderId(
                                                            (prev) =>
                                                                prev ===
                                                                    folder?._id
                                                                    ? null
                                                                    : folder?._id
                                                        );
                                                    }}
                                                    className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 ${menuFolderId ===
                                                        folder?._id
                                                        ? "bg-slate-100 text-slate-700"
                                                        : ""
                                                        }`}
                                                    aria-label="Folder actions"
                                                >
                                                    <i className="ri-more-2-fill" />
                                                </button>

                                                {menuFolderId ===
                                                    folder?._id && (
                                                        <div
                                                            onClick={(e) =>
                                                                e.stopPropagation()
                                                            }
                                                            className="absolute right-0 top-10 z-40 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10"
                                                        >
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    openEditModal(
                                                                        folder
                                                                    )
                                                                }
                                                                className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
                                                            >
                                                                <i className="ri-edit-line text-base" />
                                                                Edit
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() => { handleFav(folder); }}
                                                                className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-600 transition hover:bg-amber-50 hover:text-amber-600"
                                                            >
                                                                <i className="ri-star-line text-base" />
                                                                {folder?.isFavorite
                                                                    ? "Remove From Favorites"
                                                                    : "Add to Favorites"
                                                                }
                                                            </button>

                                                            <div className="my-1 border-t border-slate-100" />

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    openDeleteModal(
                                                                        folder
                                                                    )
                                                                }
                                                                className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-red-500 transition hover:bg-red-50"
                                                            >
                                                                <i className="ri-delete-bin-line text-base" />
                                                                Delete
                                                            </button>

                                                            <div className="my-1 border-t border-slate-100" />

                                                            <div className="px-3 py-2">
                                                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                                    Details
                                                                </p>

                                                                <div className="mt-1.5 space-y-1 text-[11px] text-slate-400">
                                                                    <p>
                                                                        Created:{" "}
                                                                        <span className="text-slate-500">
                                                                            {formatDate(
                                                                                folder?.createdAt
                                                                            )}
                                                                        </span>
                                                                    </p>

                                                                    <p>
                                                                        Updated:{" "}
                                                                        <span className="text-slate-500">
                                                                            {formatDate(
                                                                                folder?.updatedAt
                                                                            )}
                                                                        </span>
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                            </div>
                                        </div>

                                        {/* Name */}
                                        <div className="mt-4">
                                            <div className="flex items-center gap-2">
                                                <h2 className="min-w-0 truncate text-base font-bold capitalize text-slate-800">
                                                    {folder?.name}
                                                </h2>

                                                {folder?.isFavorite && (
                                                    <i className="ri-star-fill shrink-0 text-sm text-amber-500" />
                                                )}
                                            </div>

                                            <p className="mt-1 text-xs text-slate-400">
                                                Updated{" "}
                                                {formatDate(
                                                    folder?.updatedAt
                                                )}
                                            </p>
                                        </div>

                                        {/* Files */}
                                        <div className="mt-5 flex items-center justify-between">
                                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                                <i className="ri-file-3-line text-sm text-slate-400" />

                                                {folder?.totalFiles || 0}{" "}
                                                {folder?.totalFiles === 1
                                                    ? "file"
                                                    : "files"}
                                            </span>
                                        </div>

                                        <div className="my-4 border-t border-slate-100" />

                                        {/* Footer */}
                                        <div className="flex items-center justify-between gap-3">
                                            <div>
                                                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                                    Created
                                                </p>

                                                <p className="mt-1 text-xs font-medium text-slate-600">
                                                    {formatDate(
                                                        folder?.createdAt
                                                    )}
                                                </p>
                                            </div>

                                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-400 transition group-hover:bg-blue-50 group-hover:text-blue-600">
                                                <i className="ri-arrow-right-up-line text-lg" />
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex min-h-[340px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-center">
                            <div
                                className={`flex h-16 w-16 items-center justify-center rounded-2xl ${search
                                    ? "bg-slate-100 text-slate-400"
                                    : "bg-blue-50 text-blue-500"
                                    }`}
                            >
                                <i
                                    className={`${search
                                        ? "ri-search-eye-line"
                                        : "ri-folder-open-line"
                                        } text-3xl`}
                                />
                            </div>

                            <h3 className="mt-4 text-base font-bold text-slate-800">
                                {search
                                    ? "No folders found"
                                    : "No folders available"}
                            </h3>

                            <p className="mt-1 max-w-sm text-sm leading-6 text-slate-400">
                                {search
                                    ? `We couldn't find any folder matching "${search}".`
                                    : "Create your first folder to start organizing your files."}
                            </p>

                            {search ? (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearch("");
                                        setPageNo(1);
                                    }}
                                    className="mt-4 cursor-pointer text-sm font-semibold text-blue-600 hover:text-blue-700"
                                >
                                    Clear search
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={openCreateModal}
                                    className="mt-5 inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700"
                                >
                                    <i className="ri-add-line text-lg" />
                                    Create Folder
                                </button>
                            )}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && !search && (
                        <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5">
                            <button
                                type="button"
                                disabled={
                                    loading || pageNo === 1
                                }
                                onClick={() =>
                                    handlePageChange(
                                        pageNo - 1
                                    )
                                }
                                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <i className="ri-arrow-left-s-line text-lg" />
                            </button>

                            {paginationItems.map((item) => {
                                if (
                                    item === "left-dots" ||
                                    item === "right-dots"
                                ) {
                                    return (
                                        <span
                                            key={item}
                                            className="flex h-9 w-7 items-center justify-center text-sm text-slate-400"
                                        >
                                            ...
                                        </span>
                                    );
                                }

                                const active =
                                    pageNo === item;

                                return (
                                    <button
                                        key={item}
                                        type="button"
                                        disabled={loading}
                                        onClick={() =>
                                            handlePageChange(
                                                item
                                            )
                                        }
                                        className={`flex h-9 min-w-9 cursor-pointer items-center justify-center rounded-lg px-2 text-xs font-semibold transition ${active
                                            ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                                            : "border border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                                            } disabled:cursor-not-allowed disabled:opacity-50`}
                                    >
                                        {active && loading ? (
                                            <i className="ri-loader-4-line animate-spin text-base" />
                                        ) : (
                                            item
                                        )}
                                    </button>
                                );
                            })}

                            <button
                                type="button"
                                disabled={
                                    loading ||
                                    pageNo === totalPages
                                }
                                onClick={() =>
                                    handlePageChange(
                                        pageNo + 1
                                    )
                                }
                                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <i className="ri-arrow-right-s-line text-lg" />
                            </button>
                        </div>
                    )}
                </section>
            </main>

            {/* Create / Edit Modal */}
            {(modal.type === "create" ||
                modal.type === "edit") && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-6 backdrop-blur-sm"
                        onMouseDown={(e) => {
                            if (
                                e.target === e.currentTarget &&
                                !actionLoading
                            ) {
                                closeModal();
                            }
                        }}
                    >
                        <div className="max-h-[calc(100dvh-48px)] w-full max-w-md overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
                            {/* Header */}
                            <div className="flex items-start justify-between border-b border-slate-100 px-5 py-5">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                            <i
                                                className={`${modal.type ===
                                                    "edit"
                                                    ? "ri-edit-box-line"
                                                    : "ri-folder-add-line"
                                                    } text-xl`}
                                            />
                                        </div>

                                        <div>
                                            <h2 className="text-lg font-bold text-slate-900">
                                                {modal.type === "edit"
                                                    ? "Edit Folder"
                                                    : "Create Folder"}
                                            </h2>

                                            <p className="mt-0.5 text-xs text-slate-400">
                                                {modal.type === "edit"
                                                    ? "Update your folder details."
                                                    : "Create a new folder for your files."}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    disabled={actionLoading}
                                    onClick={closeModal}
                                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <i className="ri-close-line" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="space-y-5 p-5">
                                {/* Name */}
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Folder name
                                    </label>

                                    <div className="relative">
                                        <i className="ri-folder-line pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-slate-400" />

                                        <input
                                            autoFocus
                                            type="text"
                                            value={folderName}
                                            maxLength={50}
                                            disabled={actionLoading}
                                            onChange={
                                                handleFolderNameChange
                                            }
                                            onKeyDown={(e) => {
                                                if (
                                                    e.key ===
                                                    "Enter" &&
                                                    !actionLoading
                                                ) {
                                                    handleCreateOrUpdate();
                                                }
                                            }}
                                            placeholder="e.g. Project Documents"
                                            className={`h-11 w-full rounded-xl border bg-slate-50 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${formErrors.name
                                                ? "border-red-300 focus:border-red-400 focus:ring-red-500/10"
                                                : "border-slate-200 focus:border-blue-400 focus:ring-blue-500/10"
                                                }`}
                                        />
                                    </div>

                                    <div className="mt-1.5 flex items-center justify-between gap-3">
                                        {formErrors.name ? (
                                            <p className="text-xs text-red-500">
                                                <i className="ri-error-warning-line mr-1" />
                                                {formErrors.name}
                                            </p>
                                        ) : (
                                            <p className="text-xs text-slate-400">
                                                2-50 characters
                                            </p>
                                        )}

                                        <span className="shrink-0 text-[11px] text-slate-400">
                                            {folderName.length}/50
                                        </span>
                                    </div>
                                </div>

                                {/* Color */}
                                <div>
                                    <label className="mb-3 block text-sm font-semibold text-slate-700">
                                        Folder color
                                    </label>

                                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                                        {folderColorList.map(
                                            (color) => {
                                                const selected =
                                                    folderColor.key ===
                                                    color.key;

                                                return (
                                                    <button
                                                        key={color.key}
                                                        type="button"
                                                        disabled={
                                                            actionLoading
                                                        }
                                                        onClick={() =>
                                                            handleColorChange(
                                                                color
                                                            )
                                                        }
                                                        className={`group flex cursor-pointer flex-col items-center gap-2 rounded-xl border p-2.5 transition-all ${selected
                                                            ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500/10"
                                                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                                            }`}
                                                    >
                                                        <span
                                                            className="flex h-9 w-9 items-center justify-center rounded-lg"
                                                            style={{
                                                                backgroundColor: `${color.hex}15`,
                                                                color: color.hex,
                                                            }}
                                                        >
                                                            <i className="ri-folder-5-fill text-lg" />
                                                        </span>

                                                        <span className="text-[10px] font-semibold text-slate-600">
                                                            {
                                                                color.name
                                                            }
                                                        </span>
                                                    </button>
                                                );
                                            }
                                        )}
                                    </div>

                                    {formErrors.color && (
                                        <p className="mt-1.5 text-xs text-red-500">
                                            <i className="ri-error-warning-line mr-1" />
                                            {formErrors.color}
                                        </p>
                                    )}
                                </div>

                                {/* Preview */}
                                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                                    <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        Preview
                                    </p>

                                    <div className="flex items-center gap-3">
                                        <div
                                            className="flex h-11 w-11 items-center justify-center rounded-xl"
                                            style={{
                                                backgroundColor: `${folderColor.hex}15`,
                                                color: folderColor.hex,
                                            }}
                                        >
                                            <i className="ri-folder-5-fill text-xl" />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-bold text-slate-800">
                                                {folderName.trim() ||
                                                    "Folder Name"}
                                            </p>

                                            <p className="mt-0.5 text-xs text-slate-400">
                                                {modal.type ===
                                                    "edit" &&
                                                    modal.folder?.totalFiles
                                                    ? `${modal.folder.totalFiles} files`
                                                    : "0 files"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex gap-2 border-t border-slate-100 bg-slate-50/70 p-4">
                                <button
                                    type="button"
                                    disabled={actionLoading}
                                    onClick={closeModal}
                                    className="h-10 flex-1 cursor-pointer rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    disabled={
                                        actionLoading ||
                                        !folderName.trim()
                                    }
                                    onClick={
                                        handleCreateOrUpdate
                                    }
                                    className="inline-flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {actionLoading ? (
                                        <>
                                            <i className="ri-loader-4-line animate-spin text-lg" />

                                            {modal.type === "edit"
                                                ? "Updating..."
                                                : "Creating..."}
                                        </>
                                    ) : (
                                        <>
                                            <i
                                                className={
                                                    modal.type ===
                                                        "edit"
                                                        ? "ri-save-line"
                                                        : "ri-add-line"
                                                }
                                            />

                                            {modal.type === "edit" ? "Save" : "Create"}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            {/* Delete Modal */}
            {modal.type === "delete" && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm"
                    onMouseDown={(e) => {
                        if (
                            e.target === e.currentTarget &&
                            !actionLoading
                        ) {
                            closeModal();
                        }
                    }}
                >
                    <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                        <div className="p-5 sm:p-6">
                            <div className="flex items-start gap-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
                                    <i className="ri-delete-bin-6-line text-xl" />
                                </div>

                                <div className="min-w-0">
                                    <h2 className="text-lg font-bold text-slate-900">
                                        Delete folder?
                                    </h2>

                                    <p className="mt-1 text-sm leading-5 text-slate-500">
                                        Are you sure you want to permanently
                                        delete{" "}
                                        <span className="font-semibold text-slate-700">
                                            "{modal.folder?.name}"
                                        </span>
                                        ?
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-3.5">
                                <div className="flex gap-2.5">
                                    <i className="ri-error-warning-fill mt-0.5 shrink-0 text-red-500" />

                                    <p className="text-xs font-medium leading-5 text-red-700">
                                        Deleting this folder may also remove
                                        the files/content associated with it.
                                        This action cannot be undone.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/70 p-4 sm:flex-row">
                            <button
                                type="button"
                                disabled={actionLoading}
                                onClick={closeModal}
                                className="h-10 flex-1 cursor-pointer rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 py-3"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                disabled={actionLoading}
                                onClick={handleDelete}
                                className="inline-flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-600 text-sm font-semibold text-white shadow-md shadow-red-600/20 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 py-3"
                            >
                                {actionLoading ? (
                                    <>
                                        <i className="ri-loader-4-line animate-spin text-lg" />
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <i className="ri-delete-bin-line" />
                                        Delete
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Favourites;
