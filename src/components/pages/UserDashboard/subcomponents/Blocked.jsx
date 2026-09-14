import React, { useState, useMemo } from 'react';

// Admin / Backend Configured Mock Data (API Payload Structure)
const INITIAL_BLOCKED_DATA = {
    title: 'Account Suspended',
    description: 'Aapka account security violations ya policy guidelines violate karne ke karan suspend kar diya gaya hai.',
    blockedDate: '2026-09-10',
    blockedTime: '14:45 IST',
    reason: 'Multiple failed authorization attempts and unauthorized API requests detected from unknown IP.',
    contactInfo: {
        phone: '+91 98765 43210',
        email: 'support@example.com',
        address: 'Building 4B, Tech Park, Cyber City, Gurugram, India',
        website: 'https://example.com/help',
        socials: {
            instagram: 'https://instagram.com/example',
            facebook: 'https://facebook.com/example',
            twitter: 'https://x.com/example',
            linkedin: 'https://linkedin.com/company/example'
        }
    }
};

// Formatting Date Helper Function
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
};

export default function Blocked() {
    // Main Lifecycle States
    const [blockedDetails, setBlockedDetails] = useState(INITIAL_BLOCKED_DATA);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState(null);

    // Modal State
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);

    // Action Handlers for Contact Methods
    const handlePhoneClick = (phone) => {
        window.location.href = `tel:${phone.replace(/\s+/g, '')}`;
    };

    const handleEmailClick = (email) => {
        window.location.href = `mailto:${email}`;
    };

    const handleExternalLink = (url) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    // Check if any contact details exist
    const hasContactInfo = useMemo(() => {
        if (!blockedDetails?.contactInfo) return false;
        const { phone, email, address, website, socials } = blockedDetails.contactInfo;
        const hasSocials = socials && Object.values(socials).some((val) => Boolean(val));
        return Boolean(phone || email || address || website || hasSocials);
    }, [blockedDetails]);

    // Loading UI View State
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-500">
                <i className="ri-loader-4-line text-4xl animate-spin text-blue-600 mb-3" />
                <p className="text-sm font-medium">Account status verify ho raha hai...</p>
            </div>
        );
    }

    // API Error View State
    if (apiError || !blockedDetails) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-md w-full text-center space-y-4">
                    <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto text-2xl">
                        <i className="ri-wifi-off-line" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-800">Data Fetching Error</h2>
                    <p className="text-sm text-slate-500">{apiError || 'Blocked state information fetch nahi ho saki.'}</p>
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
        <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8 font-sans antialiased flex items-center justify-center">
            <div className="mx-auto pt-[90px] pb-5 space-y-6 my-auto">

                {/* Section 1: Main Blocked Notice Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8 text-center space-y-6 relative overflow-hidden">

                    {/* Top Decorative Alert Bar */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-rose-500" />

                    {/* Alert Icon Banner */}
                    <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto text-3xl border border-rose-100 shadow-sm">
                        <i className="ri-lock-password-line" />
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-2">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                            {blockedDetails.title || 'Access Restricted'}
                        </h1>
                        <p className="text-sm sm:text-base text-slate-500 max-w-lg mx-auto leading-relaxed">
                            {blockedDetails.description || 'Aapka access administrator dvaara restrict kiya gaya hai.'}
                        </p>
                    </div>

                    {/* Date, Time & Reason Details Grid */}
                    <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4 sm:p-5 text-left space-y-4">

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-slate-200/60 pb-4">
                            <div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                    Blocked Date
                                </span>
                                <span className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                                    <i className="ri-calendar-event-line text-blue-600" />
                                    {formatDate(blockedDetails.blockedDate)}
                                </span>
                            </div>

                            <div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                    Blocked Time
                                </span>
                                <span className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                                    <i className="ri-time-line text-blue-600" />
                                    {blockedDetails.blockedTime || 'N/A'}
                                </span>
                            </div>
                        </div>

                        {/* Admin Specified Reason */}
                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                Reason for Block
                            </span>
                            <p className="text-sm text-slate-700 bg-white p-3 rounded-xl border border-slate-200/80 font-medium leading-normal">
                                {blockedDetails.reason || 'Koi specific reason mention nahi kiya gaya hai.'}
                            </p>
                        </div>
                    </div>

                    {/* Section 2: Contact Support CTA */}
                    <div className="pt-2">
                        <button
                            onClick={() => setIsContactModalOpen(true)}
                            className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-200 transition duration-200 flex items-center justify-center gap-2 mx-auto"
                        >
                            <i className="ri-customer-service-2-line text-lg" /> Contact Support Team
                        </button>
                    </div>
                </div>

                {/* Section 2 & 3: Contact Details Modal */}
                {isContactModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fadeIn">
                        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-5 transform transition-all">

                            {/* Modal Header */}
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <i className="ri-contacts-book-2-line text-blue-600" /> Support Contact Details
                                </h3>
                                <button
                                    onClick={() => setIsContactModalOpen(false)}
                                    className="text-slate-400 hover:text-slate-600 text-xl transition"
                                >
                                    <i className="ri-close-line" />
                                </button>
                            </div>

                            {/* Dynamic Contact List */}
                            {hasContactInfo ? (
                                <div className="space-y-3">

                                    {/* Phone */}
                                    {blockedDetails.contactInfo.phone && (
                                        <button
                                            onClick={() => handlePhoneClick(blockedDetails.contactInfo.phone)}
                                            className="w-full p-3 bg-slate-50 hover:bg-blue-50/50 rounded-xl border border-slate-200/80 flex items-center justify-between group transition text-left"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-lg group-hover:bg-blue-600 group-hover:text-white transition">
                                                    <i className="ri-phone-line" />
                                                </div>
                                                <div>
                                                    <span className="text-[11px] font-bold text-slate-400 uppercase block">Phone Number</span>
                                                    <span className="text-sm font-semibold text-slate-800">{blockedDetails.contactInfo.phone}</span>
                                                </div>
                                            </div>
                                            <i className="ri-arrow-right-s-line text-slate-400 group-hover:text-blue-600 transition" />
                                        </button>
                                    )}

                                    {/* Email */}
                                    {blockedDetails.contactInfo.email && (
                                        <button
                                            onClick={() => handleEmailClick(blockedDetails.contactInfo.email)}
                                            className="w-full p-3 bg-slate-50 hover:bg-blue-50/50 rounded-xl border border-slate-200/80 flex items-center justify-between group transition text-left"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg group-hover:bg-indigo-600 group-hover:text-white transition">
                                                    <i className="ri-mail-line" />
                                                </div>
                                                <div>
                                                    <span className="text-[11px] font-bold text-slate-400 uppercase block">Email Address</span>
                                                    <span className="text-sm font-semibold text-slate-800">{blockedDetails.contactInfo.email}</span>
                                                </div>
                                            </div>
                                            <i className="ri-arrow-right-s-line text-slate-400 group-hover:text-indigo-600 transition" />
                                        </button>
                                    )}

                                    {/* Website */}
                                    {blockedDetails.contactInfo.website && (
                                        <button
                                            onClick={() => handleExternalLink(blockedDetails.contactInfo.website)}
                                            className="w-full p-3 bg-slate-50 hover:bg-blue-50/50 rounded-xl border border-slate-200/80 flex items-center justify-between group transition text-left"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg group-hover:bg-emerald-600 group-hover:text-white transition">
                                                    <i className="ri-global-line" />
                                                </div>
                                                <div>
                                                    <span className="text-[11px] font-bold text-slate-400 uppercase block">Official Website</span>
                                                    <span className="text-sm font-semibold text-slate-800">{blockedDetails.contactInfo.website}</span>
                                                </div>
                                            </div>
                                            <i className="ri-external-link-line text-slate-400 group-hover:text-emerald-600 transition" />
                                        </button>
                                    )}

                                    {/* Office Address */}
                                    {blockedDetails.contactInfo.address && (
                                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-3">
                                            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-lg shrink-0 mt-0.5">
                                                <i className="ri-map-pin-line" />
                                            </div>
                                            <div>
                                                <span className="text-[11px] font-bold text-slate-400 uppercase block">Support Office Address</span>
                                                <p className="text-xs font-semibold text-slate-700 leading-normal mt-0.5">
                                                    {blockedDetails.contactInfo.address}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Social Handles */}
                                    {blockedDetails.contactInfo.socials && (
                                        <div className="pt-2">
                                            <span className="text-xs font-semibold text-slate-500 uppercase block mb-2">Social Channels</span>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                {blockedDetails.contactInfo.socials.instagram && (
                                                    <button
                                                        onClick={() => handleExternalLink(blockedDetails.contactInfo.socials.instagram)}
                                                        className="p-2.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-xl transition text-lg"
                                                        title="Instagram"
                                                    >
                                                        <i className="ri-instagram-line" />
                                                    </button>
                                                )}
                                                {blockedDetails.contactInfo.socials.facebook && (
                                                    <button
                                                        onClick={() => handleExternalLink(blockedDetails.contactInfo.socials.facebook)}
                                                        className="p-2.5 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-xl transition text-lg"
                                                        title="Facebook"
                                                    >
                                                        <i className="ri-facebook-circle-line" />
                                                    </button>
                                                )}
                                                {blockedDetails.contactInfo.socials.twitter && (
                                                    <button
                                                        onClick={() => handleExternalLink(blockedDetails.contactInfo.socials.twitter)}
                                                        className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 rounded-xl transition text-lg"
                                                        title="X / Twitter"
                                                    >
                                                        <i className="ri-twitter-x-line" />
                                                    </button>
                                                )}
                                                {blockedDetails.contactInfo.socials.linkedin && (
                                                    <button
                                                        onClick={() => handleExternalLink(blockedDetails.contactInfo.socials.linkedin)}
                                                        className="p-2.5 bg-slate-100 hover:bg-sky-50 text-slate-600 hover:text-sky-600 rounded-xl transition text-lg"
                                                        title="LinkedIn"
                                                    >
                                                        <i className="ri-linkedin-box-line" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                </div>
                            ) : (
                                /* Empty Contact Details Fallback */
                                <div className="py-8 text-center text-slate-400">
                                    <i className="ri-customer-service-line text-3xl block mb-2 opacity-50" />
                                    <p className="text-sm font-medium">Koi contact details configure nahi kiye gaye hain.</p>
                                </div>
                            )}

                            {/* Modal Close CTA */}
                            <button
                                type="button"
                                onClick={() => setIsContactModalOpen(false)}
                                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition"
                            >
                                Close Window
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}