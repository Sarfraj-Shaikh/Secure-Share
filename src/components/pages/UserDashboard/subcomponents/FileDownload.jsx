import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../../../utils/api";
import SpinLoader from "../../../shared/SpinLoader";
import { verifyToken } from "../../../../../utils/isUserLogin";

const FileDownload = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const serverUrl = import.meta.env.VITE_SERVER_URL;
    const userToken = localStorage.getItem("userToken");

    const [checkingAuth, setCheckingAuth] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    const [file, setFile] = useState(null);
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    // ------------------------------------------------------------------------
    // Authentication
    // ------------------------------------------------------------------------

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

    // ------------------------------------------------------------------------
    // Fetch File Information
    // ------------------------------------------------------------------------

    useEffect(() => {
        if (!authenticated) {
            return;
        }

        fetchFileInfo();
    }, [authenticated, id]);

    const fetchFileInfo = async () => {
        try {
            setLoading(true);
            setError("");
            setSuccess("");

            if (!id) {
                setError("Invalid file link.");
                return;
            }

            if (!userToken) {
                setError("Authentication token not found.");
                return;
            }

            if (!serverUrl) {
                setError("VITE_SERVER_URL is not configured.");
                return;
            }

            const response = await api.get(
                `${serverUrl}/api/download-file/${id}`,
                {
                    headers: {
                        Authorization: userToken,
                    },
                }
            );

            const data = response?.data;

            if (!data?.success) {
                throw new Error(
                    data?.message ||
                    "Unable to access this file."
                );
            }

            setFile(data?.data || null);

        } catch (err) {
            const errorMessage =
                err?.response?.data?.message ||
                err?.message ||
                "Unable to access this file.";

            setError(errorMessage);
            setFile(null);

        } finally {
            setLoading(false);
        }
    };

    // ------------------------------------------------------------------------
    // Download
    // ------------------------------------------------------------------------

    const handleDownload = async () => {
        try {
            setDownloading(true);
            setError("");
            setSuccess("");

            if (!id) {
                setError("Invalid file link.");
                return;
            }

            if (!userToken) {
                setError("Authentication token not found.");
                return;
            }

            if (!serverUrl) {
                setError("VITE_SERVER_URL is not configured.");
                return;
            }

            const response = await api.post(
                `${serverUrl}/api/download-file/${id}`,
                {
                    password: file?.passwordRequired
                        ? password
                        : undefined,
                },
                {
                    headers: {
                        Authorization: userToken,
                    },

                    // Very important:
                    // Express res.download() returns binary data.
                    responseType: "blob",
                }
            );

            const blob = new Blob(
                [response.data],
                {
                    type:
                        response.headers?.["content-type"] ||
                        file?.mimeType ||
                        "application/octet-stream",
                }
            );

            const downloadUrl =
                window.URL.createObjectURL(blob);

            const anchor =
                document.createElement("a");

            anchor.href = downloadUrl;

            anchor.download =
                file?.fileName ||
                "download";

            document.body.appendChild(anchor);

            anchor.click();

            anchor.remove();

            window.URL.revokeObjectURL(
                downloadUrl
            );

            setSuccess(
                "File download started successfully."
            );

        } catch (err) {

            /*
             * Since responseType is blob, Express JSON errors
             * can also arrive as Blob.
             */

            let errorMessage =
                "Unable to download file.";

            const responseData =
                err?.response?.data;

            if (
                responseData instanceof Blob &&
                responseData.type?.includes(
                    "application/json"
                )
            ) {
                try {
                    const text =
                        await responseData.text();

                    const json =
                        JSON.parse(text);

                    errorMessage =
                        json?.message ||
                        errorMessage;

                } catch {
                    // Keep default error message.
                }

            } else {
                errorMessage =
                    err?.response?.data?.message ||
                    err?.message ||
                    errorMessage;
            }

            setError(errorMessage);

        } finally {
            setDownloading(false);
        }
    };

    // ------------------------------------------------------------------------
    // Helpers
    // ------------------------------------------------------------------------

    const extension = useMemo(() => {
        return getExtension(
            file?.fileName || ""
        );
    }, [file]);

    // ------------------------------------------------------------------------
    // Loading
    // ------------------------------------------------------------------------

    if (checkingAuth) {
        return <SpinLoader />;
    }

    // ------------------------------------------------------------------------
    // UI
    // ------------------------------------------------------------------------

    return (
        <section className="min-h-screen bg-slate-50 px-4 py-6 pt-[90px] sm:px-6 lg:px-8">

            <div className="mx-auto flex min-h-[calc(100vh-130px)] w-full max-w-3xl items-center justify-center">

                <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    {/* --------------------------------------------------------
                        Header
                    --------------------------------------------------------- */}

                    <div className="border-b border-slate-100 px-5 py-5 sm:px-7">

                        <div className="flex items-center gap-3">

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                                <i className="ri-download-cloud-2-line text-xl" />
                            </div>

                            <div className="min-w-0">
                                <h1 className="text-lg font-bold text-slate-900 sm:text-xl">
                                    Download File
                                </h1>

                                <p className="mt-0.5 text-sm text-slate-500">
                                    Access your shared file securely.
                                </p>
                            </div>

                        </div>

                    </div>

                    {/* --------------------------------------------------------
                        Loading
                    --------------------------------------------------------- */}

                    {loading && (
                        <LoadingState />
                    )}

                    {/* --------------------------------------------------------
                        Error
                    --------------------------------------------------------- */}

                    {!loading && error && !file && (
                        <ErrorState
                            message={error}
                            onRetry={fetchFileInfo}
                        />
                    )}

                    {/* --------------------------------------------------------
                        File
                    --------------------------------------------------------- */}

                    {!loading && file && (
                        <div className="p-5 sm:p-7">

                            {/* File Information */}

                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">

                                <div className="flex items-start gap-4">

                                    <FileIcon
                                        extension={extension}
                                    />

                                    <div className="min-w-0 flex-1">

                                        <h2
                                            className="truncate text-base font-semibold text-slate-800"
                                            title={file.fileName}
                                        >
                                            {file.fileName}
                                        </h2>

                                        <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">
                                            {extension || "FILE"}
                                        </p>

                                    </div>

                                </div>

                                {/* Details */}

                                <div className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-200 pt-5 sm:grid-cols-3">

                                    <InfoItem
                                        icon="ri-hard-drive-2-line"
                                        label="Size"
                                        value={formatFileSize(
                                            file.fileSize
                                        )}
                                    />

                                    <InfoItem
                                        icon="ri-file-type-line"
                                        label="Type"
                                        value={file.mimeType || "Unknown"}
                                    />

                                    <InfoItem
                                        icon="ri-calendar-close-line"
                                        label="Expiry"
                                        value={formatDate(
                                            file.expiryDate
                                        )}
                                    />

                                </div>

                            </div>

                            {/* Password */}

                            {file.passwordRequired && (
                                <div className="mt-5">

                                    <label
                                        htmlFor="file-password"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        File Password
                                    </label>

                                    <div className="relative">

                                        <i className="ri-lock-line pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400" />

                                        <input
                                            id="file-password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={password}
                                            onChange={(event) => {
                                                setPassword(
                                                    event.target.value
                                                );
                                                setError("");
                                            }}
                                            onKeyDown={(event) => {
                                                if (
                                                    event.key ===
                                                    "Enter"
                                                ) {
                                                    handleDownload();
                                                }
                                            }}
                                            placeholder="Enter file password"
                                            autoComplete="off"
                                            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-11 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(
                                                    (previous) =>
                                                        !previous
                                                )
                                            }
                                            className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                                            aria-label={
                                                showPassword
                                                    ? "Hide password"
                                                    : "Show password"
                                            }
                                        >
                                            <i
                                                className={
                                                    showPassword
                                                        ? "ri-eye-off-line text-lg"
                                                        : "ri-eye-line text-lg"
                                                }
                                            />
                                        </button>

                                    </div>

                                    <p className="mt-2 text-xs text-slate-400">
                                        This file is password protected.
                                    </p>

                                </div>
                            )}

                            {/* Error */}

                            {error && (
                                <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">

                                    <i className="ri-error-warning-line mt-0.5 text-lg" />

                                    <p className="flex-1">
                                        {error}
                                    </p>

                                </div>
                            )}

                            {/* Success */}

                            {success && (
                                <div className="mt-5 flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-600">

                                    <i className="ri-checkbox-circle-line mt-0.5 text-lg" />

                                    <p>
                                        {success}
                                    </p>

                                </div>
                            )}

                            {/* Download Button */}

                            <button
                                type="button"
                                onClick={handleDownload}
                                disabled={
                                    downloading ||
                                    (
                                        file.passwordRequired &&
                                        !password.trim()
                                    )
                                }
                                className="mt-6 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-slate-800 hover:shadow-md active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {downloading ? (
                                    <>
                                        <Spinner />
                                        Downloading...
                                    </>
                                ) : (
                                    <>
                                        <i className="ri-download-2-line text-lg" />
                                        Download File
                                    </>
                                )}
                            </button>

                            {/* Security Message */}

                            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">

                                <i className="ri-shield-check-line" />

                                <span>
                                    Your access permission is verified securely.
                                </span>

                            </div>

                        </div>
                    )}

                </div>

            </div>

        </section>
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
        ["zip", "rar", "7z", "tar", "gz"].includes(ext)
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
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm ring-1 ring-slate-200">
            <i className={`${icon} text-2xl`} />
        </div>
    );
};

/* ============================================================================
   Info Item
============================================================================ */

const InfoItem = ({
    icon,
    label,
    value,
}) => {
    return (
        <div className="min-w-0">

            <p className="mb-1 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-400">
                <i className={icon} />
                {label}
            </p>

            <p
                className="truncate text-sm font-medium text-slate-600"
                title={value}
            >
                {value}
            </p>

        </div>
    );
};

/* ============================================================================
   Loading State
============================================================================ */

const LoadingState = () => {
    return (
        <div className="animate-pulse p-5 sm:p-7">

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-5">

                <div className="flex gap-4">

                    <div className="h-12 w-12 rounded-xl bg-slate-200" />

                    <div className="flex-1">

                        <div className="h-4 w-2/3 rounded bg-slate-200" />

                        <div className="mt-2 h-3 w-20 rounded bg-slate-200" />

                    </div>

                </div>

                <div className="mt-6 grid grid-cols-3 gap-4">

                    <div className="h-10 rounded bg-slate-200" />
                    <div className="h-10 rounded bg-slate-200" />
                    <div className="h-10 rounded bg-slate-200" />

                </div>

            </div>

            <div className="mt-5 h-11 rounded-xl bg-slate-200" />

            <div className="mt-4 h-11 rounded-xl bg-slate-200" />

        </div>
    );
};

/* ============================================================================
   Error State
============================================================================ */

const ErrorState = ({
    message,
    onRetry,
}) => {
    return (
        <div className="flex min-h-[380px] flex-col items-center justify-center px-6 text-center">

            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                <i className="ri-file-warning-line text-3xl" />
            </div>

            <h2 className="text-base font-semibold text-slate-800">
                File unavailable
            </h2>

            <p className="mt-1 max-w-md text-sm text-slate-500">
                {message ||
                    "This file could not be accessed."}
            </p>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row">

                <button
                    type="button"
                    onClick={onRetry}
                    className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-medium text-white transition-all hover:bg-slate-800 active:scale-95"
                >
                    <i className="ri-refresh-line" />
                    Try Again
                </button>

            </div>

        </div>
    );
};

/* ============================================================================
   Spinner
============================================================================ */

const Spinner = () => {
    return (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
    );
};

/* ============================================================================
   Helpers
============================================================================ */

function getExtension(fileName = "") {

    const cleanName =
        fileName
            .split("?")[0]
            .split("#")[0];

    const lastDot =
        cleanName.lastIndexOf(".");

    if (
        lastDot === -1 ||
        lastDot === cleanName.length - 1
    ) {
        return "";
    }

    return cleanName
        .slice(lastDot + 1)
        .toLowerCase();
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
        Math.log(size) / Math.log(1024)
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
        return "No expiry";
    }

    const parsedDate =
        new Date(date);

    if (
        Number.isNaN(
            parsedDate.getTime()
        )
    ) {
        return "Invalid date";
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

export default FileDownload;