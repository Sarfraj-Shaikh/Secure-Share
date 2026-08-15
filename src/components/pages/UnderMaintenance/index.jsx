import SEO from "../SEO";

export const UnderMaintenance = () => {

    return (

        <>
            <SEO
                title={`Maintenance | ${import.meta.env.VITE_SITE_NAME}`}
                canonical={`${import.meta.env.VITE_WEB_URL}/register`}
            />

            <div className="w-full min-h-screen px-4 py-10 flex flex-col items-center justify-center text-center bg-slate-50 selection:bg-indigo-500 selection:text-white">

                {/* Icon with subtle pulse animation */}
                <div className="relative mb-6 flex items-center justify-center">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-indigo-100/80 flex items-center justify-center transition-transform hover:scale-105 duration-300">
                        <i className="ri-settings-4-line text-4xl sm:text-5xl text-indigo-600 animate-spin [animation-duration:12s]"></i>
                    </div>
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-500"></span>
                    </span>
                </div>

                {/* Main Heading */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight select-none">
                    Under Maintenance
                </h1>

                {/* Decorative Line */}
                <div className="h-1 w-12 rounded-full bg-indigo-500 my-4 transition-all duration-300"></div>

                {/* Subheading */}
                <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-700">
                    We'll be back shortly!
                </p>

                {/* Text Content */}
                <div className="mt-3 max-w-sm sm:max-w-md">
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                        We are currently performing scheduled maintenance on{" "}
                        <span className="font-semibold text-gray-900 underline decoration-indigo-400 decoration-2 underline-offset-4 font-mono text-xs sm:text-sm break-all">
                            {window.location.pathname === "/" ? window.location.href : window.location.pathname}
                        </span>
                        . Thank you for your patience.
                    </p>
                </div>

                {/* Action Buttons: Refresh & Contact Support */}
                <div className="flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4 mt-8 w-full sm:w-auto px-4 sm:px-0">

                    {/* Refresh Page Button */}
                    <button
                        onClick={() => window.location.reload()}
                        className="group w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium shadow-sm hover:shadow-md active:scale-95 transition-all duration-200 ease-in-out cursor-pointer"
                    >
                        <i className="ri-refresh-line text-lg group-hover:rotate-180 transition-transform duration-500"></i>
                        <span>Refresh Page</span>
                    </button>

                    {/* Contact Support Button */}
                    {/* <a
                    href={`${import.meta.env.VITE_WEB_URL || "#"}#contact`}
                    className="group w-full sm:w-auto flex items-center justify-center gap-2 border border-gray-300 hover:border-indigo-600 bg-white hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 px-6 py-3 rounded-lg font-medium shadow-sm hover:shadow-md active:scale-95 transition-all duration-200 ease-in-out"
                >
                    <i className="ri-customer-service-2-line text-lg group-hover:rotate-12 transition-transform duration-300"></i>
                    <span>Contact Support</span>
                </a> */}

                </div>

            </div>
        </>

    );
    
};