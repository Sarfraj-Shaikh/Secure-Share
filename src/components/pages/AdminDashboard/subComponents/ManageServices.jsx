import React, { useState, useEffect } from "react";

// Mock Initial Rates Data
const INITIAL_SERVICE_RATES = {
    maintenanceMode: false,
    credits: { quantity: 100, unit: "Credits", price: 10 },
    storage: { quantity: 10, unit: "GB", price: 299 },
    folderLimit: { quantity: 50, unit: "Folders", price: 149 },
    shareLimit: { quantity: 50, unit: "Shares", price: 99 },
};

const ManageServices = () => {
    // States
    const [rates, setRates] = useState(null);
    const [loading, setLoading] = useState(true);

    // Maintenance Confirmation Modal State
    const [maintModalOpen, setMaintModalOpen] = useState(false);
    const [targetMaintState, setTargetMaintState] = useState(false);

    // Form Local States for editing rates
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});

    // Toast Notification State
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3500);
    };

    // Initial Fetch Simulation
    useEffect(() => {
        const fetchRates = async () => {
            setLoading(true);
            try {
                await new Promise((res) => setTimeout(res, 700));
                setRates(INITIAL_SERVICE_RATES);
                setFormData(INITIAL_SERVICE_RATES);
            } catch (err) {
                showToast("Failed to load service rates", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchRates();
    }, []);

    // Handle Input Changes
    const handleInputChange = (category, field, value) => {
        setFormData((prev) => ({
            ...prev,
            [category]: {
                ...prev[category],
                [field]: value,
            },
        }));

        // Clear error for that category
        if (errors[category]) {
            setErrors((prev) => ({ ...prev, [category]: null }));
        }
    };

    // Maintenance Mode Handlers
    const handleToggleMaintenanceClick = (currentState) => {
        setTargetMaintState(!currentState);
        setMaintModalOpen(true);
    };

    const confirmMaintenanceToggle = () => {
        setRates((prev) => ({ ...prev, maintenanceMode: targetMaintState }));
        setFormData((prev) => ({ ...prev, maintenanceMode: targetMaintState }));
        showToast(`Maintenance mode turned ${targetMaintState ? "ON" : "OFF"} successfully!`);
        setMaintModalOpen(false);
    };

    // Save Rate Handler for Specific Category
    const handleSaveRate = (category, categoryName) => {
        const item = formData[category];
        const qty = Number(item.quantity);
        const price = Number(item.price);

        // Validation Rules: Must be positive numbers
        if (!item.quantity || isNaN(qty) || qty <= 0) {
            setErrors((prev) => ({ ...prev, [category]: "Please enter a valid quantity/limit greater than 0." }));
            return;
        }

        if (item.price === "" || isNaN(price) || price < 0) {
            setErrors((prev) => ({ ...prev, [category]: "Please enter a valid price (₹) equal to or greater than 0." }));
            return;
        }

        // Save into main state
        setRates((prev) => ({
            ...prev,
            [category]: { ...item, quantity: qty, price },
        }));

        showToast(`${categoryName} rate updated to ₹${price} for ${qty} ${item.unit}!`);
    };

    // Helper Card Component for 2-Input Service Rate Cards
    const renderRateCard = (categoryKey, title, iconClass, description) => {
        const data = formData[categoryKey] || {};
        const categoryError = errors[categoryKey];

        return (
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-5 pt-[90px]">
                {/* Header */}
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 font-bold">
                        <i className={`${iconClass} text-2xl`} />
                    </div>
                    <div>
                        <h2 className="text-lg font-extrabold text-slate-900">{title}</h2>
                        <p className="text-xs font-semibold text-slate-500">{description}</p>
                    </div>
                </div>

                {/* 2 Main Inputs Form */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Input 1: Price */}
                    <div>
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                            Price Rate (₹)
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">₹</span>
                            <input
                                type="number"
                                placeholder="e.g. 10"
                                value={data.price !== undefined ? data.price : ""}
                                onChange={(e) => handleInputChange(categoryKey, "price", e.target.value)}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-9 pr-4 py-3 text-sm font-extrabold text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                            />
                        </div>
                    </div>

                    {/* Input 2: Quantity / Limit */}
                    <div>
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                            For Quantity / Limit ({data.unit})
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                placeholder="e.g. 100"
                                value={data.quantity !== undefined ? data.quantity : ""}
                                onChange={(e) => handleInputChange(categoryKey, "quantity", e.target.value)}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm font-extrabold text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                            />
                            <span className="flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 px-3 text-xs font-extrabold text-slate-600">
                                {data.unit}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Error Banner */}
                {categoryError && (
                    <p className="text-xs font-bold text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 flex items-center gap-2">
                        <i className="ri-error-warning-fill text-base" />
                        {categoryError}
                    </p>
                )}

                {/* Single Save Button */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <p className="text-xs font-bold text-slate-500">
                        Current Rule: <strong className="text-slate-900">₹{data.price || 0}</strong> for <strong className="text-slate-900">{data.quantity || 0} {data.unit}</strong>
                    </p>
                    <button
                        type="button"
                        onClick={() => handleSaveRate(categoryKey, title)}
                        className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 transition"
                    >
                        <i className="ri-save-3-line text-base" />
                        Save Rate
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8 pt-10 sm:pt-[90px] antialiased">
            <div className="mx-auto max-w-7xl space-y-6">

                {/* TOAST NOTIFICATION */}
                {toast.show && (
                    <div
                        className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-4 text-base font-semibold text-white shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${toast.type === "error" ? "bg-red-600" : "bg-emerald-600"
                            }`}
                    >
                        <i className={toast.type === "error" ? "ri-error-warning-fill text-2xl" : "ri-checkbox-circle-fill text-2xl"} />
                        <span>{toast.message}</span>
                    </div>
                )}

                {/* PAGE HEADER */}
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Manage System Services & Rates</h1>
                    <p className="text-sm font-medium text-slate-500 mt-1">Configure maintenance mode settings and manage pricing rate rules.</p>
                </div>

                {loading ? (
                    /* LOADING SKELETON */
                    <div className="space-y-6 animate-pulse">
                        <div className="h-28 rounded-3xl bg-slate-200" />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="h-56 rounded-3xl bg-slate-200" />
                            <div className="h-56 rounded-3xl bg-slate-200" />
                            <div className="h-56 rounded-3xl bg-slate-200" />
                            <div className="h-56 rounded-3xl bg-slate-200" />
                        </div>
                    </div>
                ) : (
                    <>
                        {/* SECTION 1: MAINTENANCE MODE */}
                        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                            <div className="flex items-start sm:items-center gap-4">
                                <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${formData.maintenanceMode ? "bg-amber-100 text-amber-700" : "bg-emerald-50 text-emerald-600"}`}>
                                    <i className={formData.maintenanceMode ? "ri-tools-fill text-3xl" : "ri-shield-check-fill text-3xl"} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-xl font-extrabold text-slate-900">Maintenance Mode</h2>
                                        <span className={`rounded-full px-3 py-0.5 text-xs font-extrabold uppercase tracking-wider ${formData.maintenanceMode ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                                            }`}>
                                            {formData.maintenanceMode ? "Currently Enabled" : "System Operational"}
                                        </span>
                                    </div>
                                    <p className="text-xs font-semibold text-slate-500 mt-1 max-w-xl">
                                        Enabling Maintenance Mode displays a maintenance page to regular users while keeping admin access fully functional.
                                    </p>
                                </div>
                            </div>

                            {/* Maintenance Toggle Button */}
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-extrabold uppercase text-slate-400">OFF</span>
                                <button
                                    type="button"
                                    onClick={() => handleToggleMaintenanceClick(formData.maintenanceMode)}
                                    className={`relative inline-flex h-8 w-16 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${formData.maintenanceMode ? "bg-amber-500" : "bg-slate-300"
                                        }`}
                                >
                                    <span
                                        className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${formData.maintenanceMode ? "translate-x-8" : "translate-x-0"
                                            }`}
                                    />
                                </button>
                                <span className="text-xs font-extrabold uppercase text-slate-800">ON</span>
                            </div>
                        </div>

                        {/* SECTION 2: 2-INPUT RATE CARDS */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {renderRateCard("credits", "Credits Rate", "ri-coin-line", "Set how many credits are granted per amount (e.g. ₹10 for 100 Credits).")}
                            {renderRateCard("storage", "Storage Upgrade Rate", "ri-hard-drive-line", "Set storage capacity granted per amount (e.g. ₹299 for 10 GB).")}
                            {renderRateCard("folderLimit", "Folder Limit Rate", "ri-folder-add-line", "Set folder creation limit increase per amount (e.g. ₹149 for 50 Folders).")}
                            {renderRateCard("shareLimit", "Share Limit Rate", "ri-share-forward-line", "Set file sharing limit increase per amount (e.g. ₹99 for 50 Shares).")}
                        </div>
                    </>
                )}

                {/* MAINTENANCE MODE TOGGLE CONFIRMATION MODAL */}
                {maintModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
                        <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-7 shadow-2xl space-y-5">
                            <div className="flex items-center gap-3 text-amber-600">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50">
                                    <i className="ri-error-warning-fill text-2xl" />
                                </div>
                                <h3 className="text-xl font-extrabold text-slate-900">
                                    {targetMaintState ? "Enable Maintenance Mode?" : "Disable Maintenance Mode?"}
                                </h3>
                            </div>

                            <p className="text-sm font-semibold text-slate-600">
                                {targetMaintState
                                    ? "Enabling maintenance mode will restrict standard user logins and display the maintenance message. Admin dashboard remains accessible."
                                    : "Disabling maintenance mode will instantly restore normal website access for all users."}
                            </p>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setMaintModalOpen(false)}
                                    className="rounded-xl px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={confirmMaintenanceToggle}
                                    className={`rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg transition ${targetMaintState ? "bg-amber-600 hover:bg-amber-700 shadow-amber-600/25" : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25"
                                        }`}
                                >
                                    Confirm Change
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ManageServices;