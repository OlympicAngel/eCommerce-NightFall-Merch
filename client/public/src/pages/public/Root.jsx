import { Outlet } from "react-router-dom";
import Nav from "../../components/partials/Nav";
import Footer from "../../components/partials/Footer";

function Root() {
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