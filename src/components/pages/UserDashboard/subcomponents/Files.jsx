import React, { useMemo, useRef, useState } from "react";

/* =========================================================
   CONFIG
========================================================= */

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const FILES_PER_PAGE = 6;
const FOLDERS_PER_PAGE = 10;

const CURRENT_USER_EMAIL = "owner@example.com";

/* =========================================================
   DEMO REGISTERED USERS
========================================================= */

const REGISTERED_USERS = [
    "john@example.com",
    "sarah@example.com",
    "alex@example.com",
    "michael@example.com",
];

/* =========================================================
   DEMO FOLDERS
========================================================= */

const INITIAL_FOLDERS = [
    {
        id: 1,
        name: "My Documents",
        color: "blue",
        updatedAt: "2026-08-24T14:20:00",
    },
    {
        id: 2,
        name: "Work Projects",
        color: "purple",
        updatedAt: "2026-08-23T12:30:00",
    },
    {
        id: 3,
        name: "Personal",
        color: "green",
        updatedAt: "2026-08-21T10:15:00",
    },
    {
        id: 4,
        name: "Design Assets",
        color: "pink",
        updatedAt: "2026-08-20T16:45:00",
    },
    {
        id: 5,
        name: "Marketing",
        color: "rose",
        updatedAt: "2026-08-18T09:30:00",
    },
    {
        id: 6,
        name: "Invoices",
        color: "blue",
        updatedAt: "2026-08-17T11:20:00",
    },
    {
        id: 7,
        name: "Presentations",
        color: "purple",
        updatedAt: "2026-08-16T15:40:00",
    },
    {
        id: 8,
        name: "Videos",
        color: "pink",
        updatedAt: "2026-08-15T13:10:00",
    },
    {
        id: 9,
        name: "Archives",
        color: "green",
        updatedAt: "2026-08-14T08:50:00",
    },
    {
        id: 10,
        name: "Shared Files",
        color: "rose",
        updatedAt: "2026-08-13T17:25:00",
    },
    {
        id: 11,
        name: "Clients",
        color: "blue",
        updatedAt: "2026-08-12T14:35:00",
    },
    {
        id: 12,
        name: "Resources",
        color: "purple",
        updatedAt: "2026-08-10T10:20:00",
    },
];

/* =========================================================
   DEMO FILES
========================================================= */

const INITIAL_FILES = [
    {
        id: 1,
        name: "Project Proposal.pdf",
        fileName: "Project Proposal",
        extension: ".pdf",
        type: "PDF",
        size: 2.5 * 1024 * 1024,
        uploadedAt: "2026-08-18T10:30:00",
        updatedAt: "2026-08-24T14:20:00",
        downloads: 42,
        shares: 8,
        expiryDate: "2026-09-30",
        password: true,
        folderId: 1,
    },
    {
        id: 2,
        name: "Brand Guidelines.fig",
        fileName: "Brand Guidelines",
        extension: ".fig",
        type: "FIG",
        size: 8.2 * 1024 * 1024,
        uploadedAt: "2026-08-16T09:15:00",
        updatedAt: "2026-08-23T11:40:00",
        downloads: 27,
        shares: 5,
        expiryDate: null,
        password: false,
        folderId: 4,
    },
    {
        id: 3,
        name: "Invoice August.xlsx",
        fileName: "Invoice August",
        extension: ".xlsx",
        type: "XLSX",
        size: 1.8 * 1024 * 1024,
        uploadedAt: "2026-08-14T16:45:00",
        updatedAt: "2026-08-21T18:10:00",
        downloads: 19,
        shares: 3,
        expiryDate: "2026-12-31",
        password: true,
        folderId: 1,
    },
    {
        id: 4,
        name: "Product Demo.mp4",
        fileName: "Product Demo",
        extension: ".mp4",
        type: "MP4",
        size: 48.6 * 1024 * 1024,
        uploadedAt: "2026-08-10T12:20:00",
        updatedAt: "2026-08-20T15:30:00",
        downloads: 63,
        shares: 14,
        expiryDate: null,
        password: false,
        folderId: 2,
    },
    {
        id: 5,
        name: "Meeting Notes.docx",
        fileName: "Meeting Notes",
        extension: ".docx",
        type: "DOCX",
        size: 780 * 1024,
        uploadedAt: "2026-08-06T08:00:00",
        updatedAt: "2026-08-18T13:25:00",
        downloads: 11,
        shares: 2,
        expiryDate: "2026-10-15",
        password: false,
        folderId: 2,
    },
    {
        id: 6,
        name: "Profile Photo.jpg",
        fileName: "Profile Photo",
        extension: ".jpg",
        type: "JPG",
        size: 3.4 * 1024 * 1024,
        uploadedAt: "2026-08-02T11:30:00",
        updatedAt: "2026-08-15T09:45:00",
        downloads: 31,
        shares: 7,
        expiryDate: null,
        password: false,
        folderId: 3,
    },
    {
        id: 7,
        name: "Presentation.pptx",
        fileName: "Presentation",
        extension: ".pptx",
        type: "PPTX",
        size: 5.7 * 1024 * 1024,
        uploadedAt: "2026-07-28T14:00:00",
        updatedAt: "2026-08-11T16:15:00",
        downloads: 22,
        shares: 4,
        expiryDate: null,
        password: true,
        folderId: 2,
    },
    {
        id: 8,
        name: "Logo Pack.zip",
        fileName: "Logo Pack",
        extension: ".zip",
        type: "ZIP",
        size: 12.4 * 1024 * 1024,
        uploadedAt: "2026-07-21T10:10:00",
        updatedAt: "2026-08-07T12:00:00",
        downloads: 38,
        shares: 9,
        expiryDate: "2026-11-20",
        password: true,
        folderId: 4,
    },
];

/* =========================================================
   FILE TYPE STYLES
========================================================= */

const FILE_STYLES = {
    PDF: {
        bg: "bg-red-50",
        text: "text-red-500",
        border: "border-red-100",
        icon: "ri-file-pdf-2-fill",
    },
    DOC: {
        bg: "bg-blue-50",
        text: "text-blue-500",
        border: "border-blue-100",
        icon: "ri-file-word-2-fill",
    },
    DOCX: {
        bg: "bg-blue-50",
        text: "text-blue-500",
        border: "border-blue-100",
        icon: "ri-file-word-2-fill",
    },
    XLS: {
        bg: "bg-emerald-50",
        text: "text-emerald-500",
        border: "border-emerald-100",
        icon: "ri-file-excel-2-fill",
    },
    XLSX: {
        bg: "bg-emerald-50",
        text: "text-emerald-500",
        border: "border-emerald-100",
        icon: "ri-file-excel-2-fill",
    },
    PPT: {
        bg: "bg-orange-50",
        text: "text-orange-500",
        border: "border-orange-100",
        icon: "ri-file-ppt-2-fill",
    },
    PPTX: {
        bg: "bg-orange-50",
        text: "text-orange-500",
        border: "border-orange-100",
        icon: "ri-file-ppt-2-fill",
    },
    JPG: {
        bg: "bg-purple-50",
        text: "text-purple-500",
        border: "border-purple-100",
        icon: "ri-image-2-fill",
    },
    JPEG: {
        bg: "bg-purple-50",
        text: "text-purple-500",
        border: "border-purple-100",
        icon: "ri-image-2-fill",
    },
    PNG: {
        bg: "bg-purple-50",
        text: "text-purple-500",
        border: "border-purple-100",
        icon: "ri-image-2-fill",
    },
    GIF: {
        bg: "bg-purple-50",
        text: "text-purple-500",
        border: "border-purple-100",
        icon: "ri-image-2-fill",
    },
    SVG: {
        bg: "bg-violet-50",
        text: "text-violet-500",
        border: "border-violet-100",
        icon: "ri-shapes-fill",
    },
    FIG: {
        bg: "bg-violet-50",
        text: "text-violet-500",
        border: "border-violet-100",
        icon: "ri-paint-brush-fill",
    },
    MP4: {
        bg: "bg-pink-50",
        text: "text-pink-500",
        border: "border-pink-100",
        icon: "ri-video-fill",
    },
    MOV: {
        bg: "bg-pink-50",
        text: "text-pink-500",
        border: "border-pink-100",
        icon: "ri-video-fill",
    },
    ZIP: {
        bg: "bg-amber-50",
        text: "text-amber-500",
        border: "border-amber-100",
        icon: "ri-file-zip-fill",
    },
    RAR: {
        bg: "bg-amber-50",
        text: "text-amber-500",
        border: "border-amber-100",
        icon: "ri-file-zip-fill",
    },
    DEFAULT: {
        bg: "bg-slate-100",
        text: "text-slate-500",
        border: "border-slate-200",
        icon: "ri-file-3-fill",
    },
};

/* =========================================================
   FOLDER COLOR STYLES
========================================================= */

const FOLDER_COLORS = {
    blue: {
        bg: "bg-blue-50",
        text: "text-blue-500",
        dot: "bg-blue-500",
    },
    rose: {
        bg: "bg-rose-50",
        text: "text-rose-500",
        dot: "bg-rose-500",
    },
    green: {
        bg: "bg-emerald-50",
        text: "text-emerald-500",
        dot: "bg-emerald-500",
    },
    purple: {
        bg: "bg-purple-50",
        text: "text-purple-500",
        dot: "bg-purple-500",
    },
    pink: {
        bg: "bg-pink-50",
        text: "text-pink-500",
        dot: "bg-pink-500",
    },
};

/* =========================================================
   HELPERS
========================================================= */

const getFileStyle = (type) => {
    return FILE_STYLES[type] || FILE_STYLES.DEFAULT;
};

const getFolderStyle = (color) => {
    return FOLDER_COLORS[color] || FOLDER_COLORS.blue;
};

const formatDate = (date) => {
    if (!date) return "—";

    return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(date));
};

const formatFileSize = (bytes) => {
    if (bytes < 1024) {
        return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getFileExtension = (fileName) => {
    const lastDot = fileName.lastIndexOf(".");

    if (lastDot <= 0) {
        return "";
    }

    return fileName.slice(lastDot).toLowerCase();
};

const getFileNameWithoutExtension = (fileName) => {
    const lastDot = fileName.lastIndexOf(".");

    if (lastDot <= 0) {
        return fileName;
    }

    return fileName.slice(0, lastDot);
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function Files() {
    /* ---------------- DATA ---------------- */

    const [files, setFiles] = useState(INITIAL_FILES);
    const [folders, setFolders] = useState(INITIAL_FOLDERS);

    /* ---------------- LIST STATE ---------------- */

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("latest");
    const [sortOpen, setSortOpen] = useState(false);

    const [page, setPage] = useState(1);

    /* ---------------- MENU ---------------- */

    const [menuId, setMenuId] = useState(null);

    /* ---------------- MODALS ---------------- */

    const [modal, setModal] = useState(null);

    const [selectedFile, setSelectedFile] = useState(null);

    /* ---------------- TOAST ---------------- */

    const [toast, setToast] = useState(null);

    /* ---------------- EDIT ---------------- */

    const [editFileName, setEditFileName] = useState("");
    const [editError, setEditError] = useState("");
    const [editLoading, setEditLoading] = useState(false);

    /* ---------------- SHARE ---------------- */

    const [recipientEmail, setRecipientEmail] = useState("");
    const [sharePassword, setSharePassword] = useState("");
    const [shareExpiry, setShareExpiry] = useState("");
    const [shareError, setShareError] = useState("");
    const [shareLoading, setShareLoading] = useState(false);

    /* ---------------- DELETE ---------------- */

    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    /* ---------------- MOVE ---------------- */

    const [moveError, setMoveError] = useState("");
    const [moveLoading, setMoveLoading] = useState(false);
    const [selectedDestination, setSelectedDestination] =
        useState(null);

    const [folderPickerOpen, setFolderPickerOpen] =
        useState(false);

    const [folderSearch, setFolderSearch] = useState("");
    const [folderPage, setFolderPage] = useState(1);

    /* ---------------- ADD FILE ---------------- */

    const fileInputRef = useRef(null);

    const [uploadFile, setUploadFile] = useState(null);
    const [uploadFileName, setUploadFileName] = useState("");
    const [uploadExtension, setUploadExtension] = useState("");
    const [uploadFolderId, setUploadFolderId] = useState(
        INITIAL_FOLDERS[0]?.id || null
    );

    const [uploadError, setUploadError] = useState("");
    const [uploadLoading, setUploadLoading] = useState(false);

    /* =========================================================
       SIMULATE INITIAL LOADING
    ========================================================= */

    if (loading) {
        setTimeout(() => {
            setLoading(false);
        }, 700);
    }

    /* =========================================================
       FILTERED FILES
    ========================================================= */

    const filteredFiles = useMemo(() => {
        const query = search.trim().toLowerCase();

        const result = files.filter((file) => {
            if (!query) return true;

            return (
                file.name.toLowerCase().includes(query) ||
                file.fileName.toLowerCase().includes(query) ||
                file.extension.toLowerCase().includes(query) ||
                file.type.toLowerCase().includes(query)
            );
        });

        return [...result].sort((a, b) => {
            if (sortBy === "oldest") {
                return (
                    new Date(a.uploadedAt) -
                    new Date(b.uploadedAt)
                );
            }

            return (
                new Date(b.uploadedAt) -
                new Date(a.uploadedAt)
            );
        });
    }, [files, search, sortBy]);

    /* =========================================================
       FILE PAGINATION
    ========================================================= */

    const totalPages = Math.max(
        1,
        Math.ceil(filteredFiles.length / FILES_PER_PAGE)
    );

    const visibleFiles = filteredFiles.slice(
        (page - 1) * FILES_PER_PAGE,
        page * FILES_PER_PAGE
    );

    /* =========================================================
       FOLDER SEARCH
    ========================================================= */

    const filteredFolders = useMemo(() => {
        const query = folderSearch.trim().toLowerCase();

        if (!query) {
            return folders;
        }

        return folders.filter((folder) =>
            folder.name.toLowerCase().includes(query)
        );
    }, [folders, folderSearch]);

    const folderTotalPages = Math.max(
        1,
        Math.ceil(
            filteredFolders.length / FOLDERS_PER_PAGE
        )
    );

    const visibleFolders = filteredFolders.slice(
        (folderPage - 1) * FOLDERS_PER_PAGE,
        folderPage * FOLDERS_PER_PAGE
    );

    /* =========================================================
       TOAST
    ========================================================= */

    const showToast = (message, type = "success") => {
        setToast({
            message,
            type,
        });

        setTimeout(() => {
            setToast(null);
        }, 2800);
    };

    /* =========================================================
       SEARCH
    ========================================================= */

    const handleSearch = (value) => {
        setSearch(value);
        setPage(1);
    };

    /* =========================================================
       SORT
    ========================================================= */

    const handleSort = (value) => {
        setSortBy(value);
        setSortOpen(false);
        setPage(1);
    };

    /* =========================================================
       GET FOLDER
    ========================================================= */

    const getFolder = (folderId) => {
        return folders.find(
            (folder) => folder.id === folderId
        );
    };

    /* =========================================================
       OPEN ADD FILE
    ========================================================= */

    const openAddFileModal = () => {
        setUploadFile(null);
        setUploadFileName("");
        setUploadExtension("");
        setUploadError("");
        setUploadLoading(false);

        setUploadFolderId(
            folders[0]?.id || null
        );

        setModal("add");
    };

    /* =========================================================
       SELECT FILE FROM DEVICE
    ========================================================= */

    const handleFileSelect = (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        setUploadError("");

        if (file.size > MAX_FILE_SIZE) {
            setUploadFile(null);
            setUploadFileName("");
            setUploadExtension("");

            setUploadError(
                "File size must not exceed 10 MB."
            );

            event.target.value = "";
            return;
        }

        const extension = getFileExtension(file.name);

        const fileName = getFileNameWithoutExtension(
            file.name
        );

        setUploadFile(file);
        setUploadFileName(fileName);
        setUploadExtension(extension);
    };

    /* =========================================================
       ADD FILE
    ========================================================= */

    const handleAddFile = async () => {
        if (!uploadFile) {
            setUploadError("Please select a file.");
            return;
        }

        if (!uploadFileName.trim()) {
            setUploadError("Please enter a file name.");
            return;
        }

        if (!uploadFolderId) {
            setUploadError("Please select a folder.");
            return;
        }

        if (uploadFile.size > MAX_FILE_SIZE) {
            setUploadError(
                "File size must not exceed 10 MB."
            );
            return;
        }

        const cleanName = uploadFileName.trim();

        const finalName = `${cleanName}${uploadExtension}`;

        const duplicate = files.some(
            (file) =>
                file.folderId === uploadFolderId &&
                file.name.toLowerCase() ===
                finalName.toLowerCase()
        );

        if (duplicate) {
            setUploadError(
                "A file with this name already exists in this folder."
            );
            return;
        }

        setUploadLoading(true);
        setUploadError("");

        try {
            /*
             * Replace this simulated request with your upload API.
             *
             * Example:
             *
             * const formData = new FormData();
             * formData.append("file", uploadFile);
             * formData.append("fileName", cleanName);
             * formData.append("folderId", uploadFolderId);
             *
             * await uploadFileApi(formData);
             */

            await new Promise((resolve) =>
                setTimeout(resolve, 1000)
            );

            const now = new Date().toISOString();

            const newFile = {
                id: Date.now(),
                name: finalName,
                fileName: cleanName,
                extension: uploadExtension,
                type: uploadExtension
                    .replace(".", "")
                    .toUpperCase(),
                size: uploadFile.size,
                uploadedAt: now,
                updatedAt: now,
                downloads: 0,
                shares: 0,
                expiryDate: null,
                password: false,
                folderId: uploadFolderId,
            };

            setFiles((prev) => [
                newFile,
                ...prev,
            ]);

            setPage(1);

            setModal(null);

            showToast(
                "File uploaded successfully."
            );
        } catch (error) {
            setUploadError(
                "Unable to upload the file. Please try again."
            );
        } finally {
            setUploadLoading(false);
        }
    };

    /* =========================================================
       OPEN EDIT
    ========================================================= */

    const openEditModal = (file) => {
        setSelectedFile(file);

        setEditFileName(file.fileName);
        setEditError("");
        setEditLoading(false);

        setMenuId(null);
        setModal("edit");
    };

    /* =========================================================
       RENAME FILE
    ========================================================= */

    const handleRename = async () => {
        if (!selectedFile) return;

        const cleanName = editFileName.trim();

        if (!cleanName) {
            setEditError(
                "File name cannot be empty."
            );
            return;
        }

        const duplicate = files.some(
            (file) =>
                file.id !== selectedFile.id &&
                file.folderId === selectedFile.folderId &&
                file.name.toLowerCase() ===
                `${cleanName}${selectedFile.extension}`.toLowerCase()
        );

        if (duplicate) {
            setEditError(
                "A file with this name already exists in this folder."
            );
            return;
        }

        setEditLoading(true);
        setEditError("");

        try {
            /*
             * Replace with your rename API.
             */

            await new Promise((resolve) =>
                setTimeout(resolve, 700)
            );

            const newFullName = `${cleanName}${selectedFile.extension}`;

            setFiles((prev) =>
                prev.map((file) =>
                    file.id === selectedFile.id
                        ? {
                            ...file,
                            fileName: cleanName,
                            name: newFullName,
                            updatedAt:
                                new Date().toISOString(),
                        }
                        : file
                )
            );

            setModal(null);
            setSelectedFile(null);

            showToast(
                "File renamed successfully."
            );
        } catch (error) {
            setEditError(
                "Unable to rename the file."
            );
        } finally {
            setEditLoading(false);
        }
    };

    /* =========================================================
       OPEN SHARE
    ========================================================= */

    const openShareModal = (file) => {
        setSelectedFile(file);

        setRecipientEmail("");
        setSharePassword("");
        setShareExpiry("");
        setShareError("");
        setShareLoading(false);

        setMenuId(null);
        setModal("share");
    };

    /* =========================================================
       SHARE FILE
    ========================================================= */

    const handleShare = async () => {
        if (!selectedFile) return;

        const email =
            recipientEmail.trim().toLowerCase();

        if (!email) {
            setShareError(
                "Please enter recipient email."
            );
            return;
        }

        if (
            email ===
            CURRENT_USER_EMAIL.toLowerCase()
        ) {
            setShareError(
                "You cannot share a file with your own email."
            );
            return;
        }

        const registered = REGISTERED_USERS.some(
            (user) =>
                user.toLowerCase() === email
        );

        if (!registered) {
            setShareError(
                "This email is not registered on the platform."
            );
            return;
        }

        setShareLoading(true);
        setShareError("");

        try {
            /*
             * Replace with your share API.
             */

            await new Promise((resolve) =>
                setTimeout(resolve, 900)
            );

            setFiles((prev) =>
                prev.map((file) =>
                    file.id === selectedFile.id
                        ? {
                            ...file,
                            shares: file.shares + 1,
                            updatedAt:
                                new Date().toISOString(),
                        }
                        : file
                )
            );

            setModal(null);
            setSelectedFile(null);

            showToast(
                "File shared successfully."
            );
        } catch (error) {
            setShareError(
                "Unable to share the file."
            );
        } finally {
            setShareLoading(false);
        }
    };

    /* =========================================================
       OPEN DELETE
    ========================================================= */

    const openDeleteModal = (file) => {
        setSelectedFile(file);

        setDeleteError("");
        setDeleteLoading(false);

        setMenuId(null);
        setModal("delete");
    };

    /* =========================================================
       DELETE FILE
    ========================================================= */

    const handleDelete = async () => {
        if (!selectedFile) return;

        setDeleteLoading(true);
        setDeleteError("");

        try {
            /*
             * Replace with your delete API.
             */

            await new Promise((resolve) =>
                setTimeout(resolve, 900)
            );

            setFiles((prev) =>
                prev.filter(
                    (file) =>
                        file.id !== selectedFile.id
                )
            );

            setModal(null);
            setSelectedFile(null);

            const remaining =
                filteredFiles.length - 1;

            const newTotalPages = Math.max(
                1,
                Math.ceil(
                    remaining / FILES_PER_PAGE
                )
            );

            setPage((current) =>
                Math.min(
                    current,
                    newTotalPages
                )
            );

            showToast(
                "File deleted successfully."
            );
        } catch (error) {
            setDeleteError(
                "Unable to delete the file."
            );
        } finally {
            setDeleteLoading(false);
        }
    };

    /* =========================================================
       OPEN MOVE
    ========================================================= */

    const openMoveModal = (file) => {
        setSelectedFile(file);

        setSelectedDestination(null);
        setMoveError("");
        setMoveLoading(false);

        setFolderPickerOpen(false);

        setFolderSearch("");
        setFolderPage(1);

        setMenuId(null);
        setModal("move");
    };

    /* =========================================================
       OPEN FOLDER PICKER
    ========================================================= */

    const openFolderPicker = () => {
        setFolderPickerOpen(true);

        setFolderSearch("");
        setFolderPage(1);
    };

    /* =========================================================
       SEARCH FOLDERS
    ========================================================= */

    const handleFolderSearch = (value) => {
        setFolderSearch(value);
        setFolderPage(1);
    };

    /* =========================================================
       SELECT DESTINATION
    ========================================================= */

    const handleDestinationSelect = (
        folder
    ) => {
        if (
            folder.id ===
            selectedFile?.folderId
        ) {
            setMoveError(
                "This file is already inside this folder."
            );

            return;
        }

        setSelectedDestination(folder);

        setMoveError("");
        setFolderPickerOpen(false);
    };

    /* =========================================================
       MOVE FILE
    ========================================================= */

    const handleMove = async () => {
        if (!selectedFile) return;

        if (!selectedDestination) {
            setMoveError(
                "Please select a destination folder."
            );

            return;
        }

        if (
            selectedDestination.id ===
            selectedFile.folderId
        ) {
            setMoveError(
                "This file is already inside the selected folder."
            );

            return;
        }

        const duplicate = files.some(
            (file) =>
                file.id !== selectedFile.id &&
                file.folderId ===
                selectedDestination.id &&
                file.name.toLowerCase() ===
                selectedFile.name.toLowerCase()
        );

        if (duplicate) {
            setMoveError(
                "A file with the same name already exists in the destination folder."
            );

            return;
        }

        setMoveLoading(true);
        setMoveError("");

        try {
            /*
             * Replace with your move API.
             */

            await new Promise((resolve) =>
                setTimeout(resolve, 900)
            );

            setFiles((prev) =>
                prev.map((file) =>
                    file.id === selectedFile.id
                        ? {
                            ...file,
                            folderId:
                                selectedDestination.id,
                            updatedAt:
                                new Date().toISOString(),
                        }
                        : file
                )
            );

            setModal(null);
            setSelectedFile(null);
            setSelectedDestination(null);

            showToast(
                `File moved to ${selectedDestination.name}.`
            );
        } catch (error) {
            setMoveError(
                "Unable to move the file."
            );
        } finally {
            setMoveLoading(false);
        }
    };

    /* =========================================================
       LOADING STATE
    ========================================================= */

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-7xl">
                    <FilesSkeleton />
                </div>
            </div>
        );
    }

    /* =========================================================
       MAIN UI
    ========================================================= */

    return (

        <div className="bg-slate-50 pt-[90px] pb-5 min-h-dvh">

            <div className="mx-auto px-3 md:px-[5%]">

                <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                    <div>

                        {/* <div className="mb-2 flex items-center gap-2">

                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm shadow-blue-200">
                                <i className="ri-file-list-3-fill" />
                            </span>

                            <span className="text-sm font-medium text-blue-600">
                                File Manager
                            </span>

                        </div> */}

                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                            Files
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Manage, upload, share and organize
                            your files.
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={openAddFileModal}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-blue-600/30 active:translate-y-0 cursor-pointer"
                    >
                        <i className="ri-add-line text-lg" />
                        Add Files
                    </button>

                </div>

                <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row">

                    <div className="relative flex-1">

                        <i className="ri-search-line pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400" />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) =>
                                handleSearch(
                                    e.target.value
                                )
                            }
                            placeholder="Search files..."
                            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-10 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                        />

                        {search && (
                            <button
                                type="button"
                                onClick={() =>
                                    handleSearch("")
                                }
                                className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-200 hover:text-slate-600"
                            >
                                <i className="ri-close-line" />
                            </button>
                        )}
                    </div>

                    {/* SORT */}

                    <div className="relative sm:w-48">
                        <button
                            type="button"
                            onClick={() =>
                                setSortOpen(
                                    (prev) => !prev
                                )
                            }
                            className="flex h-11 w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50/50"
                        >
                            <span className="flex items-center gap-2">
                                <i className="ri-sort-desc text-lg text-blue-600" />

                                {sortBy === "latest"
                                    ? "Latest"
                                    : "Oldest"}
                            </span>

                            <i
                                className={`ri-arrow-down-s-line text-lg transition-transform duration-200 ${sortOpen
                                    ? "rotate-180"
                                    : ""
                                    }`}
                            />
                        </button>

                        {sortOpen && (
                            <div className="absolute right-0 z-30 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10">
                                {[
                                    {
                                        value: "latest",
                                        label: "Latest",
                                    },
                                    {
                                        value: "oldest",
                                        label: "Oldest",
                                    },
                                ].map((option) => (
                                    <button
                                        key={
                                            option.value
                                        }
                                        type="button"
                                        onClick={() =>
                                            handleSort(
                                                option.value
                                            )
                                        }
                                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition ${sortBy ===
                                            option.value
                                            ? "bg-blue-50 font-semibold text-blue-600"
                                            : "text-slate-600 hover:bg-slate-50"
                                            }`}
                                    >
                                        {option.label}

                                        {sortBy ===
                                            option.value && (
                                                <i className="ri-check-line text-lg" />
                                            )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                </div>

                {files.length === 0 ? (
                    <NoDataState
                        onAdd={openAddFileModal}
                    />
                ) : filteredFiles.length ===
                    0 ? (
                    <NotFoundState
                        search={search}
                        onClear={() =>
                            handleSearch("")
                        }
                    />
                ) : (
                    <>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {visibleFiles.map(
                                (file) => (

                                    <FileCard
                                        key={file.id}
                                        file={file}
                                        folder={getFolder(
                                            file.folderId
                                        )}
                                        menuId={menuId}
                                        setMenuId={setMenuId}
                                        onEdit={() =>
                                            openEditModal(
                                                file
                                            )
                                        }
                                        onShare={() =>
                                            openShareModal(
                                                file
                                            )
                                        }
                                        onMove={() =>
                                            openMoveModal(
                                                file
                                            )
                                        }
                                        onDelete={() =>
                                            openDeleteModal(
                                                file
                                            )
                                        }
                                    />
                                )
                            )}
                        </div>

                        {/* =================================================
                PAGINATION
            ================================================= */}

                        {totalPages > 1 && (
                            <FilePagination
                                page={page}
                                totalPages={totalPages}
                                totalItems={
                                    filteredFiles.length
                                }
                                itemsPerPage={
                                    FILES_PER_PAGE
                                }
                                onPageChange={setPage}
                            />
                        )}
                    </>
                )}
            </div>

            {folderPickerOpen && (
                /* Outer Backdrop Container: Screen overlay & Centering rules */
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">

    /* Inner Modal Box: Fully Responsive width & max-height control */
                    <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl transition-all my-8 max-h-[90vh] flex flex-col">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b pb-4 mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">Select Folder</h3>
                                <p className="text-xs text-slate-500">Choose a destination folder for your file</p>
                            </div>
                            <button
                                onClick={() => setFolderPickerOpen(false)}
                                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>

                        {/* Search Input Box */}
                        <div className="relative mb-4">
                            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                            <input
                                type="text"
                                placeholder="Search folders..."
                                value={folderSearch}
                                onChange={(e) => handleFolderSearch(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 pl-9 pr-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        {/* Folder List with Scrollbar */}
                        <div className="overflow-y-auto flex-1 space-y-2 pr-1 min-h-[200px]">
                            {visibleFolders.length > 0 ? (
                                visibleFolders.map((folder) => {
                                    const style = getFolderStyle(folder.color);
                                    return (
                                        <button
                                            key={folder.id}
                                            onClick={() => handleDestinationSelect(folder)}
                                            className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all text-left group"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${style.bg} ${style.text}`}>
                                                    <i className="ri-folder-fill text-xl"></i>
                                                </div>
                                                <div className="truncate">
                                                    <p className="text-sm font-medium text-slate-800 group-hover:text-blue-600 truncate">
                                                        {folder.name}
                                                    </p>
                                                    <p className="text-xs text-slate-400">
                                                        Updated {formatDate(folder.updatedAt)}
                                                    </p>
                                                </div>
                                            </div>
                                            <i className="ri-arrow-right-s-line text-slate-400 group-hover:text-blue-600 shrink-0"></i>
                                        </button>
                                    );
                                })
                            ) : (
                                <div className="py-8 text-center text-sm text-slate-400">
                                    No folders found.
                                </div>
                            )}
                        </div>

                        {/* Modal Footer / Actions */}
                        <div className="mt-4 pt-4 border-t flex items-center justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setFolderPickerOpen(false)}
                                className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {/* =====================================================
          ADD FILE MODAL
      ===================================================== */}

            {modal === "add" && (
                <ModalShell>
                    <ModalHeader
                        icon="ri-upload-cloud-2-line"
                        title="Add File"
                        subtitle="Upload a file to your folder."
                        onClose={() =>
                            !uploadLoading &&
                            setModal(null)
                        }
                    />

                    <div className="space-y-5 p-5">
                        {/* FILE PICKER */}

                        {!uploadFile ? (
                            <button
                                type="button"
                                onClick={() =>
                                    fileInputRef.current?.click()
                                }
                                className="group flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-5 py-9 text-center transition hover:border-blue-300 hover:bg-blue-50/40"
                            >
                                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 transition group-hover:scale-105">
                                    <i className="ri-upload-cloud-2-line text-2xl" />
                                </span>

                                <span className="mt-4 text-sm font-bold text-slate-700">
                                    Click to select a file
                                </span>

                                <span className="mt-1 text-xs text-slate-400">
                                    Maximum file size: 10 MB
                                </span>

                                <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[10px] font-medium text-slate-500 shadow-sm">
                                    <i className="ri-information-line" />
                                    File extension cannot be changed
                                </span>
                            </button>
                        ) : (
                            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${getFileStyle(
                                            uploadExtension
                                                .replace(
                                                    ".",
                                                    ""
                                                )
                                                .toUpperCase()
                                        ).bg
                                            } ${getFileStyle(
                                                uploadExtension
                                                    .replace(
                                                        ".",
                                                        ""
                                                    )
                                                    .toUpperCase()
                                            ).text
                                            }`}
                                    >
                                        <i
                                            className={`${getFileStyle(
                                                uploadExtension
                                                    .replace(
                                                        ".",
                                                        ""
                                                    )
                                                    .toUpperCase()
                                            ).icon
                                                } text-xl`}
                                        />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-bold text-slate-700">
                                            {uploadFile.name}
                                        </p>

                                        <p className="mt-1 text-xs text-slate-400">
                                            {formatFileSize(
                                                uploadFile.size
                                            )}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        disabled={
                                            uploadLoading
                                        }
                                        onClick={() => {
                                            setUploadFile(
                                                null
                                            );
                                            setUploadFileName(
                                                ""
                                            );
                                            setUploadExtension(
                                                ""
                                            );

                                            if (
                                                fileInputRef.current
                                            ) {
                                                fileInputRef.current.value =
                                                    "";
                                            }
                                        }}
                                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white hover:text-red-500"
                                    >
                                        <i className="ri-close-line text-lg" />
                                    </button>
                                </div>
                            </div>
                        )}

                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            onChange={
                                handleFileSelect
                            }
                        />

                        {/* FILE NAME */}

                        {uploadFile && (
                            <>
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        File Name
                                    </label>

                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={
                                                uploadFileName
                                            }
                                            onChange={(e) =>
                                                setUploadFileName(
                                                    e.target
                                                        .value
                                                )
                                            }
                                            placeholder="Enter file name"
                                            className="h-11 min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                        />

                                        {/* EXTENSION IS READ ONLY */}

                                        <div className="flex h-11 min-w-[80px] items-center justify-center rounded-xl border border-slate-200 bg-slate-100 px-3 text-sm font-bold text-slate-500">
                                            {uploadExtension ||
                                                ".file"}
                                        </div>
                                    </div>

                                    <p className="mt-1.5 text-[11px] text-slate-400">
                                        You can change only the file
                                        name. Extension cannot be
                                        modified.
                                    </p>
                                </div>

                                {/* FOLDER */}

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Upload To
                                    </label>

                                    <select
                                        value={
                                            uploadFolderId ||
                                            ""
                                        }
                                        onChange={(e) =>
                                            setUploadFolderId(
                                                Number(
                                                    e.target.value
                                                )
                                            )
                                        }
                                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                    >
                                        {folders.map(
                                            (folder) => (
                                                <option
                                                    key={
                                                        folder.id
                                                    }
                                                    value={
                                                        folder.id
                                                    }
                                                >
                                                    {folder.name}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>
                            </>
                        )}

                        {/* ERROR */}

                        {uploadError && (
                            <div className="flex gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-xs font-medium text-red-600">
                                <i className="ri-error-warning-line text-base" />

                                <span>
                                    {uploadError}
                                </span>
                            </div>
                        )}

                        {/* LIMIT INFO */}

                        <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-3">
                            <span className="flex items-center gap-2 text-xs text-slate-500">
                                <i className="ri-hard-drive-3-line text-blue-500" />
                                Maximum file size
                            </span>

                            <span className="text-xs font-bold text-slate-700">
                                10 MB
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-2 border-t border-slate-100 bg-slate-50/70 p-4">
                        <button
                            type="button"
                            disabled={
                                uploadLoading
                            }
                            onClick={() =>
                                setModal(null)
                            }
                            className="h-10 flex-1 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            disabled={
                                !uploadFile ||
                                uploadLoading
                            }
                            onClick={
                                handleAddFile
                            }
                            className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {uploadLoading ? (
                                <>
                                    <i className="ri-loader-4-line animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <i className="ri-upload-2-line" />
                                    Upload File
                                </>
                            )}
                        </button>
                    </div>
                </ModalShell>
            )}

            {/* =====================================================
          EDIT MODAL
      ===================================================== */}

            {modal === "edit" &&
                selectedFile && (
                    <ModalShell>
                        <ModalHeader
                            icon="ri-edit-line"
                            title="Rename File"
                            subtitle="Only the file name can be changed."
                            onClose={() =>
                                !editLoading &&
                                setModal(null)
                            }
                        />

                        <div className="space-y-5 p-5">
                            <FileMiniInfo
                                file={selectedFile}
                            />

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    File Name
                                </label>

                                <div className="flex gap-2">
                                    <input
                                        autoFocus
                                        type="text"
                                        value={
                                            editFileName
                                        }
                                        onChange={(e) => {
                                            setEditFileName(
                                                e.target
                                                    .value
                                            );

                                            setEditError(
                                                ""
                                            );
                                        }}
                                        onKeyDown={(e) => {
                                            if (
                                                e.key ===
                                                "Enter"
                                            ) {
                                                handleRename();
                                            }
                                        }}
                                        className={`h-11 min-w-0 flex-1 rounded-xl border bg-slate-50 px-4 text-sm outline-none transition focus:bg-white focus:ring-4 ${editError
                                            ? "border-red-300 focus:border-red-400 focus:ring-red-500/10"
                                            : "border-slate-200 focus:border-blue-400 focus:ring-blue-500/10"
                                            }`}
                                    />

                                    {/* EXTENSION LOCKED */}

                                    <div className="flex h-11 min-w-[80px] items-center justify-center rounded-xl border border-slate-200 bg-slate-100 px-3 text-sm font-bold text-slate-500">
                                        {
                                            selectedFile.extension
                                        }
                                    </div>
                                </div>

                                <p className="mt-1.5 text-[11px] text-slate-400">
                                    Extension{" "}
                                    <strong>
                                        {
                                            selectedFile.extension
                                        }
                                    </strong>{" "}
                                    cannot be changed.
                                </p>

                                {editError && (
                                    <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-500">
                                        <i className="ri-error-warning-line" />
                                        {editError}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-2 border-t border-slate-100 bg-slate-50/70 p-4">
                            <button
                                type="button"
                                disabled={
                                    editLoading
                                }
                                onClick={() =>
                                    setModal(null)
                                }
                                className="h-10 flex-1 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                disabled={
                                    editLoading
                                }
                                onClick={
                                    handleRename
                                }
                                className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 disabled:opacity-50"
                            >
                                {editLoading ? (
                                    <>
                                        <i className="ri-loader-4-line animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <i className="ri-save-line" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </ModalShell>
                )}

            {/* =====================================================
          SHARE MODAL
      ===================================================== */}

            {modal === "share" &&
                selectedFile && (
                    <ModalShell>
                        <ModalHeader
                            icon="ri-share-forward-line"
                            title="Share File"
                            subtitle="Share this file with a registered user."
                            onClose={() =>
                                !shareLoading &&
                                setModal(null)
                            }
                        />

                        <div className="space-y-5 p-5">
                            <FileMiniInfo
                                file={selectedFile}
                            />

                            {/* EMAIL */}

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Recipient Email
                                </label>

                                <div className="relative">
                                    <i className="ri-mail-line absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-slate-400" />

                                    <input
                                        type="email"
                                        value={
                                            recipientEmail
                                        }
                                        onChange={(e) => {
                                            setRecipientEmail(
                                                e.target
                                                    .value
                                            );

                                            setShareError(
                                                ""
                                            );
                                        }}
                                        placeholder="recipient@example.com"
                                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                    />
                                </div>

                                <p className="mt-1.5 text-[11px] text-slate-400">
                                    Recipient must already be
                                    registered on the platform.
                                </p>
                            </div>

                            {/* PASSWORD */}

                            <div>
                                <label className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-700">
                                    Password

                                    <span className="text-[10px] font-medium text-slate-400">
                                        Optional
                                    </span>
                                </label>

                                <div className="relative">
                                    <i className="ri-lock-password-line absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-slate-400" />

                                    <input
                                        type="text"
                                        value={
                                            sharePassword
                                        }
                                        onChange={(e) =>
                                            setSharePassword(
                                                e.target
                                                    .value
                                            )
                                        }
                                        placeholder="Custom password"
                                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                    />
                                </div>
                            </div>

                            {/* EXPIRY */}

                            <div>
                                <label className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-700">
                                    Expiry Date

                                    <span className="text-[10px] font-medium text-slate-400">
                                        Optional
                                    </span>
                                </label>

                                <div className="relative">
                                    <i className="ri-calendar-line absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-slate-400" />

                                    <input
                                        type="date"
                                        min={
                                            new Date()
                                                .toISOString()
                                                .split(
                                                    "T"
                                                )[0]
                                        }
                                        value={
                                            shareExpiry
                                        }
                                        onChange={(e) =>
                                            setShareExpiry(
                                                e.target
                                                    .value
                                            )
                                        }
                                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                    />
                                </div>
                            </div>

                            {/* ERROR */}

                            {shareError && (
                                <div className="flex gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-xs font-medium text-red-600">
                                    <i className="ri-error-warning-line text-base" />

                                    <span>
                                        {shareError}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2 border-t border-slate-100 bg-slate-50/70 p-4">
                            <button
                                type="button"
                                disabled={
                                    shareLoading
                                }
                                onClick={() =>
                                    setModal(null)
                                }
                                className="h-10 flex-1 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                disabled={
                                    shareLoading
                                }
                                onClick={
                                    handleShare
                                }
                                className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {shareLoading ? (
                                    <>
                                        <i className="ri-loader-4-line animate-spin" />
                                        Sharing...
                                    </>
                                ) : (
                                    <>
                                        <i className="ri-share-forward-line" />
                                        Share File
                                    </>
                                )}
                            </button>
                        </div>
                    </ModalShell>
                )}

            {/* =====================================================
          DELETE MODAL
      ===================================================== */}

            {modal === "delete" &&
                selectedFile && (
                    <ModalShell>
                        <div className="p-5 sm:p-6">
                            <div className="flex items-start gap-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
                                    <i className="ri-delete-bin-6-line text-xl" />
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">
                                        Delete file?
                                    </h2>

                                    <p className="mt-1 text-sm leading-5 text-slate-500">
                                        Are you sure you want to
                                        permanently delete{" "}
                                        <strong className="text-slate-700">
                                            "{selectedFile.name}"
                                        </strong>
                                        ?
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-3.5">
                                <div className="flex gap-2.5">
                                    <i className="ri-error-warning-fill mt-0.5 shrink-0 text-red-500" />

                                    <p className="text-xs font-medium leading-5 text-red-700">
                                        This action cannot be undone.
                                        The file will be permanently
                                        deleted.
                                    </p>
                                </div>
                            </div>

                            {deleteError && (
                                <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-600">
                                    {deleteError}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/70 p-4 sm:flex-row">
                            <button
                                type="button"
                                disabled={
                                    deleteLoading
                                }
                                onClick={() =>
                                    setModal(null)
                                }
                                className="h-10 flex-1 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                disabled={
                                    deleteLoading
                                }
                                onClick={
                                    handleDelete
                                }
                                className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
                            >
                                {deleteLoading ? (
                                    <>
                                        <i className="ri-loader-4-line animate-spin" />
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
                    </ModalShell>
                )}

            {/* =====================================================
          MOVE MODAL
      ===================================================== */}

            {modal === "move" &&
                selectedFile && (
                    <ModalShell>
                        <ModalHeader
                            icon="ri-folder-transfer-line"
                            title="Move File"
                            subtitle="Choose where you want to move this file."
                            onClose={() =>
                                !moveLoading &&
                                setModal(null)
                            }
                        />

                        <div className="space-y-4 p-5">
                            {/* FILE INFO */}

                            <FileMiniInfo
                                file={selectedFile}
                            />

                            {/* CURRENT FOLDER */}

                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    Current Folder
                                </p>

                                <div className="mt-2 flex items-center gap-2">
                                    <i className="ri-folder-5-fill text-lg text-blue-500" />

                                    <span className="text-sm font-semibold text-slate-700">
                                        {getFolder(
                                            selectedFile.folderId
                                        )?.name ||
                                            "Unknown Folder"}
                                    </span>
                                </div>
                            </div>

                            {/* MOVE TO */}

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Move To
                                </label>

                                <button
                                    type="button"
                                    disabled={
                                        moveLoading
                                    }
                                    onClick={
                                        openFolderPicker
                                    }
                                    className="flex min-h-12 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 text-left transition hover:border-blue-300 hover:bg-blue-50/30"
                                >
                                    <span className="flex items-center gap-2.5">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
                                            <i className="ri-folder-5-fill" />
                                        </span>

                                        <span>
                                            <span className="block text-xs font-semibold text-slate-700">
                                                {selectedDestination
                                                    ? selectedDestination.name
                                                    : "Select destination folder"}
                                            </span>

                                            {!selectedDestination && (
                                                <span className="block text-[10px] text-slate-400">
                                                    Click to browse folders
                                                </span>
                                            )}
                                        </span>
                                    </span>

                                    <i className="ri-arrow-right-s-line text-lg text-slate-400" />
                                </button>
                            </div>

                            {/* SELECTED DESTINATION */}

                            {selectedDestination && (
                                <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 p-3">
                                    <span
                                        className={`flex h-8 w-8 items-center justify-center rounded-lg ${getFolderStyle(
                                            selectedDestination.color
                                        ).bg
                                            } ${getFolderStyle(
                                                selectedDestination.color
                                            ).text
                                            }`}
                                    >
                                        <i className="ri-folder-5-fill" />
                                    </span>

                                    <div className="min-w-0 flex-1">
                                        <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-400">
                                            Destination
                                        </p>

                                        <p className="truncate text-sm font-bold text-blue-700">
                                            {
                                                selectedDestination.name
                                            }
                                        </p>
                                    </div>

                                    <i className="ri-check-line text-xl text-blue-600" />
                                </div>
                            )}

                            {/* ERROR */}

                            {moveError && (
                                <div className="flex gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-xs font-medium text-red-600">
                                    <i className="ri-error-warning-line text-base" />

                                    <span>
                                        {moveError}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2 border-t border-slate-100 bg-slate-50/70 p-4">
                            <button
                                type="button"
                                disabled={
                                    moveLoading
                                }
                                onClick={() =>
                                    setModal(null)
                                }
                                className="h-10 flex-1 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                disabled={
                                    !selectedDestination ||
                                    moveLoading
                                }
                                onClick={
                                    handleMove
                                }
                                className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {moveLoading ? (
                                    <>
                                        <i className="ri-loader-4-line animate-spin" />
                                        Moving...
                                    </>
                                ) : (
                                    <>
                                        <i className="ri-folder-transfer-line" />
                                        Move File
                                    </>
                                )}
                            </button>
                        </div>
                    </ModalShell>
                )}

            {/* =====================================================
          FOLDER PICKER POPUP
      ===================================================== */}

            {folderPickerOpen &&
                modal === "move" && (
                    <FolderPickerModal
                        folders={
                            visibleFolders
                        }
                        search={folderSearch}
                        setSearch={
                            handleFolderSearch
                        }
                        page={folderPage}
                        totalPages={
                            folderTotalPages
                        }
                        totalItems={
                            filteredFolders.length
                        }
                        onPageChange={
                            setFolderPage
                        }
                        selectedFolder={
                            selectedDestination
                        }
                        currentFolderId={
                            selectedFile?.folderId
                        }
                        onSelect={
                            handleDestinationSelect
                        }
                        onClose={() =>
                            setFolderPickerOpen(
                                false
                            )
                        }
                    />
                )}

            {/* =====================================================
          TOAST
      ===================================================== */}

            {toast && (
                <div className="fixed bottom-5 left-1/2 z-[100] w-[calc(100%-32px)] max-w-sm -translate-x-1/2">
                    <div
                        className={`flex items-center gap-3 rounded-xl border bg-white px-4 py-3 shadow-xl ${toast.type ===
                            "error"
                            ? "border-red-100"
                            : "border-emerald-100"
                            }`}
                    >
                        <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${toast.type ===
                                "error"
                                ? "bg-red-50 text-red-500"
                                : "bg-emerald-50 text-emerald-500"
                                }`}
                        >
                            <i
                                className={
                                    toast.type ===
                                        "error"
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
        </div>
    );
}

/* =========================================================
   FILE CARD
========================================================= */

function FileCard({
    file,
    folder,
    menuId,
    setMenuId,
    onEdit,
    onShare,
    onMove,
    onDelete,
}) {
    const style = getFileStyle(
        file.type
    );

    const folderStyle = getFolderStyle(
        folder?.color
    );

    return (
        <div className="group relative rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5">
            {/* TOP */}

            <div className="flex items-start justify-between">
                <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${style.bg} ${style.text} transition-transform duration-300 group-hover:scale-105`}
                >
                    <i
                        className={`${style.icon} text-2xl`}
                    />
                </div>

                {/* MENU */}

                <div className="relative">
                    <button
                        type="button"
                        onClick={() =>
                            setMenuId(
                                (prev) =>
                                    prev === file.id
                                        ? null
                                        : file.id
                            )
                        }
                        className={`flex h-9 w-9 items-center justify-center rounded-lg text-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 ${menuId === file.id
                            ? "bg-slate-100 text-slate-700"
                            : ""
                            }`}
                    >
                        <i className="ri-more-2-fill" />
                    </button>

                    {menuId === file.id && (
                        <FileActionMenu
                            onEdit={onEdit}
                            onShare={onShare}
                            onMove={onMove}
                            onDelete={onDelete}
                        />
                    )}
                </div>
            </div>

            {/* FILE NAME */}

            <div className="mt-4">
                <h3 className="truncate text-base font-bold text-slate-800">
                    {file.fileName}
                </h3>

                <div className="mt-1 flex items-center gap-2">
                    <span
                        className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${style.bg} ${style.text}`}
                    >
                        {file.extension}
                    </span>

                    <span className="text-xs text-slate-400">
                        {file.type}
                    </span>

                    <span className="text-xs text-slate-300">
                        •
                    </span>

                    <span className="text-xs text-slate-400">
                        {formatFileSize(
                            file.size
                        )}
                    </span>
                </div>
            </div>

            {/* STATS */}

            <div className="mt-5 grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-slate-50 p-3 transition group-hover:bg-blue-50/50">
                    <div className="flex items-center gap-1.5 text-slate-400">
                        <i className="ri-download-2-line text-sm" />

                        <span className="text-[10px] font-semibold uppercase tracking-wide">
                            Downloads
                        </span>
                    </div>

                    <p className="mt-1 text-sm font-bold text-slate-700">
                        {file.downloads}
                    </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3 transition group-hover:bg-blue-50/50">
                    <div className="flex items-center gap-1.5 text-slate-400">
                        <i className="ri-share-forward-line text-sm" />

                        <span className="text-[10px] font-semibold uppercase tracking-wide">
                            Shared
                        </span>
                    </div>

                    <p className="mt-1 text-sm font-bold text-slate-700">
                        {file.shares}
                    </p>
                </div>
            </div>

            {/* DETAILS */}

            <div className="mt-4 space-y-2.5">
                <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                        Uploaded
                    </span>

                    <span className="text-xs font-medium text-slate-600">
                        {formatDate(
                            file.uploadedAt
                        )}
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                        Updated
                    </span>

                    <span className="text-xs font-medium text-slate-600">
                        {formatDate(
                            file.updatedAt
                        )}
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                        Expiry
                    </span>

                    <span className="text-xs font-medium text-slate-600">
                        {formatDate(
                            file.expiryDate
                        )}
                    </span>
                </div>
            </div>

            {/* FOOTER */}

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                <div className="flex items-center gap-2">
                    <span
                        className={`flex h-7 w-7 items-center justify-center rounded-lg ${file.password
                            ? "bg-emerald-50 text-emerald-500"
                            : "bg-slate-50 text-slate-300"
                            }`}
                    >
                        <i
                            className={
                                file.password
                                    ? "ri-lock-password-line text-sm"
                                    : "ri-lock-unlock-line text-sm"
                            }
                        />
                    </span>

                    <span className="text-xs text-slate-400">
                        {file.password
                            ? "Protected"
                            : "No password"}
                    </span>
                </div>

                <span
                    className={`inline-flex max-w-[130px] items-center gap-1.5 truncate rounded-full px-2.5 py-1.5 text-[10px] font-semibold ${folderStyle.bg} ${folderStyle.text}`}
                >
                    <span
                        className={`h-1.5 w-1.5 shrink-0 rounded-full ${folderStyle.dot}`}
                    />

                    <span className="truncate">
                        {folder?.name ||
                            "Unknown Folder"}
                    </span>
                </span>
            </div>
        </div>
    );
}

/* =========================================================
   FILE ACTION MENU
========================================================= */

function FileActionMenu({
    onEdit,
    onShare,
    onMove,
    onDelete,
}) {
    return (
        <div className="absolute right-0 top-10 z-40 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10">
            <button
                type="button"
                onClick={onEdit}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
            >
                <i className="ri-edit-line text-base" />
                Edit
            </button>

            <button
                type="button"
                onClick={onShare}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
            >
                <i className="ri-share-forward-line text-base" />
                Share
            </button>

            <button
                type="button"
                onClick={onMove}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
            >
                <i className="ri-folder-transfer-line text-base" />
                Move File
            </button>

            <div className="my-1 border-t border-slate-100" />

            <button
                type="button"
                onClick={onDelete}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-red-500 transition hover:bg-red-50"
            >
                <i className="ri-delete-bin-line text-base" />
                Delete
            </button>
        </div>
    );
}

/* =========================================================
   FILE MINI INFO
========================================================= */

function FileMiniInfo({
    file,
}) {
    const style = getFileStyle(
        file.type
    );

    return (
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${style.bg} ${style.text}`}
            >
                <i
                    className={`${style.icon} text-xl`}
                />
            </div>

            <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-700">
                    {file.name}
                </p>

                <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                    <span>
                        {file.type}
                    </span>

                    <span>•</span>

                    <span>
                        {formatFileSize(
                            file.size
                        )}
                    </span>
                </div>
            </div>
        </div>
    );
}

/* =========================================================
   MODAL SHELL
========================================================= */

function ModalShell({
    children,
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-md animate-[modalIn_.2s_ease-out] overflow-y-auto rounded-2xl bg-white shadow-2xl">
                {children}
            </div>

            <style>
                {`
          @keyframes modalIn {
            from {
              opacity: 0;
              transform: translateY(10px) scale(.98);
            }

            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
            </style>
        </div>
    );
}

/* =========================================================
   MODAL HEADER
========================================================= */

function ModalHeader({
    icon,
    title,
    subtitle,
    onClose,
}) {
    return (
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <i
                        className={`${icon} text-lg`}
                    />
                </div>

                <div>
                    <h2 className="text-lg font-bold text-slate-900">
                        {title}
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-400">
                        {subtitle}
                    </p>
                </div>
            </div>

            <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
                <i className="ri-close-line" />
            </button>
        </div>
    );
}

/* =========================================================
   FOLDER PICKER MODAL
========================================================= */

function FolderPickerModal({
    folders,
    search,
    setSearch,
    page,
    totalPages,
    totalItems,
    onPageChange,
    selectedFolder,
    currentFolderId,
    onSelect,
    onClose,
}) {
    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 p-2 sm:p-4 backdrop-blur-sm">
            <div className="mx-auto flex w-full max-w-lg max-h-[calc(100vh-1rem)] sm:max-h-[90vh]">
                <div className="flex w-full flex-col overflow-hidden rounded-xl sm:rounded-2xl bg-white shadow-2xl animate-[modalIn_.2s_ease-out]">

                    {/* HEADER */}
                    <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-3 py-3 sm:px-5 sm:py-4">
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 sm:h-9 sm:w-9">
                                    <i className="ri-folder-open-line text-lg" />
                                </div>

                                <h2 className="truncate text-base font-bold text-slate-900 sm:text-lg">
                                    Select Folder
                                </h2>
                            </div>

                            <p className="mt-1 pl-10 text-[11px] text-slate-400 sm:pl-11 sm:text-xs">
                                Choose a destination folder
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 sm:h-9 sm:w-9"
                        >
                            <i className="ri-close-line" />
                        </button>
                    </div>

                    {/* SEARCH */}
                    <div className="shrink-0 border-b border-slate-100 p-3 sm:p-4">
                        <div className="relative">
                            <i className="ri-search-line pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg text-slate-400" />

                            <input
                                autoFocus
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search folders..."
                                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10 sm:h-11"
                            />
                        </div>
                    </div>

                    {/* FOLDER LIST */}
                    <div className="min-h-0 flex-1 overflow-y-auto p-2.5 sm:p-3">
                        {folders.length === 0 ? (
                            <div className="flex min-h-[220px] flex-col items-center justify-center px-4 text-center sm:min-h-[280px]">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 sm:h-14 sm:w-14">
                                    <i className="ri-folder-search-line text-2xl" />
                                </div>

                                <h3 className="mt-3 text-sm font-bold text-slate-700">
                                    No folders found
                                </h3>

                                <p className="mt-1 text-xs text-slate-400">
                                    Try another search term.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-1.5">
                                {folders.map((folder) => {
                                    const style = getFolderStyle(folder.color);

                                    const isCurrent =
                                        folder.id === currentFolderId;

                                    const isSelected =
                                        selectedFolder?.id === folder.id;

                                    return (
                                        <button
                                            key={folder.id}
                                            type="button"
                                            disabled={isCurrent}
                                            onClick={() => onSelect(folder)}
                                            className={`flex w-full min-w-0 items-center gap-2.5 rounded-xl border p-2.5 text-left transition sm:gap-3 sm:p-3 ${isCurrent
                                                    ? "cursor-not-allowed border-slate-100 bg-slate-50 opacity-50"
                                                    : isSelected
                                                        ? "border-blue-200 bg-blue-50"
                                                        : "border-transparent hover:border-slate-200 hover:bg-slate-50"
                                                }`}
                                        >
                                            <span
                                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg sm:h-10 sm:w-10 sm:rounded-xl ${style.bg} ${style.text}`}
                                            >
                                                <i className="ri-folder-5-fill text-lg sm:text-xl" />
                                            </span>

                                            <span className="min-w-0 flex-1">
                                                <span className="block truncate text-xs font-semibold text-slate-700 sm:text-sm">
                                                    {folder.name}
                                                </span>

                                                <span className="mt-0.5 block truncate text-[10px] text-slate-400 sm:text-[11px]">
                                                    Updated{" "}
                                                    {formatDate(folder.updatedAt)}
                                                </span>
                                            </span>

                                            <span className="shrink-0">
                                                {isCurrent ? (
                                                    <span className="rounded-full bg-slate-200 px-1.5 py-1 text-[8px] font-bold text-slate-500 sm:px-2 sm:text-[9px]">
                                                        Current
                                                    </span>
                                                ) : isSelected ? (
                                                    <i className="ri-checkbox-circle-fill text-lg text-blue-600 sm:text-xl" />
                                                ) : (
                                                    <i className="ri-arrow-right-s-line text-base text-slate-300 sm:text-lg" />
                                                )}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* PAGINATION */}
                    {totalPages > 1 && (
                        <div className="flex shrink-0 flex-col gap-2 border-t border-slate-100 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:px-4 sm:py-3">
                            <p className="text-center text-[11px] text-slate-400 sm:text-left">
                                {totalItems} folders
                            </p>

                            <div className="flex items-center justify-center gap-1">
                                <button
                                    type="button"
                                    disabled={page === 1}
                                    onClick={() =>
                                        onPageChange((prev) =>
                                            Math.max(1, prev - 1)
                                        )
                                    }
                                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <i className="ri-arrow-left-s-line" />
                                </button>

                                {/* Mobile: current page only */}
                                <span className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-blue-600 px-2 text-xs font-semibold text-white sm:hidden">
                                    {page}
                                </span>

                                {/* Desktop: all pages */}
                                <div className="hidden items-center gap-1 sm:flex">
                                    {Array.from(
                                        { length: totalPages },
                                        (_, index) => index + 1
                                    ).map((number) => (
                                        <button
                                            key={number}
                                            type="button"
                                            onClick={() => onPageChange(number)}
                                            className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-xs font-semibold transition ${page === number
                                                    ? "bg-blue-600 text-white"
                                                    : "border border-slate-200 text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                                                }`}
                                        >
                                            {number}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    disabled={page === totalPages}
                                    onClick={() =>
                                        onPageChange((prev) =>
                                            Math.min(totalPages, prev + 1)
                                        )
                                    }
                                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <i className="ri-arrow-right-s-line" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* FOOTER */}
                    <div className="shrink-0 border-t border-slate-100 bg-slate-50/70 px-3 py-2.5 sm:px-4 sm:py-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="h-9 w-full rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 transition hover:bg-slate-50 sm:h-10"
                        >
                            Cancel
                        </button>
                    </div>
                </div>

                <style>
                    {`
                @keyframes modalIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px) scale(.98);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
            `}
                </style>
            </div>
        </div>
    );
}

/* =========================================================
   FILE PAGINATION
========================================================= */

function FilePagination({
    page,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
}) {
    const start =
        (page - 1) *
        itemsPerPage +
        1;

    const end = Math.min(
        page * itemsPerPage,
        totalItems
    );

    return (
        <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-xs text-slate-500">
                Showing{" "}
                <span className="font-semibold text-slate-700">
                    {start}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-slate-700">
                    {end}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-700">
                    {totalItems}
                </span>
            </p>

            <div className="flex items-center gap-1.5">
                <button
                    type="button"
                    disabled={page === 1}
                    onClick={() =>
                        onPageChange(
                            (prev) =>
                                Math.max(
                                    1,
                                    prev - 1
                                )
                        )
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <i className="ri-arrow-left-s-line" />
                </button>

                {Array.from(
                    {
                        length: totalPages,
                    },
                    (_, index) =>
                        index + 1
                ).map((number) => (
                    <button
                        key={number}
                        type="button"
                        onClick={() =>
                            onPageChange(
                                number
                            )
                        }
                        className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-xs font-semibold transition ${page === number
                            ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                            : "border border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                            }`}
                    >
                        {number}
                    </button>
                ))}

                <button
                    type="button"
                    disabled={
                        page === totalPages
                    }
                    onClick={() =>
                        onPageChange(
                            (prev) =>
                                Math.min(
                                    totalPages,
                                    prev + 1
                                )
                        )
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <i className="ri-arrow-right-s-line" />
                </button>
            </div>
        </div>
    );
}

/* =========================================================
   NO DATA STATE
========================================================= */

function NoDataState({
    onAdd,
}) {
    return (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-500">
                <i className="ri-folder-upload-line text-3xl" />
            </div>

            <h3 className="mt-4 text-base font-bold text-slate-800">
                No files available
            </h3>

            <p className="mt-1 max-w-sm text-sm text-slate-400">
                You haven't uploaded any files yet.
                Upload your first file to get started.
            </p>

            <button
                type="button"
                onClick={onAdd}
                className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700"
            >
                <i className="ri-add-line" />
                Add Files
            </button>
        </div>
    );
}

/* =========================================================
   NOT FOUND STATE
========================================================= */

function NotFoundState({
    search,
    onClear,
}) {
    return (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <i className="ri-search-eye-line text-3xl" />
            </div>

            <h3 className="mt-4 text-base font-bold text-slate-800">
                No files found
            </h3>

            <p className="mt-1 max-w-sm text-sm text-slate-400">
                We couldn't find any file matching{" "}
                <strong className="text-slate-600">
                    "{search}"
                </strong>
                .
            </p>

            <button
                type="button"
                onClick={onClear}
                className="mt-5 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
            >
                Clear search
            </button>
        </div>
    );
}

/* =========================================================
   LOADING SKELETON
========================================================= */

function FilesSkeleton() {
    return (
        <div>
            <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <div className="h-8 w-32 animate-pulse rounded-lg bg-slate-200" />

                    <div className="mt-3 h-5 w-20 animate-pulse rounded bg-slate-200" />

                    <div className="mt-2 h-3 w-64 animate-pulse rounded bg-slate-200" />
                </div>

                <div className="h-11 w-32 animate-pulse rounded-xl bg-slate-200" />
            </div>

            <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 sm:flex-row">
                <div className="h-11 flex-1 animate-pulse rounded-xl bg-slate-100" />

                <div className="h-11 w-full animate-pulse rounded-xl bg-slate-100 sm:w-48" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({
                    length: 6,
                }).map((_, index) => (
                    <div
                        key={index}
                        className="rounded-2xl border border-slate-200 bg-white p-4"
                    >
                        <div className="flex justify-between">
                            <div className="h-12 w-12 animate-pulse rounded-xl bg-slate-100" />

                            <div className="h-9 w-9 animate-pulse rounded-lg bg-slate-100" />
                        </div>

                        <div className="mt-4 h-4 w-40 animate-pulse rounded bg-slate-100" />

                        <div className="mt-2 h-3 w-28 animate-pulse rounded bg-slate-100" />

                        <div className="mt-5 grid grid-cols-2 gap-2">
                            <div className="h-16 animate-pulse rounded-xl bg-slate-100" />
                            <div className="h-16 animate-pulse rounded-xl bg-slate-100" />
                        </div>

                        <div className="mt-4 space-y-3">
                            <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
                            <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
                            <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}