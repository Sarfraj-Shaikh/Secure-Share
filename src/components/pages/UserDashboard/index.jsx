import { lazy, Suspense } from "react"
import { Routes, Route } from "react-router-dom"
import { Navbar } from "./Navbar"
import { ShimmerLoading } from "../../shared/LoadingShimmer";
const Dashboard = lazy(() => import("./subcomponents/Dashboard"));
const MyFiles = lazy(() => import("./subcomponents/MyFiles"));
const Files = lazy(() => import("./subcomponents/Files"));
const { NotFound } = lazy(() => import("../NotFound"));
const SharedFiles = lazy(() => import("./subcomponents/SharedFiles"));
const Favourites = lazy(() => import("./subcomponents/Favourites"));
const History = lazy(() => import("./subcomponents/History"));
const Upgrade = lazy(() => import("./subcomponents/Upgrade"));
const Wallet = lazy(() => import("./subcomponents/Wallet"));
const Profile = lazy(() => import("./subcomponents/Profile"));
const Blocked = lazy(() => import("./subcomponents/Blocked"));

export const UserDashboard = () => {

    return (
        <>
            <Navbar />

            {/* Path match hone par wahi component render hoga */}
            <Routes>
                <Route path="dashboard" element={
                    <Suspense fallback={<ShimmerLoading />}> <Dashboard /> </Suspense>
                } />
                <Route path="my-files" element={
                    <Suspense fallback={<ShimmerLoading />}> <MyFiles /> </Suspense>
                } />
                <Route path="my-files/:id" element={
                    <Suspense fallback={<ShimmerLoading />}> <Files /> </Suspense>
                } />
                <Route path="shared-files" element={
                    <Suspense fallback={<ShimmerLoading />}> <SharedFiles /> </Suspense>
                } />
                <Route path="favourite" element={
                    <Suspense fallback={<ShimmerLoading />}> <Favourites /> </Suspense>
                } />
                <Route path="history" element={
                    <Suspense fallback={<ShimmerLoading />}> <History /> </Suspense>
                } />
                <Route path="upgrade" element={
                    <Suspense fallback={<ShimmerLoading />}> <Upgrade /> </Suspense>
                } />
                <Route path="wallet" element={
                    <Suspense fallback={<ShimmerLoading />}> <Wallet /> </Suspense>
                } />
                <Route path="profile" element={
                    <Suspense fallback={<ShimmerLoading />}> <Profile /> </Suspense>
                } />
                <Route path="blocked" element={
                    <Suspense fallback={<ShimmerLoading />}> <Blocked /> </Suspense>
                } />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    )
}