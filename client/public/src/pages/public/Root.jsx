import { Outlet } from "react-router-dom";
import Nav from "../../components/partials/Nav";
import Footer from "../../components/partials/Footer";

function Root() {
    return (
        <>
            <Nav />
            <Outlet />
            <Footer />
        </>
    );
}
export default Root