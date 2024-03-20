import { Outlet, useLocation } from "react-router-dom";
import Nav from "../../components/partials/Nav";
import Footer from "../../components/partials/Footer";
import { useEffect, useContext, Suspense } from "react";
import { updateRealTimeLooking } from "../../context/RealTimeData";
import { AuthContext } from "../../context/AuthProvider";
import { Container } from "@chakra-ui/react";
import Loader from "../../components/partials/Loader";


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
            <Container p={1} as="main" maxW='8xl' minH="100vh - 4em" fontSize={["xs", "sm", "md"]} borderRadius="1em" centerContent>
                <Suspense fallback={<Loader />} >
                    <Outlet />
                </Suspense>
            </Container>
            <footer>
                <Footer />
            </footer>
        </>
    );
}
export default Root