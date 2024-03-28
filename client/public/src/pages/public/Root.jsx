import { Outlet, useLocation, useNavigate, useNavigation } from "react-router-dom";
import Nav from "../../components/partials/Nav";
import Footer from "../../components/partials/Footer";
import { useEffect, useContext, Suspense } from "react";
import { updateRealTimeLooking } from "../../context/RealTimeData";
import { AuthContext } from "../../context/AuthProvider";
import { Box, Container, Image } from "@chakra-ui/react";
import Loader from "../../components/partials/Loader";
import useAuth from "../../hooks/useAuth";


function Root() {
    const { isLoading } = useAuth();

    const location = useLocation();
    const { isAuth, user } = useContext(AuthContext)
    const isIndex = location.pathname == "/";

    useEffect(() => {
        updateRealTimeLooking(isAuth, user)
    }, [location])
    return (
        <>
            <Box as="header" minH={["4em", "auto"]} position={"sticky"} top="0" zIndex={1}>
                <Nav />
            </Box>

            {
                isIndex &&
                <Image src="/images/banner.webp" alt="נייטפול חנות המרצ'" objectFit='cover' boxShadow={"dark-lg"}
                    minH={"200px"} maxH={"50vmin"} w={"100%"} borderY={"0.5em solid"} />
            }

            <Container p={1} as="main" maxW='8xl' minH="100vh - 4em" mt={"2em"} fontSize={["xs", "sm", "md"]} borderRadius="1em" position={"relative"} centerContent>
                {isLoading && <Loader />}
                <Suspense fallback={<Loader />} >
                    {!isLoading && <Outlet />}
                </Suspense>
            </Container>
            <footer>
                <Footer />
            </footer>
        </>
    );
}
export default Root