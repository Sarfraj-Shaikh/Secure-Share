import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";

// Chart.js registration
ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler
);

const Dashboard = () => {
    /*
    |--------------------------------------------------------------------------
    | Dummy Dashboard Data
    |--------------------------------------------------------------------------
    */

    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("all");
    const [activeActivityTab, setActiveActivityTab] = useState("uploads");

    const uploadsRef = useRef(null);
    const sharedRef = useRef(null);
    const usageRef = useRef(null);

    const dashboardData = {
        user: {
            name: "Alex Johnson",
            avatar: "AJ",
        },

        fileCategories: {
            images: 1248,
            videos: 386,
            audio: 214,
            documents: 642,
            pdf: 438,
            zip: 126,
            other: 87,
        },

        usage: {
            storage: {
                used: 12,
                total: 20,
            },

            folders: {
                used: 42,
                total: 100,
            },

            shared: {
                used: 68,
                total: 100,
            },
        },

        statistics: {
            uploadedFiles: 3141,
            sharedFiles: 486,
            favouriteFiles: 327,
            transactions: 42,
            transactionAmount: 12850,
            coins: 2450,
            coinsSpent: 870,
        },

        recentUploads: [
            {
                id: 1,
                name: "company-presentation.pdf",
                type: "PDF",
                icon: "ri-file-pdf-2-line",
                iconBg: "bg-red-50",
                iconColor: "text-red-500",
                date: "25 Aug 2026, 12:42 PM",
                size: "4.8 MB",
            },
            {
                id: 2,
                name: "summer-vacation.jpg",
                type: "Image",
                icon: "ri-image-line",
                iconBg: "bg-blue-50",
                iconColor: "text-blue-500",
                date: "25 Aug 2026, 11:18 AM",
                size: "3.2 MB",
            },
            {
                id: 3,
                name: "project-demo.mp4",
                type: "Video",
                icon: "ri-video-line",
                iconBg: "bg-purple-50",
                iconColor: "text-purple-500",
                date: "25 Aug 2026, 10:04 AM",
                size: "128 MB",
            },
            {
                id: 4,
                name: "meeting-recording.mp3",
                type: "Audio",
                icon: "ri-music-2-line",
                iconBg: "bg-pink-50",
                iconColor: "text-pink-500",
                date: "24 Aug 2026, 07:35 PM",
                size: "18.4 MB",
            },
            {
                id: 5,
                name: "financial-report.xlsx",
                type: "Document",
                icon: "ri-file-excel-2-line",
                iconBg: "bg-green-50",
                iconColor: "text-green-600",
                date: "24 Aug 2026, 04:12 PM",
                size: "2.8 MB",
            },
            {
                id: 6,
                name: "design-assets.zip",
                type: "ZIP",
                icon: "ri-file-zip-line",
                iconBg: "bg-yellow-50",
                iconColor: "text-yellow-600",
                date: "24 Aug 2026, 02:48 PM",
                size: "84 MB",
            },
            {
                id: 7,
                name: "contract.docx",
                type: "Document",
                icon: "ri-file-text-line",
                iconBg: "bg-cyan-50",
                iconColor: "text-cyan-600",
                date: "23 Aug 2026, 05:21 PM",
                size: "1.4 MB",
            },
            {
                id: 8,
                name: "product-shot.png",
                type: "Image",
                icon: "ri-image-line",
                iconBg: "bg-blue-50",
                iconColor: "text-blue-500",
                date: "23 Aug 2026, 12:15 PM",
                size: "6.8 MB",
            },
            {
                id: 9,
                name: "podcast-episode.wav",
                type: "Audio",
                icon: "ri-mic-line",
                iconBg: "bg-pink-50",
                iconColor: "text-pink-500",
                date: "22 Aug 2026, 08:40 PM",
                size: "32 MB",
            },
            {
                id: 10,
                name: "invoice-august.pdf",
                type: "PDF",
                icon: "ri-file-pdf-line",
                iconBg: "bg-red-50",
                iconColor: "text-red-500",
                date: "22 Aug 2026, 03:05 PM",
                size: "960 KB",
            },
        ],

        recentSharedFiles: [
            {
                id: 1,
                name: "Project Proposal.pdf",
                sharedWith: "Sarah Wilson",
                initials: "SW",
                date: "25 Aug 2026, 11:30 AM",
                status: "Active",
            },
            {
                id: 2,
                name: "Brand Guidelines.zip",
                sharedWith: "Michael Smith",
                initials: "MS",
                date: "25 Aug 2026, 10:15 AM",
                status: "Active",
            },
            {
                id: 3,
                name: "Product Demo.mp4",
                sharedWith: "Emily Davis",
                initials: "ED",
                date: "24 Aug 2026, 05:42 PM",
                status: "Pending",
            },
            {
                id: 4,
                name: "Financial Report.xlsx",
                sharedWith: "Daniel Brown",
                initials: "DB",
                date: "24 Aug 2026, 03:18 PM",
                status: "Active",
            },
            {
                id: 5,
                name: "Team Photos.zip",
                sharedWith: "Olivia Martin",
                initials: "OM",
                date: "23 Aug 2026, 06:12 PM",
                status: "Expired",
            },
            {
                id: 6,
                name: "Contract.docx",
                sharedWith: "James Anderson",
                initials: "JA",
                date: "23 Aug 2026, 01:25 PM",
                status: "Active",
            },
            {
                id: 7,
                name: "Marketing Video.mp4",
                sharedWith: "Sophia Taylor",
                initials: "ST",
                date: "22 Aug 2026, 08:45 PM",
                status: "Active",
            },
            {
                id: 8,
                name: "Invoice.pdf",
                sharedWith: "William Thomas",
                initials: "WT",
                date: "22 Aug 2026, 04:32 PM",
                status: "Pending",
            },
            {
                id: 9,
                name: "App Screenshots.zip",
                sharedWith: "Emma Jackson",
                initials: "EJ",
                date: "21 Aug 2026, 02:10 PM",
                status: "Active",
            },
            {
                id: 10,
                name: "Audio Files.zip",
                sharedWith: "Noah White",
                initials: "NW",
                date: "21 Aug 2026, 11:20 AM",
                status: "Expired",
            },
        ],
    };

    /*
    |--------------------------------------------------------------------------
    | Simulate Loading
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 900);

        return () => clearTimeout(timer);
    }, []);

    /*
    |--------------------------------------------------------------------------
    | Helpers
    |--------------------------------------------------------------------------
    */

    const formatNumber = (value) => {
        return new Intl.NumberFormat("en-IN").format(value);
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(value);
    };

    const percentage = (used, total) => {
        if (!total) return 0;
        return Math.min(Math.round((used / total) * 100), 100);
    };

    /*
    |--------------------------------------------------------------------------
    | File Category Cards
    |--------------------------------------------------------------------------
    */

    const categoryCards = [
        {
            key: "images",
            title: "Images",
            count: dashboardData.fileCategories.images,
            icon: "ri-image-line",
            bg: "bg-blue-50",
            color: "text-blue-600",
        },
        {
            key: "videos",
            title: "Videos",
            count: dashboardData.fileCategories.videos,
            icon: "ri-video-line",
            bg: "bg-purple-50",
            color: "text-purple-600",
        },
        {
            key: "audio",
            title: "Audio Files",
            count: dashboardData.fileCategories.audio,
            icon: "ri-music-2-line",
            bg: "bg-pink-50",
            color: "text-pink-600",
        },
        {
            key: "documents",
            title: "Documents",
            count: dashboardData.fileCategories.documents,
            icon: "ri-file-text-line",
            bg: "bg-cyan-50",
            color: "text-cyan-600",
        },
        {
            key: "pdf",
            title: "PDF Files",
            count: dashboardData.fileCategories.pdf,
            icon: "ri-file-pdf-2-line",
            bg: "bg-red-50",
            color: "text-red-600",
        },
        {
            key: "zip",
            title: "ZIP Files",
            count: dashboardData.fileCategories.zip,
            icon: "ri-file-zip-line",
            bg: "bg-yellow-50",
            color: "text-yellow-600",
        },
        {
            key: "other",
            title: "Other Files",
            count: dashboardData.fileCategories.other,
            icon: "ri-file-unknow-line",
            bg: "bg-slate-100",
            color: "text-slate-600",
        },
    ];

    /*
    |--------------------------------------------------------------------------
    | Statistics
    |--------------------------------------------------------------------------
    */

    const statistics = [
        {
            title: "Uploaded Files",
            value: formatNumber(dashboardData.statistics.uploadedFiles),
            icon: "ri-upload-cloud-2-line",
        },
        {
            title: "Shared Files",
            value: formatNumber(dashboardData.statistics.sharedFiles),
            icon: "ri-share-forward-line",
        },
        {
            title: "Favourite Files",
            value: formatNumber(dashboardData.statistics.favouriteFiles),
            icon: "ri-star-line",
        },
        {
            title: "Transactions",
            value: formatNumber(dashboardData.statistics.transactions),
            icon: "ri-exchange-dollar-line",
        },
        {
            title: "Transaction Amount",
            value: formatCurrency(dashboardData.statistics.transactionAmount),
            icon: "ri-money-rupee-circle-line",
        },
        {
            title: "Total Coins",
            value: formatNumber(dashboardData.statistics.coins),
            icon: "ri-coin-line",
        },
        {
            title: "Coins Spent",
            value: formatNumber(dashboardData.statistics.coinsSpent),
            icon: "ri-coins-line",
        },
    ];

    /*
    |--------------------------------------------------------------------------
    | Chart Data
    |--------------------------------------------------------------------------
    */

    const storageUsed = dashboardData.usage.storage.used;
    const storageTotal = dashboardData.usage.storage.total;
    const storageRemaining = storageTotal - storageUsed;

    const doughnutData = {
        labels: ["Used Storage", "Remaining"],
        datasets: [
            {
                data: [storageUsed, storageRemaining],
                backgroundColor: ["#2563eb", "#e2e8f0"],
                borderWidth: 0,
                hoverOffset: 3,
            },
        ],
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "76%",
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                padding: 12,
                displayColors: false,
                callbacks: {
                    label: (context) => `${context.label}: ${context.raw} GB`,
                },
            },
        },
    };

    const lineData = {
        labels: [
            "19 Aug",
            "20 Aug",
            "21 Aug",
            "22 Aug",
            "23 Aug",
            "24 Aug",
            "25 Aug",
        ],
        datasets: [
            {
                label: "Uploads",
                data: [42, 58, 51, 76, 68, 91, 84],
                borderColor: "#2563eb",
                backgroundColor: "rgba(37, 99, 235, 0.10)",
                fill: true,
                tension: 0.4,
                borderWidth: 2.5,
                pointRadius: 3,
                pointHoverRadius: 6,
                pointBorderWidth: 2,
                pointBackgroundColor: "#ffffff",
                pointBorderColor: "#2563eb",
            },
        ],
    };

    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            intersect: false,
            mode: "index",
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: "#0f172a",
                padding: 12,
                titleFont: {
                    size: 12,
                },
                bodyFont: {
                    size: 12,
                },
                displayColors: false,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                border: {
                    display: false,
                },
                ticks: {
                    color: "#94a3b8",
                    font: {
                        size: 10,
                    },
                },
            },
            y: {
                beginAtZero: true,
                border: {
                    display: false,
                },
                grid: {
                    color: "#f1f5f9",
                },
                ticks: {
                    color: "#94a3b8",
                    font: {
                        size: 10,
                    },
                },
            },
        },
    };

    /*
    |--------------------------------------------------------------------------
    | Scroll helper
    |--------------------------------------------------------------------------
    */

    const scrollToSection = (ref) => {
        ref?.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    /*
    |--------------------------------------------------------------------------
    | Skeleton
    |--------------------------------------------------------------------------
    */

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-[1600px] animate-pulse space-y-6">
                    <div className="h-28 rounded-2xl bg-white" />

                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 xl:grid-cols-7">
                        {Array.from({ length: 7 }).map((_, index) => (
                            <div
                                key={index}
                                className="h-36 rounded-2xl bg-white"
                            />
                        ))}
                    </div>

                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                        <div className="h-64 rounded-2xl bg-white" />
                        <div className="h-64 rounded-2xl bg-white" />
                        <div className="h-64 rounded-2xl bg-white" />
                    </div>

                    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                        <div className="h-[500px] rounded-2xl bg-white" />
                        <div className="h-[500px] rounded-2xl bg-white" />
                    </div>
                </div>
            </div>
        );
    }

    return (

        <main className="pt-[90px] bg-[#f8fafc]">

            <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8 lg:py-7">

                <header className="mb-7">

                    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

                        <div className="hidden sm:block">

                            <div className="mb-2 flex items-center gap-2">

                                <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />

                                <span className="text-xs font-bold uppercase tracking-[0.15em] text-blue-600">
                                    Welcome Back,
                                </span>

                            </div>

                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                Dear John Doe 👋
                            </h1>

                            <p className="mt-1 text-sm text-slate-500">
                                Here's an overview of your files, storage and activity.
                            </p>

                        </div>

                    </div>

                </header>

                <section>

                    <div className="mb-4 flex items-end justify-between">

                        <div>

                            <h2 className="text-lg font-bold text-slate-900">
                                File Overview
                            </h2>

                            <p className="text-xs text-slate-500">
                                Total files by category
                            </p>

                        </div>

                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-7">

                        {categoryCards.map((card) => {

                            const isActive = activeCategory === card.key;

                            return (

                                <button
                                    type="button"
                                    key={card.key}
                                    className={`group rounded-2xl border bg-white p-4 text-left shadow-sm transition-all duration-300 sm:p-5 border-slate-200 hover:-translate-y-1 hover:border-blue-200`}
                                >
                                    <div className="flex items-center justify-between">

                                        <div
                                            className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.bg} transition-transform duration-300 group-hover: scale-110`}
                                        >
                                            <i className={`${card.icon} ${card.color} text-xl`} />
                                        </div>

                                    </div>

                                    <p className="mt-4 truncate text-xs font-medium text-slate-500">
                                        {card.title}
                                    </p>

                                    <p className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
                                        {formatNumber(card.count)}
                                    </p>

                                </button>

                            );
                        })}

                    </div>

                </section>

                <section ref={usageRef} className="scroll-mt-5 pt-7">

                    <div className="mb-4">

                        <h2 className="text-lg font-bold text-slate-900">
                            Storage & Usage Analytics
                        </h2>

                        <p className="text-xs text-slate-500">
                            Monitor your account capacity and activity
                        </p>

                    </div>

                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

                        {/* Storage Chart */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                            <div className="flex items-center justify-between">

                                <div>

                                    <p className="text-sm font-bold text-slate-900">
                                        Storage Usage
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        Current storage consumption
                                    </p>

                                </div>

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                                    <i className="ri-hard-drive-3-line text-lg text-blue-600" />
                                </div>

                            </div>

                            <div className="relative mt-5 h-44">

                                <Doughnut
                                    data={doughnutData}
                                    options={doughnutOptions}
                                />

                                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">

                                    <span className="text-3xl font-bold text-slate-900">
                                        {percentage(storageUsed, storageTotal)}%
                                    </span>

                                    <span className="text-[11px] text-slate-400">
                                        Used
                                    </span>

                                </div>

                            </div>

                            <div className="mt-4 flex items-center justify-between">

                                <div>
                                    <p className="text-xs text-slate-500">Used</p>
                                    <p className="mt-1 text-sm font-bold text-slate-900">
                                        {storageUsed} GB
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="text-xs text-slate-500">Remaining</p>
                                    <p className="mt-1 text-sm font-bold text-emerald-600">
                                        {storageRemaining} GB
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="text-xs text-slate-500">Total</p>
                                    <p className="mt-1 text-sm font-bold text-slate-900">
                                        {storageTotal} GB
                                    </p>
                                </div>

                            </div>

                        </div>

                        {/* Folder Usage */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                            <div className="flex items-center justify-between">

                                <div>

                                    <p className="text-sm font-bold text-slate-900">
                                        Folder Usage
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        Folder capacity
                                    </p>

                                </div>

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50">
                                    <i className="ri-folder-3-line text-lg text-cyan-600" />
                                </div>

                            </div>

                            <div className="mt-7">

                                <div className="flex items-end justify-between">

                                    <div>

                                        <p className="text-3xl font-bold text-slate-900">
                                            {dashboardData.usage.folders.used}
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500">
                                            of {dashboardData.usage.folders.total} folders used
                                        </p>

                                    </div>

                                    <span className="text-2xl font-bold text-blue-600">
                                        {percentage(
                                            dashboardData.usage.folders.used,
                                            dashboardData.usage.folders.total
                                        )}
                                        %
                                    </span>

                                </div>

                                <div className="mt-7 h-3 overflow-hidden rounded-full bg-slate-100">

                                    <div
                                        className="h-full rounded-full bg-blue-600 transition-all duration-1000"
                                        style={{
                                            width: `${percentage(
                                                dashboardData.usage.folders.used,
                                                dashboardData.usage.folders.total
                                            )
                                                }% `,
                                        }}
                                    />

                                </div>

                                <div className="mt-5 grid grid-cols-2 gap-3">

                                    <div className="rounded-xl bg-slate-50 p-3">

                                        <p className="text-[11px] text-slate-400">
                                            Used Folders
                                        </p>

                                        <p className="mt-1 text-sm font-bold text-slate-800">
                                            {dashboardData.usage.folders.used}
                                        </p>

                                    </div>

                                    <div className="rounded-xl bg-emerald-50 p-3">

                                        <p className="text-[11px] text-emerald-600">
                                            Remaining
                                        </p>

                                        <p className="mt-1 text-sm font-bold text-emerald-700">
                                            {dashboardData.usage.folders.total -
                                                dashboardData.usage.folders.used}
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* Shared Usage */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                            <div className="flex items-center justify-between">

                                <div>

                                    <p className="text-sm font-bold text-slate-900">
                                        Shared Limit
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        File sharing capacity
                                    </p>

                                </div>

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">
                                    <i className="ri-share-forward-line text-lg text-purple-600" />
                                </div>

                            </div>

                            <div className="mt-7">

                                <div className="flex items-end justify-between">

                                    <div>

                                        <p className="text-3xl font-bold text-slate-900">
                                            {dashboardData.usage.shared.used}
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500">
                                            of {dashboardData.usage.shared.total} files shared
                                        </p>

                                    </div>

                                    <span className="text-2xl font-bold text-blue-600">
                                        {percentage(
                                            dashboardData.usage.shared.used,
                                            dashboardData.usage.shared.total
                                        )}
                                        %
                                    </span>

                                </div>

                                <div className="mt-7 h-3 overflow-hidden rounded-full bg-slate-100">

                                    <div
                                        className="h-full rounded-full bg-blue-600 transition-all duration-1000"
                                        style={{
                                            width: `${percentage(
                                                dashboardData.usage.shared.used,
                                                dashboardData.usage.shared.total
                                            )
                                                }% `,
                                        }}
                                    />

                                </div>

                                <div className="mt-5 grid grid-cols-2 gap-3">

                                    <div className="rounded-xl bg-slate-50 p-3">

                                        <p className="text-[11px] text-slate-400">
                                            Shared Files
                                        </p>

                                        <p className="mt-1 text-sm font-bold text-slate-800">
                                            {dashboardData.usage.shared.used}
                                        </p>

                                    </div>

                                    <div className="rounded-xl bg-emerald-50 p-3">

                                        <p className="text-[11px] text-emerald-600">
                                            Remaining
                                        </p>

                                        <p className="mt-1 text-sm font-bold text-emerald-700">
                                            {dashboardData.usage.shared.total -
                                                dashboardData.usage.shared.used}
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </section>

                <section className="mt-8 grid grid-cols-1 gap-5 xl:grid-cols-2">

                    {/* Recent Uploads */}
                    <div
                        ref={uploadsRef}
                        className="scroll-mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                    >
                        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

                            <div>

                                <h2 className="text-sm font-bold text-slate-900">
                                    Recent Uploads
                                </h2>

                                <p className="mt-1 text-xs text-slate-500">
                                    Last 10 uploaded files
                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setActiveActivityTab("uploads");
                                    scrollToSection(uploadsRef);
                                }}
                                className="cursor-pointer text-xs font-semibold text-blue-600 transition-colors hover:text-blue-700"
                            >
                                View All
                                <i className="ri-arrow-right-line ml-1" />
                            </button>

                        </div>

                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[620px]">

                                <thead>

                                    <tr className="border-b border-slate-100 bg-slate-50/70 text-left">

                                        <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                            File
                                        </th>

                                        <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                            Date & Time
                                        </th>

                                        <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                            Size
                                        </th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {dashboardData.recentUploads.map((file) => (

                                        <tr
                                            key={file.id}
                                            className="group cursor-pointer border-b border-slate-100 last:border-0 transition-colors hover:bg-blue-50/40"
                                        >
                                            <td className="px-5 py-3">

                                                <div className="flex items-center gap-3">

                                                    <div
                                                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${file.iconBg} `}
                                                    >

                                                        <i className={`${file.icon} ${file.iconColor} text-lg`} />

                                                    </div>

                                                    <div className="min-w-0">

                                                        <p className="max-w-[220px] truncate text-xs font-semibold text-slate-800">
                                                            {file.name}
                                                        </p>

                                                        <p className="mt-0.5 text-[10px] text-slate-400">
                                                            {file.type}
                                                        </p>

                                                    </div>

                                                </div>

                                            </td>

                                            <td className="px-5 py-3 text-xs text-slate-500">
                                                {file.date}
                                            </td>

                                            <td className="px-5 py-3 text-xs font-medium text-slate-600">
                                                {file.size}
                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    </div>

                    {/* Recent Shared */}
                    <div
                        ref={sharedRef}
                        className="scroll-mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                    >
                        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

                            <div>

                                <h2 className="text-sm font-bold text-slate-900">
                                    Recent Shared Files
                                </h2>

                                <p className="mt-1 text-xs text-slate-500">
                                    Last 10 shared files
                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setActiveActivityTab("shared");
                                    scrollToSection(sharedRef);
                                }}
                                className="cursor-pointer text-xs font-semibold text-blue-600 transition-colors hover:text-blue-700"
                            >
                                View All
                                <i className="ri-arrow-right-line ml-1" />
                            </button>

                        </div>

                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[620px]">

                                <thead>

                                    <tr className="border-b border-slate-100 bg-slate-50/70 text-left">

                                        <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                            File
                                        </th>

                                        <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                            Shared With
                                        </th>

                                        <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                            Status
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {dashboardData.recentSharedFiles.map((file) => {

                                        const statusStyle =
                                            file.status === "Active"
                                                ? "bg-emerald-50 text-emerald-600"
                                                : file.status === "Pending"
                                                    ? "bg-yellow-50 text-yellow-600"
                                                    : "bg-slate-100 text-slate-500";

                                        return (

                                            <tr
                                                key={file.id}
                                                className="cursor-pointer border-b border-slate-100 last:border-0 transition-colors hover:bg-blue-50/40"
                                            >
                                                <td className="px-5 py-3">

                                                    <div className="flex items-center gap-3">

                                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">

                                                            <i className="ri-share-forward-line text-lg text-blue-600" />

                                                        </div>

                                                        <div className="min-w-0">

                                                            <p className="max-w-[200px] truncate text-xs font-semibold text-slate-800">
                                                                {file.name}
                                                            </p>

                                                            <p className="mt-0.5 text-[10px] text-slate-400">
                                                                {file.date}
                                                            </p>

                                                        </div>

                                                    </div>

                                                </td>

                                                <td className="px-5 py-3">

                                                    <div className="flex items-center gap-2">

                                                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[9px] font-bold text-blue-700">

                                                            {file.initials}

                                                        </div>

                                                        <span className="max-w-[120px] truncate text-xs text-slate-600">
                                                            {file.sharedWith}
                                                        </span>

                                                    </div>

                                                </td>

                                                <td className="px-5 py-3">

                                                    <span
                                                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusStyle} `}
                                                    >
                                                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                                        {file.status}
                                                    </span>

                                                </td>

                                            </tr>

                                        );

                                    })}

                                </tbody>

                            </table>

                        </div>

                    </div>

                </section>

                <section className="mt-8">

                    <div className="mb-4">

                        <h2 className="text-lg font-bold text-slate-900">
                            Account Statistics
                        </h2>

                        <p className="text-xs text-slate-500">
                            Complete overview of your account activity
                        </p>

                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">

                        {statistics.map((stat) => (

                            <div
                                key={stat.title}
                                className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg sm:p-5"
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 transition-transform duration-300 group-hover:scale-110">

                                    <i className={`${stat.icon} text - lg text - blue - 600`} />

                                </div>

                                <p className="mt-4 truncate text-xs font-medium text-slate-500">
                                    {stat.title}
                                </p>

                                <p className="mt-1 truncate text-lg font-bold text-slate-900 sm:text-xl">
                                    {stat.value}
                                </p>

                            </div>

                        ))}

                    </div>

                </section>

                {/* ================================================================
            BOTTOM INFO
        ================================================================= */}

                <section className="mt-8 overflow-hidden rounded-2xl bg-blue-600 p-6 shadow-lg shadow-blue-600/10 sm:p-8">

                    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

                        <div className="max-w-xl">

                            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                                <i className="ri-cloud-line text-xl text-white" />
                            </div>

                            <h2 className="text-xl font-bold text-white">
                                Keep your files organized
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-blue-100">
                                You are currently using{" "}
                                <strong className="text-white">
                                    {percentage(storageUsed, storageTotal)}%
                                </strong>{" "}
                                of your available storage. You still have{" "}
                                <strong className="text-white">
                                    {storageRemaining} GB
                                </strong>{" "}
                                available.
                            </p>

                        </div>

                        <button
                            type="button"
                            onClick={() => scrollToSection(usageRef)}
                            className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-600 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-50 hover:shadow-lg active:scale-95"
                        >
                            View Usage
                            <i className="ri-arrow-right-line" />
                        </button>

                    </div>

                </section>

            </div>

        </main>
    );
};

export default Dashboard;
