import { message } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../../../utils/api";
import { toNamePathStr } from "antd/es/form/hooks/useForm";

const Files = () => {

    
    const { id } = useParams();
    const routeFolderId = id;

    const fileInputRef = useRef(null);

    const [filter, setFilter] = useState("latest");
    const [files, setFiles] = useState([]);
    const [folders, setFolders] = useState([]);

    const [searchQuery, setSearchQuery] = useState("");
    const [folderSearchQuery, setFolderSearchQuery] = useState("");

    const [addFileModal, setAddFileModal] = useState(false);
    const [editFileModal, setEditFileModal] = useState(false);
    const [shareFileModal, setShareFileModal] = useState(false);
    const [moveFileModal, setMoveFileModal] = useState(false);
    const [deleteFileModal, setDeleteFileModal] = useState(false);
    const [selectFolderModal, setSelectFolderModal] = useState(false);

    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [folderLoading, setFolderLoading] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [shareLoading, setShareLoading] = useState(false);
    const [moveLoading, setMoveLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFolderName, setSelectedFolderName] = useState(null);
    const [currentFolderName, setCurrentFolderName] = useState(null);
    const [moveFolderId, setMoveFolderId] = useState(null);

    const [fileName, setFileName] = useState("");
    const [folderId, setFolderId] = useState(routeFolderId || null);

    const [userEmail, setUserEmail] = useState("");

    const [pageNo, setPageNo] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [folderPageNo, setFolderPageNo] = useState(1);
    const [folderTotalPages, setFolderTotalPages] = useState(1);

    const [editFileName, setEditFileName] = useState("");
    const [editPassword, setEditPassword] = useState("");
    const [editExpiry, setEditExpiry] = useState("");

    const [openMenuFileId, setOpenMenuFileId] = useState(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    /*
     * -------------------------------------------------------
     * Auth
     * -------------------------------------------------------
     */

    const getAuthConfig = () => {
        const userToken = localStorage.getItem("userToken");

        return {
            headers: {
                Authorization: userToken || "",
            },
        };
    };

    /*
     * -------------------------------------------------------
     * Helpers
     * -------------------------------------------------------
     */

    const getErrorMessage = (err, fallback) => {
        return (
            err?.response?.data?.message ||
            err?.message ||
            fallback
        );
    };

    const getFileExtension = (name = "") => {
        const parts = name.split(".");

        if (parts.length <= 1) {
            return "";
        }

        return parts.pop();
    };

    const getFileNameWithoutExtension = (name = "") => {
        const extension = getFileExtension(name);

        return extension
            ? name.slice(0, -(extension.length + 1))
            : name;
    };

    const formatFileSize = (size) => {
        const bytes = Number(size) || 0;

        if (bytes < 1024) {
            return `${bytes} B`;
        }

        if (bytes < 1024 * 1024) {
            return `${(bytes / 1024).toFixed(2)} KB`;
        }

        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    const formatDate = (date) => {
        if (!date) {
            return "—";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return date;
        }

        return parsedDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const getMimeExtension = (mimeType = "") => {
        const parts = mimeType.split("/");

        return parts.length > 1
            ? parts[1].toUpperCase()
            : "FILE";
    };

    /*
     * -------------------------------------------------------
     * Route folder
     * -------------------------------------------------------
     */

    useEffect(() => {
        setFolderId(routeFolderId || null);
    }, [routeFolderId]);

    /*
     * -------------------------------------------------------
     * Fetch files whenever folder changes
     * -------------------------------------------------------
     */

    useEffect(() => {
        if (!folderId) {
            setFiles([]);
            setPageNo(1);
            setTotalPages(1);
            return;
        }

        fetchFiles(true);
    }, [folderId]);

    /*
     * -------------------------------------------------------
     * File Fetch
     * -------------------------------------------------------
     */

    const fetchFiles = async (reset = false) => {
        if (!folderId) {
            return;
        }

        try {
            setFetchLoading(true);

            const page = reset ? 1 : pageNo;

            const response = await api.get(
                `/api/file?folder=${encodeURIComponent(
                    folderId
                )}&page=${page}`,
                getAuthConfig()
            );

            const responseFiles = Array.isArray(response.data?.files)
                ? response.data.files
                : [];

            const currentPage = Number(
                response.data?.currentPage || page
            );

            const responseTotalPages = Number(
                response.data?.totalPages || 1
            );

            setFiles((prev) =>
                reset
                    ? responseFiles
                    : [...prev, ...responseFiles]
            );
            setTotalPages(responseTotalPages);
            setCurrentFolderName(response.data?.folderName);
            setPageNo(currentPage + 1);
        } catch (err) {
            message.error(
                getErrorMessage(
                    err,
                    "Unable to fetch files."
                )
            );
        } finally {
            setFetchLoading(false);
        }
    };

    /*
     * -------------------------------------------------------
     * File Selection
     * -------------------------------------------------------
     */

    const handleFileSelection = (event) => {

        const selected = event.target.files?.[0];

        if (!selected) {
            return;
        }

        if (selected.size > 10 * 1024 * 1024) {
            message.error(
                "File size cannot exceed 10 MB."
            );

            event.target.value = "";
            return;
        }

        setSelectedFile(selected);

        setFileName(
            getFileNameWithoutExtension(selected.name)
        );
    };

    /*
     * -------------------------------------------------------
     * Upload File
     * -------------------------------------------------------
     */

    const handleFileUpload = async () => {

        if (!selectedFile) {
            message.error("Please select a file.");
            return;
        }

        if (!fileName.trim()) {
            message.error("Please enter file name.");
            return;
        }

        if (!folderId) {
            message.error("Folder ID is required.");
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();

            formData.append("fileName", fileName.trim());
            formData.append("folderId", folderId);
            formData.append("file", selectedFile, selectedFile.name);

            const token = localStorage.getItem("userToken");

            const response = await api.post(
                "/api/file", formData,
                {
                    headers: { Authorization: token || "", },
                }
            );

            message.success(response.data?.message || "File uploaded successfully.");

            setAddFileModal(false);
            resetUploadState();

            await fetchFiles(true);

        } catch (err) {
            message.error(
                err?.response?.data?.message ||
                "Unable to upload file."
            );
        } finally {
            setLoading(false);
        }
    };

    const resetUploadState = () => {
        setSelectedFile(null);
        setFileName("");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    /*
     * -------------------------------------------------------
     * Update File
     * -------------------------------------------------------
     */

    const handleEditFile = async (fileId) => {
        if (!editFileName.trim()) {
            message.error("Please enter file name.");
            return;
        }

        try {
            setEditLoading(true);

            /*
             * Backend validation does NOT allow:
             *
             * password: ""
             * expiresAt: ""
             *
             * So only send them when they contain a value.
             */

            const payload = {
                fileName: editFileName.trim(),
            };

            if (editPassword.trim()) {
                payload.password =
                    editPassword.trim();
            }

            if (editExpiry.trim()) {
                payload.expiresAt =
                    editExpiry.trim();
            }

            const response = await api.put(
                `/api/file/${fileId}`,
                payload,
                getAuthConfig()
            );

            message.success(
                response.data?.message ||
                "File updated successfully."
            );

            setEditFileModal(false);

            resetEditState();

            /*
             * Backend does not return the updated file.
             * Therefore fetch the files again.
             */
            await fetchFiles(true);
        } catch (err) {
            message.error(
                getErrorMessage(
                    err,
                    "Unable to update file."
                )
            );
        } finally {
            setEditLoading(false);
        }
    };

    /*
     * -------------------------------------------------------
     * Share File
     *
     * NOTE:
     * Backend route for share-file was not included in the
     * backend code you provided.
     *
     * Keeping your existing endpoint:
     * POST /api/share-file
     * -------------------------------------------------------
     */

    const handleFileShare = async (fileId) => {
        if (!userEmail.trim()) {
            message.error(
                "Please enter recipient email."
            );
            return;
        }

        try {
            setShareLoading(true);

            const payload = {
                userEmail: userEmail.trim(),
                fileId,
            };

            const response = await api.post(
                "/api/share-file",
                payload,
                getAuthConfig()
            );

            message.success(
                response.data?.message ||
                "File shared successfully."
            );

            setUserEmail("");
            setShareFileModal(false);
        } catch (err) {
            message.error(
                getErrorMessage(
                    err,
                    "Unable to share file."
                )
            );
        } finally {
            setShareLoading(false);
        }
    };

    /*
     * -------------------------------------------------------
     * Fetch Folders
     * -------------------------------------------------------
     *
     * NOTE:
     * Your provided backend does not include folder route/code,
     * so this assumes:
     *
     * GET /api/folder?page=1
     *
     * with response:
     * {
     *   folders,
     *   currentPage,
     *   totalPages
     * }
     *
     * -------------------------------------------------------
     */

    const fetchFolders = async (reset = false) => {

        try {

            setFolderLoading(true);

            const page = reset ? 1 : folderPageNo;

            const response = await api.get(`/api/folders?page=${page}`, getAuthConfig());

            const responseFolders = Array.isArray(response.data?.folders) ? response.data.folders : Array.isArray(response.data?.data) ? response.data.data : [];

            const currentPage = Number(
                response.data?.currentPage || page
            );

            const responseTotalPages = Number(
                response.data?.totalPages || 1
            );

            setFolders((prev) =>
                reset
                    ? responseFolders
                    : [...prev, ...responseFolders]
            );

            setFolderTotalPages(
                responseTotalPages
            );

            setFolderPageNo(
                currentPage + 1
            );
        } catch (err) {
            message.error(
                getErrorMessage(
                    err,
                    "Unable to fetch folders."
                )
            );
        } finally {
            setFolderLoading(false);
        }
    };

    /*
     * -------------------------------------------------------
     * Move File
     * -------------------------------------------------------
     */

    const handleMoveFile = async (fileId) => {

        if (!moveFolderId) {
            message.error(
                "Please select a destination folder."
            );
            return;
        }

        if (moveFolderId === folderId) {
            message.error(
                "File is already in this folder."
            );
            return;
        }

        try {
            setMoveLoading(true);

            /*
             * Backend PUT /api/file/:id accepts folderId.
             */
            const payload = {
                folderId: moveFolderId,
            };

            const response = await api.put(
                `/api/file/${fileId}`,
                payload,
                getAuthConfig()
            );

            message.success(
                response.data?.message ||
                "File moved successfully."
            );

            setMoveFolderId(null);
            setSelectFolderModal(false);
            setMoveFileModal(false);
            setSelectedFile(null);

            /*
             * Current folder has changed, therefore
             * fetch current folder again.
             */
            await fetchFiles(true);
        } catch (err) {
            message.error(
                getErrorMessage(
                    err,
                    "Unable to move file."
                )
            );
        } finally {
            setMoveLoading(false);
        }
    };

    /*
     * -------------------------------------------------------
     * Delete File
     * -------------------------------------------------------
     */

    const handleFileDelete = async (fileId) => {
        try {
            setDeleteLoading(true);

            const response = await api.delete(
                `/api/file/${fileId}`,
                getAuthConfig()
            );

            message.success(
                response.data?.message ||
                "File deleted successfully."
            );

            setFiles((prev) =>
                prev.filter(
                    (file) => file._id !== fileId
                )
            );

            setDeleteFileModal(false);
            setSelectedFile(null);
        } catch (err) {
            message.error(
                getErrorMessage(
                    err,
                    "Unable to delete file."
                )
            );
        } finally {
            setDeleteLoading(false);
        }
    };

    /*
     * -------------------------------------------------------
     * Modal Open / Close
     * -------------------------------------------------------
     */

    const openEditModal = (file) => {
        setSelectedFile(file);

        setEditFileName(
            getFileNameWithoutExtension(
                file.fileName
            )
        );

        /*
         * Backend may return password.
         * Don't expose anything differently here.
         */
        setEditPassword(
            file.password || ""
        );

        setEditExpiry(
            file.expiresAt
                ? new Date(file.expiresAt)
                    .toISOString()
                    .split("T")[0]
                : ""
        );

        setEditFileModal(true);
        setOpenMenuFileId(null);
    };

    const openShareModal = (file) => {
        setSelectedFile(file);
        setUserEmail("");
        setShareFileModal(true);
        setOpenMenuFileId(null);
    };

    const openMoveModal = (file) => {
        setSelectedFile(file);

        setMoveFolderId(
            file.folderId || null
        );

        setMoveFileModal(true);
        setOpenMenuFileId(null);
    };

    const openDeleteModal = (file) => {
        setSelectedFile(file);
        setDeleteFileModal(true);
        setOpenMenuFileId(null);
    };

    const openSelectFolderModal = () => {
        setFolderSearchQuery("");
        setSelectFolderModal(true);

        /*
         * Always start folder selection from page 1.
         */
        fetchFolders(true);
    };

    const closeAddFileModal = () => {
        if (loading) {
            return;
        }

        setAddFileModal(false);
        setSelectedFile(null);
        setFileName("");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const resetEditState = () => {
        setEditFileName("");
        setEditPassword("");
        setEditExpiry("");
    };

    const closeEditModal = () => {
        if (editLoading) {
            return;
        }

        setEditFileModal(false);
        resetEditState();
        setSelectedFile(null);
    };

    /*
     * -------------------------------------------------------
     * Filter + Search
     * -------------------------------------------------------
     *
     * Backend currently ALWAYS sorts:
     *
     * .sort({ createdAt: -1 })
     *
     * Therefore oldest/latest filtering is handled here.
     *
     * Important:
     * Pagination happens BEFORE frontend sorting.
     * For true global oldest/latest pagination, backend should
     * accept sort query parameter.
     *
     * -------------------------------------------------------
     */

    const filteredFiles = useMemo(() => {
        const query = searchQuery
            .trim()
            .toLowerCase();

        const result = files.filter((file) =>
            file.fileName
                ?.toLowerCase()
                .includes(query)
        );

        return [...result].sort((a, b) => {
            const dateA = new Date(
                a.createdAt || 0
            ).getTime();

            const dateB = new Date(
                b.createdAt || 0
            ).getTime();

            return filter === "latest"
                ? dateB - dateA
                : dateA - dateB;
        });
    }, [files, searchQuery, filter]);

    const filteredFolders = useMemo(() => {
        const query = folderSearchQuery
            .trim()
            .toLowerCase();

        return folders.filter((folder) =>
            folder.name
                ?.toLowerCase()
                .includes(query)
        );
    }, [folders, folderSearchQuery]);

    /*
     * -------------------------------------------------------
     * Render
     * -------------------------------------------------------
     */

    return (
        <section className="min-h-screen bg-slate-50 px-4 pt-[90px]">

            <div className="mx-auto max-w-7xl">

                <div className="flex w-full items-center gap-1.5 overflow-hidden rounded-lg bg-gray-50 py-2 mb-3">
                    {/* My Files */}
                    <button
                        type="button"
                        onClick={() => navigate("/user/my-files")}
                        className="group flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 cursor-pointer"
                    >
                        <i className="ri-home-5-line text-base transition-transform duration-200 group-hover:scale-110"></i>
                        <span>My Files</span>
                    </button>

                    {/* Separator */}
                    <i className="ri-arrow-right-s-line shrink-0 text-lg text-gray-400"></i>

                    {/* Current Folder */}
                    <span
                        className="min-w-0 truncate text-sm font-semibold text-gray-800 capitalize"
                        title={currentFolderName}
                    >
                        {currentFolderName}
                    </span>
                </div>

                {/* Header */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-xl font-semibold text-slate-900 sm:text-2xl">
                            Files
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                            Manage, upload, share and organize your files.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setAddFileModal(true)}
                        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-medium text-white transition-all duration-200 hover:bg-slate-800 active:scale-[0.98] sm:w-auto"
                    >
                        <i className="ri-upload-2-line text-lg" />
                        <span>Add File</span>
                    </button>
                </div>

                {/* Search + Filter */}
                <div className="relative mb-6 flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                        <i className="ri-search-line pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400" />

                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) =>
                                setSearchQuery(e.target.value)
                            }
                            placeholder="Search files..."
                            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                        />
                    </div>

                    <div className="relative sm:w-44">
                        <button
                            type="button"
                            onClick={() =>
                                setIsFilterOpen(
                                    (prev) => !prev
                                )
                            }
                            className="flex h-11 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 transition hover:border-slate-300"
                        >
                            <span className="flex items-center gap-2">
                                <i className="ri-filter-3-line text-lg text-slate-500" />

                                {filter === "latest"
                                    ? "Latest"
                                    : "Oldest"}
                            </span>

                            <i
                                className={`ri-arrow-down-s-line text-lg transition-transform duration-200 ${isFilterOpen
                                    ? "rotate-180"
                                    : ""
                                    }`}
                            />
                        </button>

                        {isFilterOpen && (
                            <div className="absolute right-0 top-[calc(100%+6px)] z-30 w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
                                {[
                                    ["latest", "Latest"],
                                    ["oldest", "Oldest"],
                                ].map(
                                    ([value, label]) => (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() => {
                                                setFilter(value);
                                                setIsFilterOpen(false);
                                            }}
                                            className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                                        >
                                            <span>
                                                {label}
                                            </span>

                                            {filter === value && (
                                                <i className="ri-check-line text-lg text-slate-900" />
                                            )}
                                        </button>
                                    )
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Files */}
                {fetchLoading && files.length === 0 ? (
                    <div className="flex min-h-[300px] items-center justify-center">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <i className="ri-loader-4-line animate-spin text-xl" />
                            Loading files...
                        </div>
                    </div>
                ) : filteredFiles.length > 0 ? (
                    <div className="grid gap-4 lg:grid-cols-2">
                        {filteredFiles.map((file) => (
                            <div
                                key={file._id}
                                className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-5"
                            >
                                {/* File Top */}
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                                            <i className="ri-file-3-line text-xl text-slate-600" />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-slate-900">
                                                {file.fileName}
                                            </p>

                                            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                                                <span>
                                                    {getMimeExtension(
                                                        file.mimeType
                                                    )}
                                                </span>

                                                <span>•</span>

                                                <span>
                                                    {file.mimeType
                                                        ?.split(
                                                            "/"
                                                        )[0] ||
                                                        "File"}
                                                </span>

                                                <span>•</span>

                                                <span>
                                                    {formatFileSize(
                                                        file.fileSize
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Menu */}
                                    <div className="relative shrink-0">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setOpenMenuFileId(
                                                    (prev) =>
                                                        prev ===
                                                            file._id
                                                            ? null
                                                            : file._id
                                                )
                                            }
                                            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                                        >
                                            <i className="ri-more-2-fill text-lg" />
                                        </button>

                                        {openMenuFileId ===
                                            file._id && (
                                                <div className="absolute right-0 top-10 z-20 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openEditModal(
                                                                file
                                                            )
                                                        }
                                                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50"
                                                    >
                                                        <i className="ri-edit-line text-lg" />
                                                        <span>
                                                            Edit
                                                        </span>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openShareModal(
                                                                file
                                                            )
                                                        }
                                                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50"
                                                    >
                                                        <i className="ri-share-line text-lg" />
                                                        <span>
                                                            Share
                                                        </span>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openMoveModal(
                                                                file
                                                            )
                                                        }
                                                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50"
                                                    >
                                                        <i className="ri-folder-transfer-line text-lg" />
                                                        <span>
                                                            Move File
                                                        </span>
                                                    </button>

                                                    <div className="my-1.5 border-t border-slate-100" />

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openDeleteModal(
                                                                file
                                                            )
                                                        }
                                                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 transition hover:bg-red-50"
                                                    >
                                                        <i className="ri-delete-bin-line text-lg" />
                                                        <span>
                                                            Delete
                                                        </span>
                                                    </button>
                                                </div>
                                            )}
                                    </div>
                                </div>

                                {/* Statistics */}
                                <div className="mt-5 grid grid-cols-2 gap-3">
                                    <div className="rounded-xl bg-slate-50 p-3">
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <i className="ri-download-2-line text-base" />
                                            <span>
                                                Downloads
                                            </span>
                                        </div>

                                        <p className="mt-1 text-sm font-semibold text-slate-900">
                                            {file.downloads ??
                                                0}
                                        </p>
                                    </div>

                                    <div className="rounded-xl bg-slate-50 p-3">
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <i className="ri-share-forward-line text-base" />
                                            <span>
                                                Shared
                                            </span>
                                        </div>

                                        <p className="mt-1 text-sm font-semibold text-slate-900">
                                            {file.shares ??
                                                0}
                                        </p>
                                    </div>
                                </div>

                                {/* File Information */}
                                <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <i className="ri-lock-line text-base" />

                                        <span>
                                            {file.password
                                                ? "Protected"
                                                : "No Password"}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <i className="ri-calendar-line text-base" />

                                        <span>
                                            {file.expiresAt
                                                ? `Expires: ${formatDate(
                                                    file.expiresAt
                                                )}`
                                                : "No Expiry"}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <i className="ri-time-line text-base" />

                                        <span>
                                            Uploaded:{" "}
                                            {formatDate(
                                                file.createdAt
                                            )}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <i className="ri-history-line text-base" />

                                        <span>
                                            Modified:{" "}
                                            {formatDate(
                                                file.updatedAt
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-14 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                            <i className="ri-file-search-line text-2xl text-slate-500" />
                        </div>

                        <h3 className="mt-4 text-sm font-semibold text-slate-900">
                            No Files Found
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                            {searchQuery
                                ? "No files match your current search."
                                : "This folder does not contain any files."}
                        </p>
                    </div>
                )}

                {/* Load More */}
                {files.length > 0 &&
                    pageNo <= totalPages && (
                        <div className="mt-6 flex justify-center">
                            <button
                                type="button"
                                onClick={() =>
                                    fetchFiles(false)
                                }
                                disabled={fetchLoading}
                                className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {fetchLoading ? (
                                    <i className="ri-loader-4-line animate-spin text-lg" />
                                ) : (
                                    <i className="ri-add-line text-lg" />
                                )}

                                <span>
                                    {fetchLoading
                                        ? "Loading..."
                                        : "Load More"}
                                </span>
                            </button>
                        </div>
                    )}

                {/* Upload Modal */}
                {addFileModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
                        <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
                            <div className="p-5 sm:p-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                                            <i className="ri-upload-2-line text-xl text-slate-700" />
                                        </div>

                                        <div>
                                            <p className="font-semibold text-slate-900">
                                                Add File
                                            </p>

                                            <p className="text-xs text-slate-500">
                                                Upload a file to your folder.
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={
                                            closeAddFileModal
                                        }
                                        disabled={loading}
                                        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
                                    >
                                        <i className="ri-close-line text-xl" />
                                    </button>
                                </div>

                                <div className="my-5 border-t border-slate-100" />

                                {!selectedFile ? (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                        className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 px-5 py-10 transition-all duration-200 hover:border-slate-400 hover:bg-slate-50"
                                    >
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                                            <i className="ri-upload-cloud-2-line text-2xl text-slate-600" />
                                        </div>

                                        <p className="mt-4 text-sm font-medium text-slate-900">
                                            Click to select file
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500">
                                            Maximum file size: 10 MB
                                        </p>
                                    </button>
                                ) : (
                                    <div className="space-y-5">
                                        {/* Selected file */}
                                        <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                                            <div className="flex min-w-0 items-center gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                                                    <i className="ri-file-3-line text-xl text-slate-600" />
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-medium text-slate-900">
                                                        {
                                                            selectedFile.name
                                                        }
                                                    </p>

                                                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                                                        <i className="ri-hard-drive-2-line" />

                                                        {formatFileSize(
                                                            selectedFile.size
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedFile(
                                                        null
                                                    );
                                                    setFileName("");

                                                    if (
                                                        fileInputRef.current
                                                    ) {
                                                        fileInputRef.current.value =
                                                            "";
                                                    }
                                                }}
                                                disabled={loading}
                                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                                            >
                                                <i className="ri-close-line text-lg" />
                                            </button>
                                        </div>

                                        {/* File Name */}
                                        <div>
                                            <p className="mb-2 text-sm font-medium text-slate-800">
                                                File Name
                                            </p>

                                            <div className="flex items-center rounded-xl border border-slate-200 transition focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-slate-100">
                                                <i className="ri-file-edit-line pl-3 text-lg text-slate-400" />

                                                <input
                                                    type="text"
                                                    value={
                                                        fileName
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        setFileName(
                                                            e
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    disabled={
                                                        loading
                                                    }
                                                    className="h-11 min-w-0 flex-1 bg-transparent px-3 text-sm text-slate-900 outline-none disabled:opacity-60"
                                                />

                                                <span className="pr-3 text-sm text-slate-400">
                                                    .
                                                    {getFileExtension(
                                                        selectedFile.name
                                                    )}
                                                </span>
                                            </div>

                                            <span className="mt-1.5 block text-xs text-slate-500">
                                                You can change only the file name. Extension cannot be modified.
                                            </span>
                                        </div>

                                        {/* Upload To */}
                                        <div>
                                            <p className="mb-2 text-sm font-medium text-slate-800">
                                                Upload To
                                            </p>

                                            <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                                                <div className="flex min-w-0 items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                                                        <i className="ri-folder-3-line text-xl text-slate-600" />
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-medium text-slate-900 capitalize">
                                                            {currentFolderName
                                                                ? currentFolderName : "Current Folder"
                                                            }
                                                        </p>

                                                        <p className="mt-1 text-xs text-slate-500">
                                                            Selected from current route
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    hidden
                                    onChange={
                                        handleFileSelection
                                    }
                                />

                                <div className="my-5 border-t border-slate-100" />

                                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                                    <button
                                        type="button"
                                        onClick={
                                            closeAddFileModal
                                        }
                                        disabled={loading}
                                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                                    >
                                        <i className="ri-close-line text-lg" />
                                        <span>
                                            Cancel
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={
                                            handleFileUpload
                                        }
                                        disabled={
                                            loading ||
                                            !selectedFile
                                        }
                                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {loading ? (
                                            <i className="ri-loader-4-line animate-spin text-lg" />
                                        ) : (
                                            <i className="ri-upload-2-line text-lg" />
                                        )}

                                        <span>
                                            {loading
                                                ? "Uploading..."
                                                : "Upload"}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Modal */}
                {editFileModal &&
                    selectedFile && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
                            <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
                                <div className="p-5 sm:p-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                                                <i className="ri-edit-line text-xl text-slate-700" />
                                            </div>

                                            <div>
                                                <p className="font-semibold text-slate-900">
                                                    Edit File
                                                </p>

                                                <p className="text-xs text-slate-500">
                                                    Update file details.
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={
                                                closeEditModal
                                            }
                                            disabled={
                                                editLoading
                                            }
                                            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 disabled:opacity-50"
                                        >
                                            <i className="ri-close-line text-xl" />
                                        </button>
                                    </div>

                                    <div className="my-5 border-t border-slate-100" />

                                    <div className="rounded-xl border border-slate-200 p-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                                                <i className="ri-file-3-line text-xl text-slate-600" />
                                            </div>

                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium text-slate-900">
                                                    {
                                                        selectedFile.fileName
                                                    }
                                                </p>

                                                <p className="mt-1 text-xs text-slate-500">
                                                    {formatFileSize(
                                                        selectedFile.fileSize
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-5 space-y-4">
                                        {/* Name */}
                                        <div>
                                            <p className="mb-2 text-sm font-medium text-slate-800">
                                                File Name
                                            </p>

                                            <div className="flex items-center rounded-xl border border-slate-200 focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-slate-100">
                                                <i className="ri-file-edit-line pl-3 text-lg text-slate-400" />

                                                <input
                                                    type="text"
                                                    value={
                                                        editFileName
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        setEditFileName(
                                                            e
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    disabled={
                                                        editLoading
                                                    }
                                                    className="h-11 min-w-0 flex-1 bg-transparent px-3 text-sm outline-none disabled:opacity-60"
                                                />

                                                <span className="pr-3 text-sm text-slate-400">
                                                    .
                                                    {getFileExtension(
                                                        selectedFile.fileName
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Password */}
                                        <div>
                                            <p className="mb-2 text-sm font-medium text-slate-800">
                                                Password
                                            </p>

                                            <div className="flex items-center rounded-xl border border-slate-200 focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-slate-100">
                                                <i className="ri-lock-password-line pl-3 text-lg text-slate-400" />

                                                <input
                                                    type="password"
                                                    value={
                                                        editPassword
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        setEditPassword(
                                                            e
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    disabled={
                                                        editLoading
                                                    }
                                                    placeholder="Enter password"
                                                    className="h-11 flex-1 bg-transparent px-3 text-sm outline-none disabled:opacity-60"
                                                />
                                            </div>

                                            <span className="mt-1.5 block text-xs text-slate-500">
                                                Leave unchanged if you do not want to update it.
                                            </span>
                                        </div>

                                        {/* Expiry */}
                                        <div>
                                            <p className="mb-2 text-sm font-medium text-slate-800">
                                                Expiry Date
                                            </p>

                                            <div className="flex items-center rounded-xl border border-slate-200 focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-slate-100">
                                                <i className="ri-calendar-line pl-3 text-lg text-slate-400" />

                                                <input
                                                    type="date"
                                                    value={
                                                        editExpiry
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        setEditExpiry(
                                                            e
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    disabled={
                                                        editLoading
                                                    }
                                                    className="h-11 flex-1 bg-transparent px-3 text-sm outline-none disabled:opacity-60"
                                                />
                                            </div>

                                            <span className="mt-1.5 block text-xs text-slate-500">
                                                Leave unchanged if you do not want to update it.
                                            </span>
                                        </div>
                                    </div>

                                    <div className="my-5 border-t border-slate-100" />

                                    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                                        <button
                                            type="button"
                                            onClick={
                                                closeEditModal
                                            }
                                            disabled={
                                                editLoading
                                            }
                                            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                                        >
                                            <i className="ri-close-line text-lg" />
                                            <span>
                                                Cancel
                                            </span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleEditFile(
                                                    selectedFile._id
                                                )
                                            }
                                            disabled={
                                                editLoading
                                            }
                                            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {editLoading ? (
                                                <i className="ri-loader-4-line animate-spin text-lg" />
                                            ) : (
                                                <i className="ri-save-line text-lg" />
                                            )}

                                            <span>
                                                {editLoading
                                                    ? "Saving..."
                                                    : "Save"}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                {/* Share Modal */}
                {shareFileModal &&
                    selectedFile && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
                            <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl">
                                <div className="p-5 sm:p-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                                                <i className="ri-share-line text-xl text-slate-700" />
                                            </div>

                                            <div>
                                                <p className="font-semibold text-slate-900">
                                                    Share File
                                                </p>

                                                <p className="text-xs text-slate-500">
                                                    Share this file with a registered user.
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShareFileModal(
                                                    false
                                                )
                                            }
                                            disabled={
                                                shareLoading
                                            }
                                            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 disabled:opacity-50"
                                        >
                                            <i className="ri-close-line text-xl" />
                                        </button>
                                    </div>

                                    <div className="my-5 border-t border-slate-100" />

                                    <div className="rounded-xl border border-slate-200 p-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                                                <i className="ri-file-3-line text-xl text-slate-600" />
                                            </div>

                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium text-slate-900">
                                                    {
                                                        selectedFile.fileName
                                                    }
                                                </p>

                                                <p className="mt-1 text-xs text-slate-500">
                                                    {formatFileSize(
                                                        selectedFile.fileSize
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-5">
                                        <p className="mb-2 text-sm font-medium text-slate-800">
                                            Recipient Email
                                        </p>

                                        <div className="flex items-center rounded-xl border border-slate-200 focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-slate-100">
                                            <i className="ri-mail-line pl-3 text-lg text-slate-400" />

                                            <input
                                                type="email"
                                                value={
                                                    userEmail
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    setUserEmail(
                                                        e
                                                            .target
                                                            .value
                                                    )
                                                }
                                                disabled={
                                                    shareLoading
                                                }
                                                placeholder="Enter recipient email"
                                                className="h-11 flex-1 bg-transparent px-3 text-sm outline-none disabled:opacity-60"
                                            />
                                        </div>

                                        <span className="mt-1.5 block text-xs text-slate-500">
                                            Recipient must already be registered on the platform.
                                        </span>
                                    </div>

                                    <div className="my-5 border-t border-slate-100" />

                                    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShareFileModal(
                                                    false
                                                )
                                            }
                                            disabled={
                                                shareLoading
                                            }
                                            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                                        >
                                            <i className="ri-close-line text-lg" />
                                            <span>
                                                Cancel
                                            </span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleFileShare(
                                                    selectedFile._id
                                                )
                                            }
                                            disabled={
                                                shareLoading
                                            }
                                            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {shareLoading ? (
                                                <i className="ri-loader-4-line animate-spin text-lg" />
                                            ) : (
                                                <i className="ri-share-line text-lg" />
                                            )}

                                            <span>
                                                {shareLoading
                                                    ? "Sharing..."
                                                    : "Share"}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                {/* Move File Modal */}
                {moveFileModal &&
                    selectedFile && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
                            <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl">
                                <div className="p-5 sm:p-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                                                <i className="ri-folder-transfer-line text-xl text-slate-700" />
                                            </div>

                                            <div>
                                                <p className="font-semibold text-slate-900">
                                                    Move File
                                                </p>

                                                <p className="text-xs text-slate-500">
                                                    Choose destination folder.
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setMoveFileModal(
                                                    false
                                                )
                                            }
                                            disabled={
                                                moveLoading
                                            }
                                            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 disabled:opacity-50"
                                        >
                                            <i className="ri-close-line text-xl" />
                                        </button>
                                    </div>

                                    <div className="my-5 border-t border-slate-100" />

                                    <div className="rounded-xl border border-slate-200 p-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                                                <i className="ri-file-3-line text-xl text-slate-600" />
                                            </div>

                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium text-slate-900">
                                                    {
                                                        selectedFile.fileName
                                                    }
                                                </p>

                                                <p className="mt-1 text-xs text-slate-500">
                                                    {formatFileSize(
                                                        selectedFile.fileSize
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-5 space-y-4">
                                        <div>
                                            <p className="mb-2 text-sm font-medium text-slate-800">
                                                Current Folder
                                            </p>

                                            <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                                                    <i className="ri-folder-3-line text-xl text-slate-600" />
                                                </div>

                                                <p className="text-sm text-slate-700 capitalize">
                                                    {currentFolderName ? currentFolderName : "-"}
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="mb-2 text-sm font-medium text-slate-800">
                                                Move To
                                            </p>

                                            <button
                                                type="button"
                                                onClick={
                                                    openSelectFolderModal
                                                }
                                                disabled={
                                                    moveLoading
                                                }
                                                className="flex w-full items-center justify-between rounded-xl border border-slate-200 p-3 text-left transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-60"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                                                        <i className="ri-folder-open-line text-xl text-slate-600" />
                                                    </div>

                                                    <div>
                                                        <p className="text-sm font-medium text-slate-800 capitalize">
                                                            {selectedFolderName ? selectedFolderName : "Select Folder"}
                                                        </p>

                                                        <p className="mt-1 text-xs text-slate-500">
                                                            Choose a destination folder
                                                        </p>
                                                    </div>
                                                </div>

                                                <i className="ri-arrow-right-s-line text-xl text-slate-400" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="my-5 border-t border-slate-100" />

                                    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setMoveFileModal(
                                                    false
                                                )
                                            }
                                            disabled={
                                                moveLoading
                                            }
                                            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                                        >
                                            <i className="ri-close-line text-lg" />
                                            <span>
                                                Cancel
                                            </span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleMoveFile(
                                                    selectedFile._id
                                                )
                                            }
                                            disabled={
                                                moveLoading ||
                                                !moveFolderId ||
                                                moveFolderId ===
                                                folderId
                                            }
                                            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {moveLoading ? (
                                                <i className="ri-loader-4-line animate-spin text-lg" />
                                            ) : (
                                                <i className="ri-folder-transfer-line text-lg" />
                                            )}

                                            <span>
                                                {moveLoading
                                                    ? "Moving..."
                                                    : "Move"}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                {/* Select Folder Modal */}
                {selectFolderModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
                        <div className="flex max-h-[90vh] w-full max-w-xl flex-col rounded-2xl bg-white shadow-2xl">
                            <div className="p-5 sm:p-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                                            <i className="ri-folder-3-line text-xl text-slate-700" />
                                        </div>

                                        <div>
                                            <p className="font-semibold text-slate-900">
                                                Select Folder
                                            </p>

                                            <p className="text-xs text-slate-500">
                                                Choose where you want to move the file.
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSelectFolderModal(
                                                false
                                            )
                                        }
                                        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100"
                                    >
                                        <i className="ri-close-line text-xl" />
                                    </button>
                                </div>

                                <div className="my-5 border-t border-slate-100" />

                                <div className="relative">
                                    <i className="ri-search-line pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg text-slate-400" />

                                    <input
                                        type="text"
                                        value={
                                            folderSearchQuery
                                        }
                                        onChange={(e) =>
                                            setFolderSearchQuery(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Search folder..."
                                        className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                                    />
                                </div>
                            </div>

                            <div className="min-h-0 flex-1 overflow-y-auto px-5 sm:px-6">
                                <div className="space-y-2">
                                    {filteredFolders.map(
                                        (folder) => {
                                            const isCurrent =
                                                folder._id ===
                                                folderId;

                                            const isSelected =
                                                moveFolderId ===
                                                folder._id;

                                            return (
                                                <button
                                                    type="button"
                                                    key={folder._id}
                                                    disabled={isCurrent}
                                                    onClick={() => {
                                                        setMoveFolderId(folder._id),
                                                            setSelectedFolderName(folder.name),
                                                            setSelectFolderModal(false)
                                                    }}
                                                    className={`flex w-full items-center  capitalize justify-between rounded-xl border p-3 text-left transition-all duration-200 ${isCurrent
                                                        ? "cursor-not-allowed border-slate-200 bg-slate-50 opacity-50"
                                                        : isSelected
                                                            ? "border-slate-900 bg-slate-50"
                                                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                                        }`}
                                                >
                                                    <div className="flex min-w-0 items-center gap-3">
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                                                            <i className="ri-folder-3-fill text-xl text-slate-500" />
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="truncate text-sm font-medium text-slate-800">
                                                                {
                                                                    folder.name
                                                                }
                                                            </p>

                                                            <p className="mt-1 text-xs text-slate-500">
                                                                {folder.totalFiles ??
                                                                    0}{" "}
                                                                files
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="ml-2 flex shrink-0 items-center gap-2">
                                                        {isCurrent && (
                                                            <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-500">
                                                                Current
                                                            </span>
                                                        )}

                                                        {isSelected &&
                                                            !isCurrent && (
                                                                <i className="ri-check-line text-lg text-slate-900" />
                                                            )}
                                                    </div>
                                                </button>
                                            );
                                        }
                                    )}

                                    {filteredFolders.length ===
                                        0 && (
                                            <div className="py-10 text-center">
                                                <i className="ri-folder-search-line text-3xl text-slate-300" />

                                                <p className="mt-2 text-sm font-medium text-slate-700">
                                                    No folders found
                                                </p>
                                            </div>
                                        )}
                                </div>

                                {folderPageNo <=
                                    folderTotalPages && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                fetchFolders(
                                                    false
                                                )
                                            }
                                            disabled={
                                                folderLoading
                                            }
                                            className="mx-auto my-4 flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {folderLoading ? (
                                                <i className="ri-loader-4-line animate-spin text-lg" />
                                            ) : (
                                                <i className="ri-add-line text-lg" />
                                            )}

                                            <span>
                                                {folderLoading
                                                    ? "Loading..."
                                                    : "Load More"}
                                            </span>
                                        </button>
                                    )}
                            </div>

                            <div className="p-5 sm:p-6">
                                <div className="border-t border-slate-100 pt-4">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSelectFolderModal(
                                                false
                                            )
                                        }
                                        className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                    >
                                        <i className="ri-close-line text-lg" />
                                        <span>
                                            Close
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Modal */}
                {deleteFileModal &&
                    selectedFile && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
                            <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">
                                        <i className="ri-delete-bin-line text-xl text-red-600" />
                                    </div>

                                    <p className="text-base font-semibold text-slate-900">
                                        Delete File
                                    </p>
                                </div>

                                <p className="mt-4 text-sm leading-6 text-slate-500">
                                    Are you sure you want to
                                    delete{" "}
                                    <span className="font-medium text-slate-800">
                                        {
                                            selectedFile.fileName
                                        }
                                    </span>
                                    ?
                                </p>

                                <div className="my-5 border-t border-slate-100" />

                                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setDeleteFileModal(
                                                false
                                            )
                                        }
                                        disabled={
                                            deleteLoading
                                        }
                                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                                    >
                                        <i className="ri-close-line text-lg" />
                                        <span>
                                            Cancel
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleFileDelete(
                                                selectedFile._id
                                            )
                                        }
                                        disabled={
                                            deleteLoading
                                        }
                                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {deleteLoading ? (
                                            <i className="ri-loader-4-line animate-spin text-lg" />
                                        ) : (
                                            <i className="ri-delete-bin-line text-lg" />
                                        )}

                                        <span>
                                            {deleteLoading
                                                ? "Deleting..."
                                                : "Confirm"}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
            </div>
        </section>
    );
};

export default Files;
