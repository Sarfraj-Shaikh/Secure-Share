import SEO from "../SEO";

export const NotFound = () => {

    return (
        <>
        
            <SEO
                title={`Maintenance | ${import.meta.env.VITE_SITE_NAME}`}
                canonical={`${import.meta.env.VITE_WEB_URL}/register`}
            />

            <div className="w-full min-h-screen px-4 py-10 flex flex-col items-center justify-center text-center bg-slate-50">

                {/* 404 Heading with Bounce Animation */}
                <h1 className="animate__animated animate__bounceIn text-7xl sm:text-8xl md:text-9xl font-extrabold text-indigo-600 tracking-wider drop-shadow-sm select-none">
                    404
                </h1>

                {/* Decorative Line */}
                <div className="animate__animated animate__fadeIn animate__delay-1s h-1.5 w-16 sm:w-20 rounded-full bg-indigo-500 my-4 md:my-6 transition-all duration-300"></div>

                {/* Text Content */}
                <p className="animate__animated animate__fadeInUp text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                    Page Not Found
                </p>

                <div className="animate__animated animate__fadeInUp space-y-3 mt-4 max-w-sm sm:max-w-md">
                    <p className="animate__animated animate__fadeInUp text-sm sm:text-base mt-4 text-gray-600 max-w-sm sm:max-w-md leading-relaxed">
                        The page you are looking for {" "}
                        <span className="font-semibold text-gray-900 underline decoration-indigo-400 decoration-2 underline-offset-4 font-mono text-xs sm:text-sm break-all">
                            {window.location.pathname}
                        </span>{" "}
                        might have been removed, had its name changed, or is temporarily unavailable.
                    </p>
                </div>

                {/* Buttons Container */}
                <div className="animate__animated animate__fadeInUp animate__delay-1s flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4 mt-8 w-full sm:w-auto px-4 sm:px-0">

                    {/* Home Button */}
                    <a
                        href="/"
                        className="group w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg active:scale-95 transition-all duration-300 ease-in-out"
                    >
                        <i className="ri-home-4-line text-lg group-hover:-translate-x-1 transition-transform duration-300"></i>
                        <span>Return Home</span>
                    </a>

                    {/* Support Button */}
                    {/* <a
                    href={`${import.meta.env.VITE_WEB_URL}#contact`}
                    className="group w-full sm:w-auto flex items-center justify-center gap-2 border border-gray-300 hover:border-indigo-600 bg-white hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 px-6 py-3 rounded-lg font-medium shadow-sm hover:shadow-md active:scale-95 transition-all duration-300 ease-in-out"
                >
                    <i className="ri-customer-service-2-line text-lg group-hover:rotate-12 transition-transform duration-300"></i>
                    <span>Contact Support</span>
                </a> */}

                </div>

            </div>

        </>

    );
};