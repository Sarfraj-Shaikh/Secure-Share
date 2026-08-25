import { Routes, Route } from "react-router-dom"
import { Navbar } from "./Navbar"
import Dashboard from "./subcomponents/Dashboard"
import MyFiles from "./subcomponents/MyFiles"
import Files from "./subcomponents/Files"
import { NotFound } from "../NotFound"

export const UserDashboard = () => {

    return (
        <>
            <Navbar />
            
            {/* Path match hone par wahi component render hoga */}
            <Routes>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="my-files" element={<MyFiles />} />
                <Route path="my-files/:id" element={<Files />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    )
}