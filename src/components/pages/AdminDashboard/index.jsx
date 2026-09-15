import { lazy, Suspense } from "react"
import { Routes, Route } from "react-router-dom"
import Navbar from "./Navbar";
import AllUsers from "./subComponents/AllUsers";
import Profile from "../UserDashboard/subcomponents/Profile";

const AdminDashboard = () => {
    return (
        <>
            <Navbar />

            <Routes>
                <Route path="dashboard" element={""} />
                <Route path="all-users" element={<AllUsers />} />
                <Route path="profile" element={<Profile />} />

            </Routes>

        </>
    )
}

export default AdminDashboard;