import { Outlet, useLocation } from "react-router-dom";
import Nav from "../../components/partials/Nav";
import Footer from "../../components/partials/Footer";
import { useEffect, useContext } from "react";
import { updateRealTimeLooking } from "../../context/RealTimeData";
import { AuthContext } from "../../context/AuthProvider";


function Root() {
    const location = useLocation();
    const { isAuth, user } = useContext(AuthContext)

    useEffect(() => {
        updateRealTimeLooking(isAuth, user)
    }, [location])
    return (
        <>
            <header>
                <Nav />
            </header>
            <main>
                <Outlet />
            </main>
            <footer>
                <Footer />
            </footer>
        </>
    );
}
export default Root