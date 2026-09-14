import { useMemo, useState } from "react";

// Mock API Data Structure (Dynamic Admin Settings & Conversion Rates)
const initialUserData = {
    userCredits: 250, // Available user credit balance
    storage: { used: 48, total: 100, unit: "MB" },
    folders: { used: 12, total: 20, unit: "Folders" },
    shares: { used: 45, total: 50, unit: "Links" },
    dailyUpgradesUsedToday: { storage: 0, folders: 1, shares: 0 },
};

const initialAdminConfig = {
    storage: {
        minUpgrade: 10,
        maxUpgrade: 1000,
        step: 10, // Step interval for slider/buttons
        ratePerUnit: 0.3, // 10 MB = 3 Credits (0.3 Credits per MB)
        rateLabel: "10 MB = 3 Credits",
        dailyUpgradeLimit: 5,
    },
    folders: {
        minUpgrade: 1,
        maxUpgrade: 50,
        step: 1,
        ratePerUnit: 2, // 1 Folder = 2 Credits
        rateLabel: "1 Folder = 2 Credits",
        dailyUpgradeLimit: 3,
    },
    shares: {
        minUpgrade: 5,
        maxUpgrade: 200,
        step: 5,
        ratePerUnit: 0.5, // 2 Shares = 1 Credit
        rateLabel: "2 Shares = 1 Credit",
        dailyUpgradeLimit: 5,
    },
};

export default function Upgrade({
    userDataProps = initialUserData,
    adminConfigProps = initialAdminConfig,
    loading = false,
    apiError = null,
    onUpgradeSuccess,
}) {
    const [userData, setUserData] = useState(userDataProps);
    const [adminConfig] = useState(adminConfigProps);

    // Modal & Custom Quantity States
    const [selectedCategory, setSelectedCategory] = useState(null); // 'storage' | 'folders' | 'shares'
    const [customAmount, setCustomAmount] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [modalError, setModalError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const categories = [
        { key: "storage", title: "Storage Space", icon: "ri-database-2-line", buttonText: "Upgrade Storage" },
        { key: "folders", title: "Folders Limit", icon: "ri-folder-add-line", buttonText: "Upgrade Folders Limit" },
        { key: "shares", title: "Share Limit", icon: "ri-share-forward-line", buttonText: "Upgrade Share Limit" },
    ];

    /*
     * Real-time Usage & Credit Calculations
     */
    const stats = useMemo(() => {
        const getStats = (used, total) => ({
            percentage: Math.min(Math.round((used / total) * 100), 100),
            remaining: Math.max(total - used, 0),
        });

        return {
            storage: getStats(userData.storage.used, userData.storage.total),
            folders: getStats(userData.folders.used, userData.folders.total),
            shares: getStats(userData.shares.used, userData.shares.total),
        };
    }, [userData]);

    // Dynamic Credit Cost Calculation
    const requiredCredits = useMemo(() => {
        if (!selectedCategory || !customAmount) return 0;
        const rate = adminConfig[selectedCategory]?.ratePerUnit || 0;
        return Math.ceil(customAmount * rate);
    }, [selectedCategory, customAmount, adminConfig]);

    /*
     * Modal Handlers
     */
    const handleOpenModal = (categoryKey) => {
        const config = adminConfig[categoryKey];
        const usedToday = userData.dailyUpgradesUsedToday[categoryKey] || 0;

        setSelectedCategory(categoryKey);
        setCustomAmount(config.minUpgrade);
        setModalError("");

        if (usedToday >= config.dailyUpgradeLimit) {
            setModalError(`Daily limit reached (${config.dailyUpgradeLimit} upgrades/day).`);
        }
    };

    const handleCloseModal = () => {
        if (isProcessing) return;
        setSelectedCategory(null);
        setCustomAmount(0);
        setModalError("");
    };

    // Increase / Decrease Handlers
    const handleQuantityChange = (newValue) => {
        if (!selectedCategory) return;
        const config = adminConfig[selectedCategory];

        // Clamp between Admin Min and Max limits
        const clampedValue = Math.min(Math.max(newValue, config.minUpgrade), config.maxUpgrade);
        setCustomAmount(clampedValue);

        // Validation Messages
        if (userData.userCredits < Math.ceil(clampedValue * config.ratePerUnit)) {
            setModalError("Insufficient credits balance.");
        } else {
            setModalError("");
        }
    };

    /*
     * Upgrade Execution
     */
    const handleConfirmUpgrade = async () => {
        if (!selectedCategory || customAmount <= 0) return;

        const config = adminConfig[selectedCategory];
        const usedToday = userData.dailyUpgradesUsedToday[selectedCategory] || 0;

        // Validations
        if (usedToday >= config.dailyUpgradeLimit) {
            setModalError("Daily limit exceeded.");
            return;
        }

        if (userData.userCredits < requiredCredits) {
            setModalError("You do not have enough credits for this upgrade.");
            return;
        }

        try {
            setIsProcessing(true);
            setModalError("");

            // Simulate API Call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Dynamic State Refresh
            setUserData((prev) => ({
                ...prev,
                userCredits: prev.userCredits - requiredCredits,
                [selectedCategory]: {
                    ...prev[selectedCategory],
                    total: prev[selectedCategory].total + customAmount,
                },
                dailyUpgradesUsedToday: {
                    ...prev.dailyUpgradesUsedToday,
                    [selectedCategory]: usedToday + 1,
                },
            }));

            setSuccessMsg(
                `Upgraded +${customAmount} ${userData[selectedCategory].unit} for ${requiredCredits} Credits!`
            );

            if (onUpgradeSuccess) {
                onUpgradeSuccess(selectedCategory, customAmount, requiredCredits);
            }

            handleCloseModal();
            setTimeout(() => setSuccessMsg(""), 4000);
        } catch (err) {
            setModalError("Failed to complete upgrade. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="w-full mx-auto pt-[90px] pb-5 px-5 lg:px-10">
            {/* Header with Balance */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                        Upgrade Account Limits
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Customize your upgrade quantity using your credit balance.
                    </p>
                </div>

                {/* Available Credits Badge */}
                <div className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-blue-700 shadow-sm w-fit">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
                        <i className="ri-coin-line text-lg" />
                    </div>
                    <div>
                        <span className="block text-xs font-medium text-blue-600">Available Credits</span>
                        <span className="text-lg font-bold text-slate-900">
                            {userData.userCredits} <span className="text-xs font-semibold text-slate-500">Coins</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* Success Toast */}
            {successMsg && (
                <div className="mb-6 flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
                    <div className="flex items-center gap-2">
                        <i className="ri-checkbox-circle-fill text-lg text-emerald-600" />
                        <span>{successMsg}</span>
                    </div>
                    <button onClick={() => setSuccessMsg("")} className="text-emerald-600 hover:text-emerald-800">
                        <i className="ri-close-line text-lg" />
                    </button>
                </div>
            )}

            {/* Error Banner */}
            {apiError && (
                <div className="mb-6 flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                    <i className="ri-error-warning-fill text-lg text-rose-500" />
                    <span>{apiError}</span>
                </div>
            )}

            {/* Cards Grid */}
            <div className="grid gap-6 md:grid-cols-3">
                {categories.map((cat) => {
                    const itemData = userData[cat.key];
                    const itemStats = stats[cat.key];

                    return (
                        <div
                            key={cat.key}
                            className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-blue-300 hover:shadow-md"
                        >
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                        <i className={`${cat.icon} text-2xl`} />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-800">{cat.title}</h2>
                                        <span className="text-xs text-slate-400 font-medium">
                                            Rate: {adminConfig[cat.key]?.rateLabel}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-6 space-y-1">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-2xl font-extrabold text-slate-900">
                                            {itemData.used} {itemData.unit}
                                        </span>
                                        <span className="text-sm font-semibold text-slate-500">
                                            / {itemData.total} {itemData.unit}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-xs text-slate-500 font-medium pt-1">
                                        <span>Remaining: {itemStats.remaining} {itemData.unit}</span>
                                        <span className="font-semibold text-blue-600">
                                            {itemStats.percentage}% Used
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${
                                            itemStats.percentage > 85
                                                ? "bg-rose-500"
                                                : itemStats.percentage > 60
                                                ? "bg-amber-500"
                                                : "bg-blue-600"
                                        }`}
                                        style={{ width: `${itemStats.percentage}%` }}
                                    />
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => handleOpenModal(cat.key)}
                                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition-all hover:bg-blue-700 active:scale-[0.98]"
                            >
                                <i className="ri-add-circle-line text-lg" />
                                <span>{cat.buttonText}</span>
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* ================= MODAL WITH CUSTOM INCREASE/DECREASE ================= */}
            {selectedCategory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
                    <div
                        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-slate-100 p-5 sm:p-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 capitalize">
                                    Custom {selectedCategory} Upgrade
                                </h3>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Select or adjust the exact amount you want to upgrade.
                                </p>
                            </div>
                            <button
                                onClick={handleCloseModal}
                                disabled={isProcessing}
                                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                            >
                                <i className="ri-close-line text-2xl" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-5 sm:p-6 space-y-6">
                            {/* Conversion Rate Highlight */}
                            <div className="flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50/50 p-3.5 text-xs">
                                <span className="font-medium text-slate-600">Configured Conversion Rate:</span>
                                <span className="font-bold text-blue-700 bg-white px-2.5 py-1 rounded-lg border border-blue-200">
                                    <i className="ri-exchange-box-line mr-1 text-blue-600" />
                                    {adminConfig[selectedCategory]?.rateLabel}
                                </span>
                            </div>

                            {/* Quantity Controls */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                                    Choose Quantity (+{userData[selectedCategory].unit})
                                </label>

                                <div className="flex items-center gap-3">
                                    {/* Decrease Button */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleQuantityChange(
                                                customAmount - adminConfig[selectedCategory].step
                                            )
                                        }
                                        disabled={customAmount <= adminConfig[selectedCategory].minUpgrade}
                                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                                    >
                                        <i className="ri-subtract-line text-xl font-bold" />
                                    </button>

                                    {/* Manual Input Field */}
                                    <input
                                        type="number"
                                        value={customAmount}
                                        onChange={(e) => handleQuantityChange(Number(e.target.value))}
                                        min={adminConfig[selectedCategory].minUpgrade}
                                        max={adminConfig[selectedCategory].maxUpgrade}
                                        step={adminConfig[selectedCategory].step}
                                        className="h-12 w-full rounded-xl border border-slate-200 text-center text-lg font-bold text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                                    />

                                    {/* Increase Button */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleQuantityChange(
                                                customAmount + adminConfig[selectedCategory].step
                                            )
                                        }
                                        disabled={customAmount >= adminConfig[selectedCategory].maxUpgrade}
                                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                                    >
                                        <i className="ri-add-line text-xl font-bold" />
                                    </button>
                                </div>

                                {/* Custom Range Slider */}
                                <input
                                    type="range"
                                    value={customAmount}
                                    onChange={(e) => handleQuantityChange(Number(e.target.value))}
                                    min={adminConfig[selectedCategory].minUpgrade}
                                    max={adminConfig[selectedCategory].maxUpgrade}
                                    step={adminConfig[selectedCategory].step}
                                    className="mt-4 h-2 w-full cursor-pointer accent-blue-600"
                                />

                                <div className="mt-1 flex justify-between text-xs text-slate-400 font-medium">
                                    <span>Min: +{adminConfig[selectedCategory].minUpgrade}</span>
                                    <span>Max: +{adminConfig[selectedCategory].maxUpgrade}</span>
                                </div>
                            </div>

                            {/* Required Credits Summary Card */}
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                                <div className="flex justify-between text-sm text-slate-600">
                                    <span>Selected Increase:</span>
                                    <span className="font-semibold text-slate-800">
                                        +{customAmount} {userData[selectedCategory].unit}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm text-slate-600">
                                    <span>Required Credits:</span>
                                    <span className="font-extrabold text-blue-600 text-base">
                                        {requiredCredits} Coins
                                    </span>
                                </div>
                            </div>

                            {/* Error State */}
                            {modalError && (
                                <div className="flex items-center gap-2 rounded-xl border border-rose-100 bg-rose-50 p-3 text-xs text-rose-600">
                                    <i className="ri-error-warning-line text-base" />
                                    <span>{modalError}</span>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 p-4 sm:px-6">
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                disabled={isProcessing}
                                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmUpgrade}
                                disabled={isProcessing || Boolean(modalError) || customAmount <= 0}
                                className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
                            >
                                {isProcessing ? (
                                    <>
                                        <i className="ri-loader-4-line animate-spin text-base" />
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        <i className="ri-coin-line text-lg" />
                                        <span>Pay {requiredCredits} Credits</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}