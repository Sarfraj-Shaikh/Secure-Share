import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const INITIAL_FOLDERS = [
    {
        id: 1,
        name: "Documents",
        color: "blue",
        totalFiles: 24,
        favorite: true,
        createdAt: "2026-08-18T10:30:00",
        updatedAt: "2026-08-24T14:20:00",
    },
    {
        id: 2,
        name: "Work Projects",
        color: "purple",
        totalFiles: 18,
        favorite: false,
        createdAt: "2026-08-15T09:15:00",
        updatedAt: "2026-08-22T11:40:00",
    },
    {
        id: 3,
        name: "Personal",
        color: "rose",
        totalFiles: 12,
        favorite: true,
        createdAt: "2026-08-10T16:45:00",
        updatedAt: "2026-08-20T18:10:00",
    },
    {
        id: 4,
        name: "Design Assets",
        color: "green",
        totalFiles: 36,
        favorite: false,
        createdAt: "2026-08-05T12:20:00",
        updatedAt: "2026-08-19T15:30:00",
    },
    {
        id: 5,
        name: "Marketing",
        color: "pink",
        totalFiles: 9,
        favorite: false,
        createdAt: "2026-07-29T08:00:00",
        updatedAt: "2026-08-16T13:25:00",
    },
    {
        id: 6,
        name: "Invoices",
        color: "default",
        totalFiles: 15,
        favorite: true,
        createdAt: "2026-07-22T11:30:00",
        updatedAt: "2026-08-12T09:45:00",
    },
    {
        id: 7,
        name: "Presentations",
        color: "blue",
        totalFiles: 21,
        favorite: false,
        createdAt: "2026-07-18T14:00:00",
        updatedAt: "2026-08-09T16:15:00",
    },
    {
        id: 8,
        name: "Archive",
        color: "purple",
        totalFiles: 42,
        favorite: false,
        createdAt: "2026-07-12T10:10:00",
        updatedAt: "2026-08-05T12:00:00",
    },
];

const COLORS = {
    default: {
        label: "Default",
        bg: "bg-slate-100",
        text: "text-slate-600",
        icon: "text-slate-500",
        border: "border-slate-200",
        dot: "bg-slate-400",
    },
    blue: {
        label: "Blue",
        bg: "bg-blue-50",
        text: "text-blue-600",
        icon: "text-blue-500",
        border: "border-blue-100",
        dot: "bg-blue-500",
    },
    rose: {
        label: "Rose",
        bg: "bg-rose-50",
        text: "text-rose-600",
        icon: "text-rose-500",
        border: "border-rose-100",
        dot: "bg-rose-500",
    },
    green: {
        label: "Green",
        bg: "bg-emerald-50",
        text: "text-emerald-600",
        icon: "text-emerald-500",
        border: "border-emerald-100",
        dot: "bg-emerald-500",
    },
    purple: {
        label: "Purple",
        bg: "bg-purple-50",
        text: "text-purple-600",
        icon: "text-purple-500",
        border: "border-purple-100",
        dot: "bg-purple-500",
    },
    pink: {
        label: "Pink",
        bg: "bg-pink-50",
        text: "text-pink-600",
        icon: "text-pink-500",
        border: "border-pink-100",
        dot: "bg-pink-500",
    },
};

const ITEMS_PER_PAGE = 6;

const formatDate = (date) =>
    new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(date));

export default function MyFiles() {

    const navigate = useNavigate();

    const [folders, setFolders] = useState(INITIAL_FOLDERS);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("latest");
    const [sortOpen, setSortOpen] = useState(false);

    const [page, setPage] = useState(1);

    const [menuId, setMenuId] = useState(null);

    const [modal, setModal] = useState(null);
    const [selectedFolder, setSelectedFolder] = useState(null);

    const [folderName, setFolderName] = useState("");
    const [folderColor, setFolderColor] = useState("default");

    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState("");
    const [toast, setToast] = useState(null);

    const filteredFolders = useMemo(() => {

        const query = search.trim().toLowerCase();

        const result = folders.filter((folder) =>
            folder.name.toLowerCase().includes(query)
        );

        return [...result].sort((a, b) => {
            if (sortBy === "oldest") {
                return new Date(a.createdAt) - new Date(b.createdAt);
            }

            return new Date(b.createdAt) - new Date(a.createdAt);
        });

    }, [folders, search, sortBy]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredFolders.length / ITEMS_PER_PAGE)
    );

    const visibleFolders = filteredFolders.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );

    const showToast = (message, type = "success") => {
        setToast({ message, type });

        window.setTimeout(() => {
            setToast(null);
        }, 2800);
    };

    const resetPagination = () => {
        if (page !== 1) setPage(1);
    };

    const handleSearch = (value) => {
        setSearch(value);
        resetPagination();
    };

    const handleSort = (value) => {
        setSortBy(value);
        setSortOpen(false);
        resetPagination();
    };

    const openCreateModal = () => {
        setFolderName("");
        setFolderColor("default");
        setSelectedFolder(null);
        setModal("create");
    };

    const openEditModal = (folder) => {
        setFolderName(folder.name);
        setFolderColor(folder.color);
        setSelectedFolder(folder);
        setMenuId(null);
        setModal("edit");
    };

    const handleCreateFolder = () => {
        const name = folderName.trim();

        if (!name) return;

        const now = new Date().toISOString();

        const newFolder = {
            id: Date.now(),
            name,
            color: folderColor,
            totalFiles: 0,
            favorite: false,
            createdAt: now,
            updatedAt: now,
        };

        setFolders((prev) => [newFolder, ...prev]);
        setModal(null);
        setFolderName("");
        setFolderColor("default");
        setPage(1);

        showToast("Folder created successfully.");
    };

    const handleEditFolder = () => {
        const name = folderName.trim();

        if (!name || !selectedFolder) return;

        setFolders((prev) =>
            prev.map((folder) =>
                folder.id === selectedFolder.id
                    ? {
                        ...folder,
                        name,
                        color: folderColor,
                        updatedAt: new Date().toISOString(),
                    }
                    : folder
            )
        );

        setModal(null);
        setSelectedFolder(null);
        showToast("Folder updated successfully.");
    };

    const toggleFavorite = (id) => {
        setFolders((prev) =>
            prev.map((folder) =>
                folder.id === id
                    ? {
                        ...folder,
                        favorite: !folder.favorite,
                        updatedAt: new Date().toISOString(),
                    }
                    : folder
            )
        );

        setMenuId(null);
    };

    const openDeleteModal = (folder) => {
        setSelectedFolder(folder);
        setDeleteError("");
        setMenuId(null);
        setModal("delete");
    };

    const handleDeleteFolder = async () => {
        if (!selectedFolder) return;

        setDeleteLoading(true);
        setDeleteError("");

        try {
            /*
             * Replace this section with your real API call.
             *
             * Example:
             * await deleteFolderApi(selectedFolder.id);
             *
             * Backend should delete:
             * 1. Folder
             * 2. All files/content belonging to this folder
             */

            await new Promise((resolve) => setTimeout(resolve, 900));

            setFolders((prev) =>
                prev.filter((folder) => folder.id !== selectedFolder.id)
            );

            setModal(null);
            setSelectedFolder(null);

            setPage((currentPage) => {
                const remainingItems = filteredFolders.length - 1;
                const newTotalPages = Math.max(
                    1,
                    Math.ceil(remainingItems / ITEMS_PER_PAGE)
                );

                return Math.min(currentPage, newTotalPages);
            });

            showToast("Folder and all its contents were deleted.");
        } catch (error) {
            setDeleteError(
                "Unable to delete this folder. Please try again."
            );
        } finally {
            setDeleteLoading(false);
        }
    };

    const renderFolderIcon = (folder) => {
        const color = COLORS[folder.color] || COLORS.default;

        return (
            <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${color.bg} ${color.icon} transition-all duration-300 group-hover:scale-105`}
            >
                <i className="ri-folder-5-fill text-[23px]" />
            </div>
        );
    };

    return (

        <div className="bg-slate-50 pt-[90px] pb-5 min-h-dvh">

            <div className="mx-auto px-3 md:px-[5%]">

                {/* Header */}
                <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                    <div>

                        {/* <div className="mb-2 flex items-center gap-2">

                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm shadow-blue-200">
                                <i className="ri-folder-open-fill" />
                            </span>

                            <span className="text-sm font-medium text-blue-600">
                                File Manager
                            </span>

                        </div> */}

                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                            My Files
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Organize and manage all your folders in one place.
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={openCreateModal}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-blue-600/30 active:translate-y-0 cursor-pointer"
                    >
                        <i className="ri-add-line text-lg" />
                        Create Folder
                    </button>

                </div>

                {/* Toolbar */}
                <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row">

                    {/* Search */}
                    <div className="relative flex-1">

                        <i className="ri-search-line pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400" />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Search folders..."
                            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                        />

                        {search && (
                            <button
                                type="button"
                                onClick={() => handleSearch("")}
                                className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-200 hover:text-slate-600"
                            >
                                <i className="ri-close-line" />
                            </button>
                        )}

                    </div>

                    {/* Custom Sort */}
                    <div className="relative sm:w-48">

                        <button
                            type="button"
                            onClick={() => setSortOpen((prev) => !prev)}
                            className="flex h-11 w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50/50"
                        >
                            <span className="flex items-center gap-2">
                                <i className="ri-sort-desc text-lg text-blue-600" />
                                {sortBy === "latest" ? "Latest" : "Oldest"}
                            </span>

                            <i
                                className={`ri-arrow-down-s-line text-lg transition-transform duration-200 ${sortOpen ? "rotate-180" : ""
                                    }`}
                            />
                        </button>

                        {sortOpen && (

                            <div className="absolute right-0 z-30 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10">

                                {[
                                    { value: "latest", label: "Latest" },
                                    { value: "oldest", label: "Oldest" },
                                ].map((option) => (

                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => handleSort(option.value)}
                                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition ${sortBy === option.value
                                            ? "bg-blue-50 font-semibold text-blue-600"
                                            : "text-slate-600 hover:bg-slate-50"
                                            }`}
                                    >
                                        {option.label}

                                        {sortBy === option.value && (
                                            <i className="ri-check-line text-lg" />
                                        )}
                                    </button>

                                ))}

                            </div>

                        )}

                    </div>

                </div>


                {/* Folder Cards */}
                <div>

                    {visibleFolders.length > 0 ? (

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                            {visibleFolders.map((folder) => {

                                const color = COLORS[folder.color] || COLORS.default;

                                return (

                                    <div
                                        key={folder.id}
                                        onClick={() => {navigate(`/user/my-files/${folder.id}`)}}
                                        className="group relative overflow-visible rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 cursor-pointer"
                                    >

                                        {/* Top */}
                                        <div className="flex items-start justify-between gap-3">

                                            <div
                                                className={`flex h-12 w-12 items-center justify-center rounded-xl ${color.bg} ${color.icon} transition-transform duration-300 group-hover:scale-105`}
                                            >

                                                <i className="ri-folder-5-fill text-2xl" />

                                            </div>

                                            <div className="relative">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setMenuId((prev) =>
                                                            prev === folder.id ? null : folder.id
                                                        )
                                                    }
                                                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-lg text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-700 cursor-pointer ${menuId === folder.id
                                                        ? "bg-slate-100 text-slate-700"
                                                        : ""
                                                        }`}
                                                    aria-label="Folder actions"
                                                >

                                                    <i className="ri-more-2-fill" />

                                                </button>

                                                {menuId === folder.id && (
                                                    <FolderMenu
                                                        folder={folder}
                                                        onEdit={() => openEditModal(folder)}
                                                        onDelete={() => openDeleteModal(folder)}
                                                        onFavorite={() => toggleFavorite(folder.id)}
                                                    />
                                                )}

                                            </div>

                                        </div>

                                        {/* Folder Name */}
                                        <div className="mt-4">

                                            <div className="flex items-center gap-2">

                                                <h3 className="min-w-0 truncate text-base font-bold text-slate-800">
                                                    {folder.name}
                                                </h3>

                                                <button
                                                    type="button"
                                                    onClick={() => toggleFavorite(folder.id)}
                                                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all cursor-pointer ${folder.favorite
                                                        ? "bg-amber-50 text-amber-500"
                                                        : "text-slate-300 hover:bg-slate-100 hover:text-slate-500"
                                                        }`}
                                                    aria-label={
                                                        folder.favorite
                                                            ? "Remove from favorites"
                                                            : "Add to favorites"
                                                    }
                                                >
                                                    <i
                                                        className={
                                                            folder.favorite
                                                                ? "ri-star-fill"
                                                                : "ri-star-line"
                                                        }
                                                    />
                                                </button>

                                            </div>

                                            <p className="mt-1 text-xs text-slate-400">
                                                Updated {formatDate(folder.updatedAt)}
                                            </p>

                                        </div>

                                        {/* Color + Files */}
                                        <div className="mt-5 flex items-center justify-between">

                                            {/* <span
                                                className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1.5 text-xs font-medium ${color.bg} ${color.text}`}
                                            >
                                                <span
                                                    className={`h-1.5 w-1.5 rounded-full ${color.dot}`}
                                                />
                                                {color.label}
                                            </span> */}

                                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                                <i className="ri-file-3-line text-sm text-slate-400" />
                                                {folder.totalFiles} files
                                            </span>

                                        </div>

                                        {/* Divider */}
                                        <div className="my-4 border-t border-slate-100" />

                                        {/* Footer */}
                                        <div className="flex items-center justify-between">

                                            <div>

                                                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                                    Created
                                                </p>

                                                <p className="mt-1 text-xs font-medium text-slate-600 capitalize">
                                                    {formatDate(folder.createdAt)}
                                                </p>

                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => toggleFavorite(folder.id)}
                                                className={`flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold transition-all cursor-pointer ${folder.favorite
                                                    ? "bg-amber-50 text-amber-600"
                                                    : "bg-slate-50 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                                                    }`}
                                            >
                                                <i
                                                    className={
                                                        folder.favorite
                                                            ? "ri-star-fill"
                                                            : "ri-star-line"
                                                    }
                                                />
                                                {folder.favorite ? "Favorite" : "Add Favorite"}
                                            </button>

                                        </div>

                                    </div>

                                );

                            })}

                        </div>

                    ) : (

                        <div className="rounded-2xl border border-slate-200 bg-white">

                            <EmptyState
                                search={search}
                                onClear={() => handleSearch("")}
                            />

                        </div>

                    )}

                </div>

                {/* Pagination */}
                {filteredFolders.length > 0 && totalPages > 1 && (

                    <div className="mt-5 flex flex-col items-center justify-between gap-3 sm:flex-row">

                        <p className="text-xs text-slate-500">

                            Showing{" "}
                            <span className="font-semibold text-slate-700">
                                {(page - 1) * ITEMS_PER_PAGE + 1}
                            </span>{" "}
                            to{" "}
                            <span className="font-semibold text-slate-700">
                                {Math.min(page * ITEMS_PER_PAGE, filteredFolders.length)}
                            </span>{" "}
                            of{" "}
                            <span className="font-semibold text-slate-700">
                                {filteredFolders.length}
                            </span>
                        </p>

                        <div className="flex items-center gap-1.5">
                            <button
                                type="button"
                                disabled={page === 1}
                                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <i className="ri-arrow-left-s-line" />
                            </button>

                            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                                (number) => (
                                    <button
                                        key={number}
                                        type="button"
                                        onClick={() => setPage(number)}
                                        className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-xs font-semibold transition ${page === number
                                            ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                                            : "border border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                                            }`}
                                    >
                                        {number}
                                    </button>
                                )
                            )}

                            <button
                                type="button"
                                disabled={page === totalPages}
                                onClick={() =>
                                    setPage((prev) => Math.min(totalPages, prev + 1))
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <i className="ri-arrow-right-s-line" />
                            </button>
                        </div>

                    </div>
                )}

            </div>

            {/* Create / Edit Modal */}
            {(modal === "create" || modal === "edit") && (

                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget && !deleteLoading) {
                            setModal(null);
                        }
                    }}
                >
                    <div className="w-full max-w-md animate-[modalIn_.2s_ease-out] overflow-hidden rounded-2xl bg-white shadow-2xl">

                        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

                            <div>

                                <h2 className="text-lg font-bold text-slate-900">
                                    {modal === "create" ? "Create Folder" : "Edit Folder"}
                                </h2>

                                <p className="mt-0.5 text-xs text-slate-400">
                                    {modal === "create"
                                        ? "Create a new folder for your files."
                                        : "Update your folder details."}
                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={() => setModal(null)}
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
                            >
                                <i className="ri-close-line" />
                            </button>

                        </div>

                        <div className="space-y-5 p-5">

                            {/* Folder name */}
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
                                        onChange={(e) => setFolderName(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                modal === "create"
                                                    ? handleCreateFolder()
                                                    : handleEditFolder();
                                            }
                                        }}
                                        placeholder="e.g. Work Documents"
                                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                    />

                                </div>

                            </div>

                            {/* Folder color */}
                            <div>

                                <label className="mb-3 block text-sm font-semibold text-slate-700">
                                    Folder color
                                </label>

                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">

                                    {Object.entries(COLORS).map(([key, color]) => (

                                        <button
                                            type="button"
                                            key={key}
                                            onClick={() => setFolderColor(key)}
                                            className={`group flex flex-col items-center gap-2 rounded-xl border p-2.5 transition-all cursor-pointer ${folderColor === key
                                                ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500/10"
                                                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                                }`}
                                        >
                                            <span
                                                className={`flex h-10 w-10 items-center justify-center rounded-lg ${color.bg} ${color.icon}`}
                                            >
                                                <i className="ri-folder-5-fill" />
                                            </span>

                                            <span className="text-[10px] font-medium text-slate-600">
                                                {color.label}
                                            </span>

                                        </button>

                                    ))}

                                </div>

                            </div>

                        </div>

                        <div className="flex gap-2 border-t border-slate-100 bg-slate-50/70 p-4">

                            <button
                                type="button"
                                onClick={() => setModal(null)}
                                className="h-10 flex-1 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 transition hover:bg-slate-50 cursor-pointer"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                disabled={!folderName.trim()}
                                onClick={
                                    modal === "create"
                                        ? handleCreateFolder
                                        : handleEditFolder
                                }
                                className="h-10 flex-1 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                {modal === "create" ? "Create" : "Save"}
                            </button>

                        </div>

                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {modal === "delete" && selectedFolder && (

                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">

                    <div className="w-full max-w-md animate-[modalIn_.2s_ease-out] overflow-hidden rounded-2xl bg-white shadow-2xl">

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
                                        Are you sure you want to permanently delete{" "}
                                        <span className="font-semibold text-slate-700">
                                            "{selectedFolder.name}"
                                        </span>
                                        ?
                                    </p>

                                </div>

                            </div>

                            <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-3.5">

                                <div className="flex gap-2.5">

                                    <i className="ri-error-warning-fill mt-0.5 shrink-0 text-red-500" />

                                    <p className="text-xs font-medium leading-5 text-red-700">
                                        Deleting this folder will also delete all files and
                                        content inside the folder. This action cannot be undone.
                                    </p>

                                </div>

                            </div>

                            {deleteError && (
                                <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-600">
                                    <i className="ri-error-warning-line mr-1" />
                                    {deleteError}
                                </div>
                            )}

                        </div>

                        <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/70 p-4 sm:flex-row">

                            <button
                                type="button"
                                disabled={deleteLoading}
                                onClick={() => {
                                    setModal(null);
                                    setSelectedFolder(null);
                                    setDeleteError("");
                                }}
                                className="h-10 flex-1 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                disabled={deleteLoading}
                                onClick={handleDeleteFolder}
                                className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 text-sm font-semibold text-white shadow-md shadow-red-600/20 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                            >
                                {deleteLoading ? (
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

            {/* Toast */}
            {toast && (
                <div className="fixed bottom-5 left-1/2 z-[70] w-[calc(100%-32px)] max-w-sm -translate-x-1/2 animate-[toastIn_.25s_ease-out]">
                    <div
                        className={`flex items-center gap-3 rounded-xl border bg-white px-4 py-3 shadow-xl ${toast.type === "error"
                            ? "border-red-100"
                            : "border-emerald-100"
                            }`}
                    >
                        <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${toast.type === "error"
                                ? "bg-red-50 text-red-500"
                                : "bg-emerald-50 text-emerald-500"
                                }`}
                        >
                            <i
                                className={
                                    toast.type === "error"
                                        ? "ri-error-warning-line"
                                        : "ri-check-line"
                                }
                            />
                        </div>

                        <p className="text-sm font-medium text-slate-700">
                            {toast.message}
                        </p>
                    </div>
                </div>
            )}

            <style>{`
        @keyframes modalIn {
          from {
            opacity: 0;
            transform: translateY(8px) scale(.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes toastIn {
          from {
            opacity: 0;
            transform: translate(-50%, 10px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
      `}</style>
        </div>
    );
}

function FolderMenu({ folder, onEdit, onDelete, onFavorite }) {

    return (

        <div className="absolute right-0 top-10 z-40 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10">

            <button
                type="button"
                onClick={onEdit}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-600 transition hover:bg-blue-50 hover:text-blue-600 cursor-pointer"
            >
                <i className="ri-edit-line text-base" />
                Edit
            </button>

            <button
                type="button"
                onClick={onFavorite}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-600 transition hover:bg-amber-50 hover:text-amber-600 cursor-pointer"
            >
                <i
                    className={
                        folder.favorite
                            ? "ri-star-fill text-base"
                            : "ri-star-line text-base"
                    }
                />
                {folder.favorite ? "Remove favorite" : "Favorite"}
            </button>

            <button
                type="button"
                onClick={onDelete}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-red-500 transition hover:bg-red-50 cursor-pointer"
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
                            {formatDate(folder.createdAt)}
                        </span>
                    </p>

                    <p>
                        Updated:{" "}
                        <span className="text-slate-500">
                            {formatDate(folder.updatedAt)}
                        </span>
                    </p>
                </div>
            </div>

        </div>
    );
}

function EmptyState({ search, onClear }) {

    if (search) {
        return (
            <div className="flex min-h-[320px] flex-col items-center justify-center px-5 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                    <i className="ri-search-eye-line text-3xl" />
                </div>

                <h3 className="mt-4 text-base font-bold text-slate-800">
                    No folders found
                </h3>

                <p className="mt-1 max-w-sm text-sm text-slate-400">
                    We couldn't find any folder matching "{search}".
                </p>

                <button
                    type="button"
                    onClick={onClear}
                    className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                    Clear search
                </button>
            </div>
        );
    }

    return (
        <div className="flex min-h-[320px] flex-col items-center justify-center px-5 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-500">
                <i className="ri-folder-open-line text-3xl" />
            </div>

            <h3 className="mt-4 text-base font-bold text-slate-800">
                No folders available
            </h3>

            <p className="mt-1 max-w-sm text-sm text-slate-400">
                Create your first folder to start organizing your files.
            </p>
        </div>
    );
}