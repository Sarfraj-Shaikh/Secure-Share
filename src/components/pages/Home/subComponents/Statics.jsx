import SlotCounter from 'react-slot-counter';

export const Statics = () => {

    const statsData = [
        {
            id: 1,
            iconClass: 'ri-file-upload-line text-indigo-600',
            bgClass: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100',
            count: 1000,
            suffix: '+',
            label: 'Files Uploaded',
            delay: 'animate__delay-0s'
        },
        {
            id: 2,
            iconClass: 'ri-share-forward-line text-emerald-600',
            bgClass: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100',
            count: 500,
            suffix: '+',
            label: 'Files Shared',
            delay: 'animate__delay-1s'
        },
        {
            id: 3,
            iconClass: 'ri-shield-check-line text-amber-600',
            bgClass: 'bg-amber-50 text-amber-600 hover:bg-amber-100',
            count: 99,
            suffix: '%',
            label: 'Secure Downloads',
            delay: 'animate__delay-2s'
        },
        {
            id: 4,
            iconClass: 'ri-time-line text-purple-600',
            bgClass: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
            count: 24,
            suffix: '/7*',
            label: 'Access From Anywhere',
            delay: 'animate__delay-3s'
        },
    ];

    return (

        <section className="relative py-10 sm:px-6 mx-auto overflow-hidden px-[5%] md:px-[10%]">

            {/* Background Glow Effect */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-gradient-to-r from-indigo-100 via-emerald-100 to-amber-100 blur-3xl opacity-60 -z-10 rounded-full pointer-events-none animate__animated animate__pulse animate__infinite animate__slower"
            />

            {/* Seamless Fluid Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

                {statsData.map((item) => (

                    <div
                        key={item.id}
                        className={`group flex flex-col sm:flex-row items-center sm:items-start gap-4 p-5 rounded-2xl transition-all duration-500 hover:-translate-y-1 animate__animated animate__fadeInUp ${item.delay}`}
                    >
                        {/* Soft Circle Icon Wrapper with Animate.css hover pulse */}
                        <div className={`p-4 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 ${item.bgClass}`}>
                            <i className={`${item.iconClass} text-2xl`}></i>
                        </div>

                        {/* Value & Label */}
                        <div className="flex flex-col text-center sm:text-left">

                            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center sm:justify-start">

                                <SlotCounter value={item.count} />

                                <span className="text-indigo-600 ml-0.5">{item.suffix}</span>
                            </div>

                            <p className="text-sm font-medium text-slate-500 mt-1">{item.label}</p>

                        </div>

                    </div>

                ))}
            </div>

        </section>
    );
};

export default Statics;