import React, { useState, useMemo } from 'react';

// Dynamic User Profile & Usage Stats Mock Data (API Payload Pattern)
const INITIAL_USER_PROFILE = {
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop',
    name: 'Vikram Malhotra',
    email: 'vikram.malhotra@example.com',
    role: 'Premium Member',
    isVerified: true,
    phone: '+91 98765 43210',
    lastLogin: '2026-09-14T09:30:00Z',
    stats: {
        storage: { usedGB: 42.5, totalGB: 100 },
        folders: { created: 18, limit: 50 },
        shares: { active: 14, limit: 30 },
        coinsBalance: 3450,
        transactions: { totalCount: 28, totalAmountINR: 4250 },
        creditTransfers: { count: 12, creditsTransferred: 850 }
    }
};

// Formatting Helper Functions
const formatINR = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export default function Profile() {
    // Main Lifecycle & UI States
    const [userData, setUserData] = useState(INITIAL_USER_PROFILE);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState(null);

    // Logout Modal & Action States
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [logoutLoading, setLogoutLoading] = useState(false);
    const [logoutError, setLogoutError] = useState('');
    const [toast, setToast] = useState(null);

    // Toast Handler
    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    // Logout Flow Execution
    const handleConfirmLogout = () => {
        setLogoutLoading(true);
        setLogoutError('');

        // Simulate Secure Session Termination & API Request
        setTimeout(() => {
            try {
                // Clear auth tokens securely
                localStorage.removeItem('authToken');
                sessionStorage.clear();

                setLogoutLoading(false);
                setIsLogoutModalOpen(false);
                showToast('Successfully logged out. Redirecting...', 'success');

                // Redirect to Login page after brief delay
                setTimeout(() => {
                    window.location.href = '/login';
                }, 1200);
            } catch (err) {
                setLogoutLoading(false);
                setLogoutError('Logout request failed. Please try again.');
                showToast('Logout failed!', 'error');
            }
        }, 1200);
    };

    // Percentage Progress Helper for Usage Meters
    const storagePercentage = useMemo(() => {
        if (!userData?.stats?.storage) return 0;
        const { usedGB, totalGB } = userData.stats.storage;
        return Math.min(Math.round((usedGB / totalGB) * 100), 100);
    }, [userData]);

    // Global Loading State View
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-500">
                <i className="ri-loader-4-line text-4xl animate-spin text-blue-600 mb-3" />
                <p className="text-sm font-medium">Fetching Profile Data...</p>
            </div>
        );
    }

    // API Failure State View
    if (apiError || !userData) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-md w-full text-center space-y-4">
                    <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto text-2xl">
                        <i className="ri-error-warning-line" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-800">Profile Loading Failed</h2>
                    <p className="text-sm text-slate-500">{apiError || 'Unable to load user information.'}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition duration-200"
                    >
                        Retry Loading
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8 font-sans antialiased">
            <div className="mx-auto pt-[90px] space-y-6 pb-12">

                {/* Global Toast Notification */}
                {toast && (
                    <div
                        className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-white transition-all transform duration-300 animate-bounce ${toast.type === 'error' ? 'bg-rose-600' : 'bg-blue-600'
                            }`}
                    >
                        <i className={`ri-${toast.type === 'error' ? 'error-warning-line' : 'checkbox-circle-line'} text-xl`} />
                        <span className="font-medium text-sm">{toast.message}</span>
                    </div>
                )}

                {/* Header & Page Title */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <i className="ri-user-3-line text-blue-600" /> My Profile
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">Manage your account credentials, security and activity statistics.</p>
                    </div>
                    <button
                        onClick={() => setIsLogoutModalOpen(true)}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 active:scale-95 rounded-xl transition duration-200"
                    >
                        <i className="ri-logout-box-r-line" /> Logout Account
                    </button>
                </div>

                {/* Section 1: User Profile Card */}
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 w-full md:w-auto">
                        {/* Avatar */}
                        <div className="relative">
                            <img
                                src={userData.profilePhoto || 'https://via.placeholder.com/150'}
                                alt={userData.name}
                                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-slate-50 border border-slate-200 shadow-sm"
                            />
                            {userData.isVerified && (
                                <span
                                    className="absolute -bottom-1 -right-1 bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center border-2 border-white text-xs shadow-sm"
                                    title="Verified Account"
                                >
                                    <i className="ri-check-line font-bold" />
                                </span>
                            )}
                        </div>

                        {/* Profile Text Meta */}
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h2 className="text-xl font-bold text-slate-900">{userData.name}</h2>
                                {userData.isVerified && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-600">
                                        <i className="ri-verified-badge-fill" /> Verified
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-slate-500 font-medium">{userData.email}</p>
                            <div className="flex items-center gap-3 pt-1 text-xs text-slate-400 flex-wrap">
                                <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg text-slate-600 font-medium">
                                    <i className="ri-shield-user-line text-blue-600" /> {userData.role}
                                </span>
                                <span className="flex items-center gap-1">
                                    <i className="ri-phone-line" /> {userData.phone || 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Last Login Info Badge */}
                    <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl w-full md:w-auto text-left md:text-right space-y-0.5">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Last Login Activity</span>
                        <span className="text-xs font-semibold text-slate-700 flex items-center md:justify-end gap-1.5 mt-1">
                            <i className="ri-time-line text-blue-600" /> {formatDate(userData.lastLogin)}
                        </span>
                    </div>
                </div>

                {/* Section 2: Account Statistics & Resource Usage */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <i className="ri-bar-chart-box-line text-blue-600" /> Usage & Activity Statistics
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {/* Stat Card 1: Storage Limit */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition duration-300 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cloud Storage</span>
                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
                                    <i className="ri-hard-drive-2-line" />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-baseline mb-1">
                                    <span className="text-2xl font-extrabold text-slate-900">{userData.stats?.storage?.usedGB || 0} GB</span>
                                    <span className="text-xs font-semibold text-slate-400">Limit: {userData.stats?.storage?.totalGB || 0} GB</span>
                                </div>
                                {/* Visual Storage Bar */}
                                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                    <div
                                        className="bg-blue-600 h-full transition-all duration-500 rounded-full"
                                        style={{ width: `${storagePercentage}%` }}
                                    />
                                </div>
                                <span className="text-[11px] text-slate-400 mt-1.5 block font-medium">{storagePercentage}% space consumed</span>
                            </div>
                        </div>

                        {/* Stat Card 2: Folders Limit */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition duration-300 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Folders Created</span>
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl">
                                    <i className="ri-folder-shared-line" />
                                </div>
                            </div>
                            <div className="flex items-baseline justify-between">
                                <div>
                                    <h4 className="text-2xl font-extrabold text-slate-900">{userData.stats?.folders?.created || 0}</h4>
                                    <p className="text-xs text-indigo-600 font-medium mt-1">Active Directories</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-semibold text-slate-400 block">Folder Limit</span>
                                    <span className="text-sm font-bold text-slate-700">{userData.stats?.folders?.limit || 0}</span>
                                </div>
                            </div>
                        </div>

                        {/* Stat Card 3: Share Limit */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition duration-300 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Shares</span>
                                <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center text-xl">
                                    <i className="ri-share-forward-line" />
                                </div>
                            </div>
                            <div className="flex items-baseline justify-between">
                                <div>
                                    <h4 className="text-2xl font-extrabold text-slate-900">{userData.stats?.shares?.active || 0}</h4>
                                    <p className="text-xs text-violet-600 font-medium mt-1">Shared Documents</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-semibold text-slate-400 block">Share Limit</span>
                                    <span className="text-sm font-bold text-slate-700">{userData.stats?.shares?.limit || 0}</span>
                                </div>
                            </div>
                        </div>

                        {/* Stat Card 4: Coins Balance */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition duration-300 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Coins Balance</span>
                                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl">
                                    <i className="ri-coins-line" />
                                </div>
                            </div>
                            <div>
                                <h4 className="text-2xl font-extrabold text-slate-900">
                                    {(userData.stats?.coinsBalance || 0).toLocaleString()}
                                </h4>
                                <p className="text-xs text-amber-600 font-medium mt-1">Available Loyalty / Usage Coins</p>
                            </div>
                        </div>

                        {/* Stat Card 5: Total Transactions & Amount in INR */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition duration-300 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Transactions</span>
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
                                    <i className="ri-exchange-funds-line" />
                                </div>
                            </div>
                            <div className="flex items-baseline justify-between">
                                <div>
                                    <h4 className="text-2xl font-extrabold text-slate-900">{userData.stats?.transactions?.totalCount || 0}</h4>
                                    <p className="text-xs text-emerald-600 font-medium mt-1">Total Purchases</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-semibold text-slate-400 block">Total Amount</span>
                                    <span className="text-sm font-extrabold text-emerald-600">
                                        {formatINR(userData.stats?.transactions?.totalAmountINR || 0)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Stat Card 6: Credit Transfers */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition duration-300 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Credit Transfers</span>
                                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center text-xl">
                                    <i className="ri-send-plane-line" />
                                </div>
                            </div>
                            <div className="flex items-baseline justify-between">
                                <div>
                                    <h4 className="text-2xl font-extrabold text-slate-900">{userData.stats?.creditTransfers?.count || 0}</h4>
                                    <p className="text-xs text-sky-600 font-medium mt-1">Transfer Actions</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-semibold text-slate-400 block">Total Transferred</span>
                                    <span className="text-sm font-extrabold text-slate-800">
                                        {userData.stats?.creditTransfers?.creditsTransferred || 0} Credits
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Section 3: Logout Confirmation Modal */}
                {isLogoutModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fadeIn">
                        <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4 text-center">
                            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center text-2xl mx-auto">
                                <i className="ri-logout-box-r-line" />
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Confirm Account Logout</h3>
                                <p className="text-xs text-slate-500 mt-1">
                                    Kya aap sure hain ki aap account logout karna chahte hain? Aapko firse access ke liye sign in karna hoga.
                                </p>
                            </div>

                            {logoutError && <p className="text-xs font-semibold text-rose-500">{logoutError}</p>}

                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsLogoutModalOpen(false)}
                                    disabled={logoutLoading}
                                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleConfirmLogout}
                                    disabled={logoutLoading}
                                    className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-rose-200 disabled:opacity-50 transition flex items-center justify-center gap-2"
                                >
                                    {logoutLoading ? <i className="ri-loader-4-line animate-spin text-base" /> : 'Yes, Logout'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}