import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyToken } from '../../../../../utils/isUserLogin';
import SpinLoader from '../../../shared/SpinLoader';

// Admin Config Mock (Backend Se Fetch Hone Wala Data)
const ADMIN_CONFIG = {
    minCredits: 100,
    maxCredits: 5000,
    ratePerCredit: 0.3, // ₹0.3 per credit (100 credits = ₹30)
    packages: [
        { credits: 100, label: 'Starter Pack' },
        { credits: 500, label: 'Pro Pack' },
        { credits: 1000, label: 'Value Pack' },
        { credits: 2500, label: 'Ultimate Pack' }
    ]
};

// Mock Initial Data
const INITIAL_STATS = { totalCredits: 4250, totalSpent: 1850 };

const INITIAL_TRANSACTIONS = [
    { id: 'TXN-98214', name: 'Bought Pro Pack', date: '2026-03-12', amount: 150, credits: 500, type: 'credit', status: 'Success' },
    { id: 'TXN-87123', name: 'Transfer to User #402', date: '2026-03-10', amount: 0, credits: 200, type: 'debit', status: 'Success' },
    { id: 'TXN-76192', name: 'AI Image Gen API Use', date: '2026-03-08', amount: 0, credits: 50, type: 'debit', status: 'Success' },
    { id: 'TXN-65104', name: 'Bought Starter Pack', date: '2026-03-01', amount: 30, credits: 100, type: 'credit', status: 'Success' },
    { id: 'TXN-54129', name: 'Failed Add Credits Attempt', date: '2026-02-28', amount: 300, credits: 1000, type: 'credit', status: 'Failed' },
    { id: 'TXN-43108', name: 'Bulk Data Export', date: '2026-02-20', amount: 0, credits: 150, type: 'debit', status: 'Success' }
];

export default function Wallet() {

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

    // Main States
    const [stats, setStats] = useState(INITIAL_STATS);
    const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    // Search, Filter & Pagination States
    const [search, setSearch] = useState('');
    const [sortOrder, setSortOrder] = useState('latest'); // 'latest' | 'oldest'
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    const dropdownRef = useRef(null);

    // Modal States
    const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

    // Form States (Buy Modal)
    const [buyAmount, setBuyAmount] = useState(ADMIN_CONFIG.minCredits);
    const [buyError, setBuyError] = useState('');

    // Form States (Transfer Modal)
    const [transferRecipient, setTransferRecipient] = useState('');
    const [transferCredits, setTransferCredits] = useState('');
    const [transferError, setTransferError] = useState('');

    // Close Dropdown on Click Outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Toast Handler
    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    // Filtered & Sorted Transactions
    const filteredTransactions = useMemo(() => {
        let list = transactions.filter(
            (t) =>
                t.name.toLowerCase().includes(search.toLowerCase()) ||
                t.id.toLowerCase().includes(search.toLowerCase())
        );

        return list.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
        });
    }, [transactions, search, sortOrder]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 1;
    const currentItems = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredTransactions.slice(start, start + itemsPerPage);
    }, [filteredTransactions, currentPage]);

    // Buy Credits Handler
    const handleBuySubmit = (e) => {
        e.preventDefault();
        const val = Number(buyAmount);

        if (val < ADMIN_CONFIG.minCredits) {
            setBuyError(`Minimum ${ADMIN_CONFIG.minCredits} credits require hain.`);
            return;
        }
        if (val > ADMIN_CONFIG.maxCredits) {
            setBuyError(`Maximum ${ADMIN_CONFIG.maxCredits} credits hi le sakte hain.`);
            return;
        }

        setLoading(true);
        setBuyError('');

        setTimeout(() => {
            const calculatedINR = val * ADMIN_CONFIG.ratePerCredit;
            const newTxn = {
                id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
                name: 'Bought Credits',
                date: new Date().toISOString().split('T')[0],
                amount: calculatedINR,
                credits: val,
                type: 'credit',
                status: 'Success'
            };

            setTransactions((prev) => [newTxn, ...prev]);
            setStats((prev) => ({ ...prev, totalCredits: prev.totalCredits + val }));
            setLoading(false);
            setIsBuyModalOpen(false);
            showToast(`${val} Credits successfully khareed liye gaye! (₹${calculatedINR})`);
        }, 1000);
    };

    // Transfer Credits Handler
    const handleTransferSubmit = (e) => {
        e.preventDefault();
        const val = Number(transferCredits);

        if (!transferRecipient.trim()) {
            setTransferError('User ID / Email daalna zaroori hai.');
            return;
        }
        if (!val || val <= 0) {
            setTransferError('Valid credit amount daalein.');
            return;
        }
        if (val > stats.totalCredits) {
            setTransferError('Insufficient credit balance!');
            return;
        }

        setLoading(true);
        setTransferError('');

        setTimeout(() => {
            const newTxn = {
                id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
                name: `Transfer to ${transferRecipient}`,
                date: new Date().toISOString().split('T')[0],
                amount: 0,
                credits: val,
                type: 'debit',
                status: 'Success'
            };

            setTransactions((prev) => [newTxn, ...prev]);
            setStats((prev) => ({
                totalCredits: prev.totalCredits - val,
                totalSpent: prev.totalSpent + val
            }));
            setLoading(false);
            setIsTransferModalOpen(false);
            setTransferRecipient('');
            setTransferCredits('');
            showToast(`${val} Credits transfer ho gaye user ${transferRecipient} ko!`);
        }, 1000);
    };

    if (checkingAuth) {
        return <SpinLoader />;
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8 font-sans antialiased">
            <div className="mx-auto pt-[90px] pb-5 space-y-6">

                {/* Notification Toast */}
                {toast && (
                    <div
                        className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-white transition-all transform duration-300 animate-bounce ${toast.type === 'error' ? 'bg-rose-600' : 'bg-blue-600'
                            }`}
                    >
                        <i className={`ri-${toast.type === 'error' ? 'error-warning-line' : 'checkbox-circle-line'} text-xl`} />
                        <span className="font-medium text-sm">{toast.message}</span>
                    </div>
                )}

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <i className="ri-wallet-3-line text-blue-600" /> Wallet & Transactions
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">Apne credits, activity aur transactions ka poora hisab dekhein.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsTransferModalOpen(true)}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition duration-200"
                        >
                            <i className="ri-send-plane-line" /> Transfer Credits
                        </button>
                        <button
                            onClick={() => setIsBuyModalOpen(true)}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-xl shadow-md shadow-blue-200 transition duration-200"
                        >
                            <i className="ri-add-circle-line" /> Buy Credits
                        </button>
                    </div>
                </div>

                {/* Section 1: Wallet Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition duration-300">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Available Balance</span>
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl group-hover:scale-110 transition">
                                <i className="ri-coins-line" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <h2 className="text-3xl font-extrabold text-slate-900">{stats.totalCredits.toLocaleString()}</h2>
                            <p className="text-xs text-blue-600 font-medium mt-1">Active Credits Ready to Use</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition duration-300">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Usage</span>
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl group-hover:scale-110 transition">
                                <i className="ri-shopping-bag-3-line" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <h2 className="text-3xl font-extrabold text-slate-900">{stats.totalSpent.toLocaleString()}</h2>
                            <p className="text-xs text-indigo-600 font-medium mt-1">Credits Spent Till Date</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition duration-300">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-slate-400 uppercase">Usage Breakdown</span>
                                <span className="text-xs font-semibold text-blue-600">
                                    {Math.round((stats.totalSpent / (stats.totalCredits + stats.totalSpent)) * 100 || 0)}% Spent
                                </span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden flex">
                                <div
                                    className="bg-blue-600 h-full transition-all duration-500"
                                    style={{ width: `${(stats.totalCredits / (stats.totalCredits + stats.totalSpent)) * 100}%` }}
                                    title="Available"
                                />
                                <div
                                    className="bg-indigo-400 h-full transition-all duration-500"
                                    style={{ width: `${(stats.totalSpent / (stats.totalCredits + stats.totalSpent)) * 100}%` }}
                                    title="Spent"
                                />
                            </div>
                        </div>
                        <div className="flex justify-between text-xs font-medium text-slate-500 mt-4">
                            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" /> Available</span>
                            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-400 inline-block" /> Spent</span>
                        </div>
                    </div>
                </div>

                {/* Section 2: Search & Custom Filter Dropdown */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="relative w-full sm:w-80">
                        <i className="ri-search-line absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by Name or Txn ID..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition"
                        />
                    </div>

                    {/* Custom Dropdown Filter */}
                    <div className="relative w-full sm:w-auto" ref={dropdownRef}>
                        <button
                            type="button"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-full sm:w-48 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 flex items-center justify-between hover:border-blue-500 focus:outline-none transition"
                        >
                            <span className="flex items-center gap-2">
                                <i className="ri-filter-3-line text-blue-600" />
                                {sortOrder === 'latest' ? 'Latest First' : 'Oldest First'}
                            </span>
                            <i className={`ri-arrow-down-s-line transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-full sm:w-48 bg-white border border-slate-100 rounded-xl shadow-lg z-20 py-1 overflow-hidden animate-fadeIn">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSortOrder('latest');
                                        setIsDropdownOpen(false);
                                    }}
                                    className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between hover:bg-slate-50 transition ${sortOrder === 'latest' ? 'text-blue-600 font-semibold bg-blue-50/50' : 'text-slate-600'
                                        }`}
                                >
                                    Latest First
                                    {sortOrder === 'latest' && <i className="ri-check-line text-blue-600" />}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSortOrder('oldest');
                                        setIsDropdownOpen(false);
                                    }}
                                    className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between hover:bg-slate-50 transition ${sortOrder === 'oldest' ? 'text-blue-600 font-semibold bg-blue-50/50' : 'text-slate-600'
                                        }`}
                                >
                                    Oldest First
                                    {sortOrder === 'oldest' && <i className="ri-check-line text-blue-600" />}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Section 3: Transaction List Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    <th className="py-4 px-6">Transaction ID</th>
                                    <th className="py-4 px-6">Name</th>
                                    <th className="py-4 px-6">Date</th>
                                    <th className="py-4 px-6">Credits</th>
                                    <th className="py-4 px-6">Amount</th>
                                    <th className="py-4 px-6">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm font-medium">
                                {currentItems.length > 0 ? (
                                    currentItems.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/50 transition duration-150">
                                            <td className="py-4 px-6 font-mono text-xs text-slate-500">{item.id}</td>
                                            <td className="py-4 px-6 font-semibold text-slate-800">{item.name}</td>
                                            <td className="py-4 px-6 text-slate-500">{item.date}</td>
                                            <td className={`py-4 px-6 font-bold ${item.type === 'credit' ? 'text-emerald-600' : 'text-slate-700'}`}>
                                                {item.type === 'credit' ? `+${item.credits}` : `-${item.credits}`}
                                            </td>
                                            <td className="py-4 px-6 text-slate-600">
                                                {item.amount > 0 ? `₹${item.amount}` : '—'}
                                            </td>
                                            <td className="py-4 px-6">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${item.status === 'Success'
                                                        ? 'bg-emerald-50 text-emerald-600'
                                                        : 'bg-rose-50 text-rose-600'
                                                        }`}
                                                >
                                                    <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'Success' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                                    {item.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-12 text-center text-slate-400">
                                            <i className="ri-inbox-archive-line text-4xl block mb-2 opacity-50" />
                                            <p className="text-sm font-medium">Koi transaction record nahi mila!</p>
                                            {search && <span className="text-xs text-slate-400">Search term Change karke dekhein.</span>}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Section 4: Numbered Pagination Controls */}
                    {filteredTransactions.length > 0 && (
                        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
                            <span className="text-xs text-slate-500">
                                Page <span className="font-semibold text-slate-800">{currentPage}</span> of{' '}
                                <span className="font-semibold text-slate-800">{totalPages}</span>
                            </span>

                            <div className="flex items-center gap-1.5">
                                {/* Previous Button */}
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1"
                                >
                                    <i className="ri-arrow-left-s-line" /> Prev
                                </button>

                                {/* Page Number Buttons */}
                                {Array.from({ length: totalPages }, (_, index) => {
                                    const pageNum = index + 1;
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`w-8 h-8 rounded-lg font-medium text-xs transition ${currentPage === pageNum
                                                ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                                                : 'text-slate-600 hover:bg-slate-100 border border-slate-200'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}

                                {/* Next Button */}
                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1"
                                >
                                    Next <i className="ri-arrow-right-s-line" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Modals */}
                {isBuyModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fadeIn">
                        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-5">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <i className="ri-add-circle-fill text-blue-600" /> Buy Credits
                                </h3>
                                <button onClick={() => setIsBuyModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-xl">
                                    <i className="ri-close-line" />
                                </button>
                            </div>

                            <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-100 text-xs text-blue-700 flex justify-between items-center">
                                <span>Configured Limits:</span>
                                <span className="font-bold">{ADMIN_CONFIG.minCredits} - {ADMIN_CONFIG.maxCredits} Credits</span>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase block mb-2">Popular Options</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {ADMIN_CONFIG.packages.map((pkg) => (
                                        <button
                                            key={pkg.credits}
                                            type="button"
                                            onClick={() => setBuyAmount(pkg.credits)}
                                            className={`p-2.5 rounded-xl border text-left transition ${buyAmount === pkg.credits
                                                ? 'border-blue-600 bg-blue-50/30 text-blue-600'
                                                : 'border-slate-200 hover:border-slate-300'
                                                }`}
                                        >
                                            <div className="text-xs font-bold">{pkg.label}</div>
                                            <div className="text-sm font-extrabold">{pkg.credits} Credits</div>
                                            <div className="text-[10px] text-slate-400">₹{pkg.credits * ADMIN_CONFIG.ratePerCredit} INR</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <form onSubmit={handleBuySubmit} className="space-y-4">
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Custom Credits</label>
                                    <input
                                        type="number"
                                        min={ADMIN_CONFIG.minCredits}
                                        max={ADMIN_CONFIG.maxCredits}
                                        value={buyAmount}
                                        onChange={(e) => setBuyAmount(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-blue-600"
                                    />
                                </div>

                                {buyError && <p className="text-xs font-semibold text-rose-500">{buyError}</p>}

                                <div className="flex justify-between items-center py-2 px-3 bg-slate-50 rounded-xl">
                                    <span className="text-sm text-slate-600">Total Payable Amount:</span>
                                    <span className="text-lg font-extrabold text-blue-600">
                                        ₹{(Number(buyAmount) * ADMIN_CONFIG.ratePerCredit || 0).toFixed(2)} INR
                                    </span>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-200 disabled:opacity-50 transition"
                                >
                                    {loading ? <i className="ri-loader-4-line animate-spin text-lg" /> : 'Confirm & Proceed Payment'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {isTransferModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fadeIn">
                        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-5">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <i className="ri-send-plane-fill text-blue-600" /> Transfer Credits
                                </h3>
                                <button onClick={() => setIsTransferModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-xl">
                                    <i className="ri-close-line" />
                                </button>
                            </div>

                            <form onSubmit={handleTransferSubmit} className="space-y-4">
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Recipient ID / Email</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. user_9921"
                                        value={transferRecipient}
                                        onChange={(e) => setTransferRecipient(e.target.value)}
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Credits Amount</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={transferCredits}
                                        onChange={(e) => setTransferCredits(e.target.value)}
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-blue-600"
                                    />
                                    <span className="text-[11px] text-slate-400 mt-1 block">Available Balance: {stats.totalCredits} Credits</span>
                                </div>

                                {transferError && <p className="text-xs font-semibold text-rose-500">{transferError}</p>}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-200 disabled:opacity-50 transition"
                                >
                                    {loading ? <i className="ri-loader-4-line animate-spin text-lg" /> : 'Transfer Now'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}