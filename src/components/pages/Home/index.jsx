import { Navbar } from "./Navbar"
import { Hero } from "./subComponents/Hero"
import { Statics } from './subComponents/Statics'; // ✅ Correct

export const Home = () => {
    return (
        <>
            <Navbar />
            <Hero />
            <Statics />
        </>
    )
}