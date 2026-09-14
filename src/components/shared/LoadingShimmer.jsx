export const ShimmerLoading = () => {
    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto animate-pulse space-y-6">
                <div className="h-28 rounded-2xl bg-white" />

                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 xl:grid-cols-7">
                    {Array.from({ length: 7 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-36 rounded-2xl bg-white"
                        />
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                    <div className="h-64 rounded-2xl bg-white" />
                    <div className="h-64 rounded-2xl bg-white" />
                    <div className="h-64 rounded-2xl bg-white" />
                </div>

                <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                    <div className="h-[500px] rounded-2xl bg-white" />
                    <div className="h-[500px] rounded-2xl bg-white" />
                </div>
            </div>
        </div>
    )
}