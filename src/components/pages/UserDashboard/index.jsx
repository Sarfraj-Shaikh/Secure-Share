import { Routes, Route } from "react-router-dom"
import { Navbar } from "./Navbar"
import Dashboard from "./subcomponents/Dashboard"
import MyFiles from "./subcomponents/MyFiles"
import Files from "./subcomponents/Files"
import { NotFound } from "../NotFound"
import SharedFiles from "./subcomponents/SharedFiles"
import Favourites from "./subcomponents/Favourites"
import History from "./subcomponents/History"
import Upgrade from "./subcomponents/Upgrade"
import Wallet from "./subcomponents/Wallet"
import Profile from "./subcomponents/Profile"
import Blocked from "./subcomponents/Blocked"

export const UserDashboard = () => {

    return (
        <>
            <Navbar />
            
            {/* Path match hone par wahi component render hoga */}
            <Routes>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="my-files" element={<MyFiles />} />
                <Route path="my-files/:id" element={<Files />} />
                <Route path="shared-files" element={<SharedFiles />} />
                <Route path="favourite" element={<Favourites />} />
                <Route path="history" element={<History />} />
                <Route path="upgrade" element={<Upgrade />} />
                <Route path="wallet" element={<Wallet />} />
                <Route path="profile" element={<Profile />} />
                <Route path="blocked" element={<Blocked />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    )
}