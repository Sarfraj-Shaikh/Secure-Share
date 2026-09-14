import { useMemo, useState } from "react";

const ITEMS_PER_PAGE = 5;

// Mock Data
const defaultHistory = [
    {
        id: "TXN-90281",
        name: "Cloud Storage Expansion 100GB",
        date: "14 Sep 2026, 11:30 AM",
        credits: "+500",
        type: "Storage",
        amount: 499,
        status: "Completed",
    },
    {
        id: "TXN-88310",
        name: "Created Project Shared Folder",
        date: "12 Sep 2026, 03:15 PM",
        credits: "-50",
        type: "Folders",
        amount: 0,
        status: "Completed",
    },
    {
        id: "TXN-74102",
        name: "Password Protected Link Share",
        date: "10 Sep 2026, 09:45 AM",
        credits: "-20",
        type: "Shares",
        amount: 0,
        status: "Completed",
    },
    {
        id: "TXN-65129",
        name: "Annual Storage Plan Upgrade",
        date: "05 Sep 2026, 02:20 PM",
        credits: "+2000",
        type: "Storage",
        amount: 1999,
        status: "Completed",
    },
    {
        id: "TXN-51203",
        name: "Failed Transfer Attempt",
        date: "01 Sep 2026, 06:10 PM",
        credits: "0",
        type: "Shares",
        amount: 0,
        status: "Failed",
    },
    {
        id: "TXN-49012",
        name: "New Shared Team Folder",
        date: "28 Aug 2026, 01:05 PM",
        credits: "-50",
        type: "Folders",
        amount: 0,
        status: "Pending",
    },
    {
        id: "TXN-38910",
        name: "Extra Storage Top-up",
        date: "20 Aug 2026, 10:00 AM",
        credits: "+100",
        type: "Storage",
        amount: 149,
        status: "Completed",
    },
];

export default function History({
    data = defaultHistory,
    loading = false,
    error = null,
}) {
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("latest");
    const [sortOpen, setSortOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);

    const tabs = ["All", "Storage", "Folders", "Shares"];

    /*
     * Filter & Sort Logic (Computed via useMemo)
     */
    const filteredHistory = useMemo(() => {
        const query = search.trim().toLowerCase();

        const result = data.filter((item) => {
            const matchesTab =
                activeTab === "All" ||
                item.type.toLowerCase() === activeTab.toLowerCase();

            const matchesSearch =
                !query ||
                item.name.toLowerCase().includes(query) ||
                item.id.toLowerCase().includes(query) ||
                item.type.toLowerCase().includes(query) ||
                item.status.toLowerCase().includes(query);

            return matchesTab && matchesSearch;
        });

        return [...result].sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return sort === "latest" ? dateB - dateA : dateA - dateB;
        });
    }, [data, search, sort, activeTab]);

    /*
     * Pagination Logic
     */
    const totalPages = Math.ceil(filteredHistory.length / ITEMS_PER_PAGE);

    const paginatedHistory = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredHistory.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredHistory, currentPage]);

    /*
     * Handlers
     */
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    const handleSearchChange = (value) => {
        setSearch(value);
        setCurrentPage(1);
    };

    const handleSortChange = (value) => {
        setSort(value);
        setSortOpen(false);
        setCurrentPage(1);
    };

    const getStatusBadge = (status) => {
        switch (status.toLowerCase()) {
            case "completed":
                return "bg-emerald-50 text-emerald-600 border-emerald-100";
            case "pending":
                return "bg-amber-50 text-amber-600 border-amber-100";
            case "failed":
                return "bg-rose-50 text-rose-600 border-rose-100";
            default:
                return "bg-slate-50 text-slate-600 border-slate-100";
        }
    };

    const getTypeIcon = (type) => {
        switch (type.toLowerCase()) {
            case "storage":
                return "ri-database-2-line bg-blue-50 text-blue-600";
            case "folders":
                return "ri-folder-shared-line bg-indigo-50 text-indigo-600";
            case "shares":
                return "ri-share-line bg-cyan-50 text-cyan-600";
            default:
                return "ri-file-list-line bg-slate-50 text-slate-600";
        }
    };

    return (
        <div className="w-full mx-auto pt-[90px] pb-5">
            <div className="overflow-hidden bg-white transition-all duration-300">
                {/* ================= HEADER & TABS ================= */}
                <div className="border-b border-slate-100 p-4 sm:p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                History & Logs
                            </h1>
                            <p className="mt-1 text-sm text-slate-500">
                                Track all your storage, folder, and sharing activities in one place.
                            </p>
                        </div>

                        {/* Search & Sort Controls */}
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                            {/* Search Bar */}
                            <div className="relative w-full sm:w-64">
                                <i className="ri-search-line absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    placeholder="Search history..."
                                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-9 text-sm text-slate-700 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                                />
                                {search && (
                                    <button
                                        type="button"
                                        onClick={() => handleSearchChange("")}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        <i className="ri-close-circle-fill text-base" />
                                    </button>
                                )}
                            </div>

                            {/* Sort Dropdown */}
                            <div className="relative w-full sm:w-auto">
                                <button
                                    type="button"
                                    onClick={() => setSortOpen((open) => !open)}
                                    className="flex h-10 w-full sm:w-32 items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-blue-300 hover:bg-slate-50"
                                >
                                    <span className="flex items-center gap-2">
                                        <i className="ri-sort-desc text-blue-600 text-base" />
                                        {sort === "latest" ? "Latest" : "Oldest"}
                                    </span>
                                    <i
                                        className={`ri-arrow-down-s-line transition-transform duration-200 ${sortOpen ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>

                                {sortOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setSortOpen(false)}
                                        />
                                        <div className="absolute right-0 z-20 mt-2 w-full sm:w-36 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
                                            <button
                                                type="button"
                                                onClick={() => handleSortChange("latest")}
                                                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${sort === "latest"
                                                        ? "bg-blue-50 font-semibold text-blue-600"
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
                                                onClick={() => handleSortChange("oldest")}
                                                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${sort === "oldest"
                                                        ? "bg-blue-50 font-semibold text-blue-600"
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

                    {/* Navigation Tabs */}
                    <div className="mt-6 flex items-center gap-2 border-b border-slate-100 overflow-x-auto no-scrollbar pb-px">
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab;
                            return (
                                <button
                                    key={tab}
                                    onClick={() => handleTabChange(tab)}
                                    className={`relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 whitespace-nowrap rounded-lg ${isActive
                                            ? "text-blue-600 bg-blue-50/80"
                                            : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                                        }`}
                                >
                                    {tab}
                                    {isActive && (
                                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ================= STATE HANDLING ================= */}

                {/* 1. Loading State */}
                {loading && (
                    <div className="divide-y divide-slate-100 p-4 sm:p-6">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between py-4 animate-pulse gap-4"
                            >
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <div className="h-10 w-10 rounded-xl bg-slate-100 shrink-0" />
                                    <div className="space-y-2 flex-1">
                                        <div className="h-4 w-1/3 rounded bg-slate-100" />
                                        <div className="h-3 w-1/4 rounded bg-slate-100" />
                                    </div>
                                </div>
                                <div className="h-4 w-16 rounded bg-slate-100 hidden sm:block" />
                                <div className="h-6 w-20 rounded-full bg-slate-100" />
                            </div>
                        ))}
                    </div>
                )}

                {/* 2. Error State */}
                {!loading && error && (
                    <div className="flex min-h-[320px] flex-col items-center justify-center p-6 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 mb-4">
                            <i className="ri-error-warning-line text-2xl" />
                        </div>
                        <h3 className="text-base font-semibold text-slate-900">
                            Failed to load history
                        </h3>
                        <p className="mt-1 max-w-sm text-sm text-slate-500">
                            {error || "An unexpected error occurred while fetching your records."}
                        </p>
                    </div>
                )}

                {/* 3. Empty State (No Data) */}
                {!loading && !error && data.length === 0 && (
                    <div className="flex min-h-[320px] flex-col items-center justify-center p-6 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-4">
                            <i className="ri-history-line text-2xl" />
                        </div>
                        <h3 className="text-base font-semibold text-slate-900">
                            No history records yet
                        </h3>
                        <p className="mt-1 max-w-sm text-sm text-slate-500">
                            Your transaction and activity logs will automatically appear here.
                        </p>
                    </div>
                )}

                {/* 4. Not Found State (Filter/Search Result Empty) */}
                {!loading && !error && data.length > 0 && filteredHistory.length === 0 && (
                    <div className="flex min-h-[320px] flex-col items-center justify-center p-6 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-4">
                            <i className="ri-search-2-line text-2xl" />
                        </div>
                        <h3 className="text-base font-semibold text-slate-900">
                            No matching records found
                        </h3>
                        <p className="mt-1 max-w-sm text-sm text-slate-500">
                            We couldn't find anything matching "{search}". Try resetting your search or tabs.
                        </p>
                        <button
                            type="button"
                            onClick={() => {
                                setSearch("");
                                setActiveTab("All");
                            }}
                            className="mt-4 rounded-xl bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100 transition-colors"
                        >
                            Reset Filters
                        </button>
                    </div>
                )}

                {/* ================= DATA TABLE / LIST ================= */}
                {!loading && !error && paginatedHistory.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    <th className="py-3.5 px-4 sm:px-6">Transaction Name</th>
                                    <th className="py-3.5 px-4">Date</th>
                                    <th className="py-3.5 px-4">Type</th>
                                    <th className="py-3.5 px-4">Credits</th>
                                    <th className="py-3.5 px-4">Amount (INR)</th>
                                    <th className="py-3.5 px-4">Status</th>
                                    <th className="py-3.5 px-4 sm:px-6 text-right">Transaction ID</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {paginatedHistory.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="group transition-colors duration-150 hover:bg-blue-50/30"
                                    >
                                        {/* Name */}
                                        <td className="py-4 px-4 sm:px-6">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${getTypeIcon(
                                                        item.type
                                                    )}`}
                                                >
                                                    <i className="text-lg" />
                                                </div>
                                                <span className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                                                    {item.name}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Date */}
                                        <td className="py-4 px-4 whitespace-nowrap text-slate-500">
                                            {item.date}
                                        </td>

                                        {/* Type */}
                                        <td className="py-4 px-4 whitespace-nowrap">
                                            <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                                                {item.type}
                                            </span>
                                        </td>

                                        {/* Credits */}
                                        <td className="py-4 px-4 whitespace-nowrap font-medium">
                                            <span
                                                className={
                                                    item.credits.startsWith("+")
                                                        ? "text-emerald-600"
                                                        : item.credits.startsWith("-")
                                                            ? "text-rose-600"
                                                            : "text-slate-500"
                                                }
                                            >
                                                {item.credits}
                                            </span>
                                        </td>

                                        {/* Amount */}
                                        <td className="py-4 px-4 whitespace-nowrap font-semibold text-slate-800">
                                            ₹{item.amount.toLocaleString("en-IN")}
                                        </td>

                                        {/* Status */}
                                        <td className="py-4 px-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(
                                                    item.status
                                                )}`}
                                            >
                                                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                                {item.status}
                                            </span>
                                        </td>

                                        {/* Transaction ID */}
                                        <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap font-mono text-xs text-slate-400">
                                            {item.id}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ================= PAGINATION ================= */}
                {!loading && !error && totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 px-4 py-4 sm:px-6">
                        <p className="text-xs sm:text-sm text-slate-500 text-center sm:text-left">
                            Showing{" "}
                            <span className="font-semibold text-slate-700">
                                {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                            </span>{" "}
                            to{" "}
                            <span className="font-semibold text-slate-700">
                                {Math.min(
                                    currentPage * ITEMS_PER_PAGE,
                                    filteredHistory.length
                                )}
                            </span>{" "}
                            of{" "}
                            <span className="font-semibold text-slate-700">
                                {filteredHistory.length}
                            </span>{" "}
                            results
                        </p>

                        <div className="flex items-center gap-1.5">
                            <button
                                type="button"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((p) => p - 1)}
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <i className="ri-arrow-left-s-line text-lg" />
                            </button>

                            {Array.from({ length: totalPages }).map((_, idx) => {
                                const pageNum = idx + 1;
                                const isActive = currentPage === pageNum;
                                return (
                                    <button
                                        key={pageNum}
                                        type="button"
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`flex h-9 min-w-[36px] items-center justify-center rounded-lg px-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 ${isActive
                                                ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                                                : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}

                            <button
                                type="button"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((p) => p - 1)}
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <i className="ri-arrow-right-s-line text-lg" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}