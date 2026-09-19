const SpinLoader = ({ text = "Loading..." }) => {
    return (
        <div className="min-h-[100dvh] w-full bg-white flex flex-col items-center justify-center">
            <i className="ri-loader-line text-4xl  text-blue-600 animate-spin" />

            <p className="mt-3 text-sm font-medium text-slate-600">
                {text}
            </p>
        </div>
    );
};

export default SpinLoader;