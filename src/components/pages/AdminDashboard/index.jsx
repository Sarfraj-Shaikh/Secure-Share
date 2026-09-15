import { lazy, Suspense } from "react"
import { Routes, Route } from "react-router-dom"
import Navbar from "./Navbar";
import AllUsers from "./subComponents/AllUsers";
import Profile from "../UserDashboard/subcomponents/Profile";
import UserDetails from "./subComponents/UserDetails";
import AllFolders from "./subComponents/AllFolders";
import AllFiles from "./subComponents/AllFiles";
import AllSharedFiles from "./subComponents/AllSharedFiles";
import History from "./subComponents/History";

const AdminDashboard = () => {
    return (
        <>
            <Navbar />

            <Routes>
                <Route path="dashboard" element={""} />
                <Route path="all-users" element={<AllUsers />} />
                <Route path="all-users/:id" element={<UserDetails />} />
                <Route path="all-folders" element={<AllFolders />} />
                <Route path="all-files" element={<AllFiles />} />
                <Route path="all-shared-files" element={<AllSharedFiles />} />
                <Route path="history" element={<History />} />
                <Route path="profile" element={<Profile />} />

            </Routes>

        </>
    )
}

export default AdminDashboard;