import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const AllUsers = () => {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("latest");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const dropdownRef = useRef(null);

    const usersPerPage = 8;

    const sortOptions = [
        { label: "Latest First", value: "latest" },
        { label: "Oldest First", value: "oldest" },
    ];

    // =========================================================
    // OUTSIDE CLICK FOR DROPDOWN
    // =========================================================
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // =========================================================
    // FETCH USERS
    // =========================================================

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);

                await new Promise((resolve) =>
                    setTimeout(resolve, 1200)
                );

                setUsers([
                    {
                        id: 1,
                        name: "Rahul Sharma",
                        email: "rahul@example.com",
                        phone: "+91 98765 43210",
                        verified: true,
                        lastLogin: "2026-09-14T10:30:00",
                        createdAt: "2026-01-10T08:20:00",
                        status: "Active",
                        totalFolders: 18,
                        storageUsed: "4.8 GB",
                        credits: 240,
                        shareLimit: "10 GB",
                    },
                    {
                        id: 2,
                        name: "Priya Patel",
                        email: "priya@example.com",
                        phone: "+91 98765 12345",
                        verified: true,
                        lastLogin: "2026-09-13T15:45:00",
                        createdAt: "2026-02-18T11:10:00",
                        status: "Active",
                        totalFolders: 24,
                        storageUsed: "7.2 GB",
                        credits: 180,
                        shareLimit: "15 GB",
                    },
                    {
                        id: 3,
                        name: "Amit Verma",
                        email: "amit@example.com",
                        phone: "+91 91234 56789",
                        verified: false,
                        lastLogin: "2026-09-11T09:20:00",
                        createdAt: "2026-03-02T10:00:00",
                        status: "Blocked",
                        totalFolders: 8,
                        storageUsed: "2.1 GB",
                        credits: 50,
                        shareLimit: "5 GB",
                    },
                    {
                        id: 4,
                        name: "Neha Singh",
                        email: "neha@example.com",
                        phone: "+91 99887 66554",
                        verified: true,
                        lastLogin: "2026-09-12T17:30:00",
                        createdAt: "2026-03-22T13:15:00",
                        status: "Active",
                        totalFolders: 32,
                        storageUsed: "11.5 GB",
                        credits: 420,
                        shareLimit: "20 GB",
                    },
                    {
                        id: 5,
                        name: "Vikas Kumar",
                        email: "vikas@example.com",
                        phone: "+91 97654 32109",
                        verified: false,
                        lastLogin: "2026-09-08T12:40:00",
                        createdAt: "2026-04-05T09:45:00",
                        status: "Active",
                        totalFolders: 12,
                        storageUsed: "3.6 GB",
                        credits: 120,
                        shareLimit: "10 GB",
                    },
                    {
                        id: 6,
                        name: "Sneha Joshi",
                        email: "sneha@example.com",
                        phone: "+91 93456 78901",
                        verified: true,
                        lastLogin: "2026-09-07T16:20:00",
                        createdAt: "2026-04-19T15:20:00",
                        status: "Active",
                        totalFolders: 15,
                        storageUsed: "5.4 GB",
                        credits: 300,
                        shareLimit: "10 GB",
                    },
                    {
                        id: 7,
                        name: "Arjun Mehta",
                        email: "arjun@example.com",
                        phone: "+91 94567 89012",
                        verified: true,
                        lastLogin: "2026-09-06T11:30:00",
                        createdAt: "2026-05-01T12:30:00",
                        status: "Blocked",
                        totalFolders: 6,
                        storageUsed: "1.8 GB",
                        credits: 70,
                        shareLimit: "5 GB",
                    },
                    {
                        id: 8,
                        name: "Pooja Gupta",
                        email: "pooja@example.com",
                        phone: "+91 92345 67890",
                        verified: true,
                        lastLogin: "2026-09-05T14:10:00",
                        createdAt: "2026-05-17T10:30:00",
                        status: "Active",
                        totalFolders: 21,
                        storageUsed: "8.3 GB",
                        credits: 260,
                        shareLimit: "15 GB",
                    },
                    {
                        id: 9,
                        name: "Rohit Jain",
                        email: "rohit@example.com",
                        phone: "+91 90123 45678",
                        verified: false,
                        lastLogin: "2026-09-04T09:50:00",
                        createdAt: "2026-06-04T09:20:00",
                        status: "Active",
                        totalFolders: 10,
                        storageUsed: "2.8 GB",
                        credits: 90,
                        shareLimit: "5 GB",
                    },
                ]);

            } catch (error) {
                console.error("Failed to fetch users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // =========================================================
    // SEARCH + SORT
    // =========================================================

    const filteredUsers = useMemo(() => {
        const query = search.trim().toLowerCase();

        let result = users.filter((user) => {
            if (!query) return true;
            return (
                user.name?.toLowerCase().includes(query) ||
                user.email?.toLowerCase().includes(query) ||
                user.phone?.toLowerCase().includes(query)
            );
        });

        result.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return sort === "latest" ? dateB - dateA : dateA - dateB;
        });

        return result;
    }, [users, search, sort]);

    // =========================================================
    // PAGINATION
    // =========================================================

    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    const startIndex = (currentPage - 1) * usersPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, sort]);

    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const getInitials = (name) => {
        if (!name) return "U";
        return name
            .split(" ")
            .slice(0, 2)
            .map((word) => word[0])
            .join("")
            .toUpperCase();
    };

    const clearSearch = () => {
        setSearch("");
        setSort("latest");
        setCurrentPage(1);
    };

    return (
        <div className="min-h-screen bg-slate-50 px-4 pb-10 pt-24 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                
                {/* PAGE HEADER */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
                            Management
                        </p>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                            All Users
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Manage and monitor all registered users.
                        </p>
                    </div>

                    {!loading && (
                        <div className="w-fit rounded-xl border border-blue-100 bg-blue-50 px-4 py-2">
                            <span className="text-sm font-semibold text-blue-700">
                                {users.length} Users
                            </span>
                        </div>
                    )}
                </div>

                {/* SEARCH + FILTER */}
                <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
                    <div className="flex flex-col gap-3 md:flex-row">
                        
                        {/* SEARCH */}
                        <div className="relative flex-1">
                            <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name, email or phone..."
                                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-10 text-sm text-slate-800 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={() => setSearch("")}
                                    className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                                >
                                    <i className="ri-close-line" />
                                </button>
                            )}
                        </div>

                        {/* CUSTOM DROPDOWN SORT */}
                        <div className="relative md:w-56" ref={dropdownRef}>
                            <button
                                type="button"
                                onClick={() => setIsDropdownOpen((prev) => !prev)}
                                className={`flex h-12 w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 outline-none transition-all duration-300 hover:bg-slate-100/70 ${
                                    isDropdownOpen ? "border-blue-400 bg-white ring-4 ring-blue-500/10" : ""
                                }`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <i className="ri-sort-desc text-lg text-slate-400" />
                                    <span>
                                        {sortOptions.find((opt) => opt.value === sort)?.label}
                                    </span>
                                </div>
                                <i
                                    className={`ri-arrow-down-s-line text-slate-400 transition-transform duration-300 ${
                                        isDropdownOpen ? "rotate-180" : ""
                                    }`}
                                />
                            </button>

                            {/* DROPDOWN MENU */}
                            {isDropdownOpen && (
                                <div className="absolute right-0 top-[calc(100%+6px)] z-50 w-full overflow-hidden rounded-xl border border-slate-100 bg-white p-1.5 shadow-xl shadow-slate-200/50 transition-all duration-200 animate-in fade-in zoom-in-95">
                                    {sortOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => {
                                                setSort(option.value);
                                                setIsDropdownOpen(false);
                                            }}
                                            className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs font-semibold transition-all ${
                                                sort === option.value
                                                    ? "bg-blue-50 text-blue-600"
                                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                            }`}
                                        >
                                            <span>{option.label}</span>
                                            {sort === option.value && (
                                                <i className="ri-check-line text-blue-600" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
                </div>

                {/* LOADING SKELETON */}
                {loading && (
                    <div className="space-y-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div key={index} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                                <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                                    <div className="flex items-center gap-3 lg:w-[280px]">
                                        <div className="h-12 w-12 shrink-0 rounded-xl bg-slate-200" />
                                        <div className="flex-1">
                                            <div className="mb-2 h-4 w-32 rounded bg-slate-200" />
                                            <div className="mb-1 h-3 w-44 rounded bg-slate-200" />
                                            <div className="h-3 w-28 rounded bg-slate-200" />
                                        </div>
                                    </div>
                                    <div className="grid flex-1 grid-cols-2 gap-4 sm:grid-cols-4">
                                        {Array.from({ length: 4 }).map((_, i) => (
                                            <div key={i}>
                                                <div className="mb-2 h-3 w-20 rounded bg-slate-200" />
                                                <div className="h-4 w-24 rounded bg-slate-200" />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="h-10 w-full rounded-xl bg-slate-200 lg:w-24" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* USER LIST */}
                {!loading && paginatedUsers.length > 0 && (
                    <div className="space-y-3">
                        {paginatedUsers.map((user) => (
                            <div key={user.id} className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg hover:shadow-slate-200/60 sm:p-5">
                                <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                                    <div className="flex min-w-0 items-center gap-3 lg:w-[285px]">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-sm font-bold text-white shadow-md shadow-blue-500/20">
                                            {getInitials(user.name)}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-1.5">
                                                <h3 className="truncate text-sm font-bold text-slate-900 sm:text-base">
                                                    {user.name}
                                                </h3>
                                                {user.verified && (
                                                    <span title="Verified" className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                                                        <i className="ri-verified-badge-fill text-sm" />
                                                    </span>
                                                )}
                                            </div>
                                            <p className="mt-0.5 truncate text-xs text-slate-500">{user.email}</p>
                                            <p className="mt-0.5 text-xs text-slate-400">{user.phone}</p>
                                        </div>
                                    </div>

                                    <div className="grid flex-1 grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3 lg:grid-cols-6">
                                        <div>
                                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Last Login</p>
                                            <p className="mt-1 text-xs font-semibold text-slate-700">{formatDate(user.lastLogin)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Created</p>
                                            <p className="mt-1 text-xs font-semibold text-slate-700">{formatDate(user.createdAt)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Folders</p>
                                            <p className="mt-1 text-xs font-semibold text-slate-700">{user.totalFolders}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Storage</p>
                                            <p className="mt-1 text-xs font-semibold text-slate-700">{user.storageUsed}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Credits</p>
                                            <p className="mt-1 text-xs font-semibold text-blue-600">{user.credits}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Share Limit</p>
                                            <p className="mt-1 text-xs font-semibold text-slate-700">{user.shareLimit}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4 lg:w-[125px] lg:flex-col lg:items-end lg:border-t-0 lg:pt-0">
                                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${user.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                                            <span className={`h-1.5 w-1.5 rounded-full ${user.status === "Active" ? "bg-emerald-500" : "bg-red-500"}`} />
                                            {user.status}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() => navigate(`/all-users/${user.id}`)}
                                            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 active:translate-y-0"
                                        >
                                            View
                                            <i className="ri-arrow-right-line transition-transform duration-300 group-hover:translate-x-0.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* EMPTY STATE */}
                {!loading && paginatedUsers.length === 0 && (
                    <div className="flex min-h-[380px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-5 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-500">
                            <i className="ri-user-search-line text-3xl" />
                        </div>
                        <h3 className="mt-5 text-lg font-bold text-slate-900">No users found</h3>
                        <p className="mt-1 max-w-sm text-sm text-slate-500">We couldn't find any user matching your current search or filter.</p>
                        {(search || sort !== "latest") && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700"
                            >
                                <i className="ri-refresh-line mr-2" />
                                Clear Filters
                            </button>
                        )}
                    </div>
                )}

                {/* PAGINATION */}
                {!loading && filteredUsers.length > 0 && totalPages > 1 && (
                    <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs text-slate-500">
                            Showing <span className="font-semibold text-slate-700">{startIndex + 1}</span> - <span className="font-semibold text-slate-700">{Math.min(startIndex + usersPerPage, filteredUsers.length)}</span> of <span className="font-semibold text-slate-700">{filteredUsers.length}</span> users
                        </p>
                        <div className="flex items-center gap-1.5">
                            <button
                                type="button"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-all duration-300 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <i className="ri-arrow-left-s-line" />
                            </button>
                            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                                <button
                                    key={page}
                                    type="button"
                                    onClick={() => setCurrentPage(page)}
                                    className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-xs font-semibold transition-all duration-300 ${
                                        currentPage === page ? "bg-blue-600 text-white shadow-md shadow-blue-600/20" : "border border-transparent text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                type="button"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-all duration-300 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <i className="ri-arrow-right-s-line" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllUsers;