import "./index.css"
import { Suspense, lazy, useContext } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Outlet,
  Navigate
} from "react-router-dom";
import Nav from "./components/partial/Nav"
import { Box, Container, Spinner } from "@chakra-ui/react";
import { AuthContext } from "./context/AuthProvider";
import useAuth from "./hooks/useAuth";
const Login = lazy(() => import("./pages/Login"));
const Products = lazy(() => import("./pages/Products"));
const Orders = lazy(() => import("./pages/Orders"));
const Categories = lazy(() => import("./pages/Categories"));



function Root() {
  const { isLoading } = useAuth()
  const { isAuth } = useContext(AuthContext)

  return <>
    <Box as="header" width={"100%"} textAlign={"center"}>
      {isAuth && <Nav />}
    </Box>
    <Container p={1} as="main" maxW='6xl' minH="100vh - 4em" borderRadius="1em" centerContent>
      {isLoading && <CustomSpinner />}
      <Suspense fallback={<CustomSpinner />} >
        {!isLoading && <Outlet />}
      </Suspense>

    </Container>
    <Box as="footer"></Box>
  </>
}

function CustomSpinner() {
  return <Spinner colorScheme="purple" color='purple.500' size="xl" thickness="0.2em" />;
}

function App() {
  const { isAuth } = useContext(AuthContext)

  const router = createBrowserRouter(createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route index element={isAuth ? null : <Navigate to={"/login"} />} />
      <Route path="/login" element={<Login />} />

      <Route element={isAuth ? null : <Navigate to={"/login"} />}>
        <Route path="/products" element={<Products />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/categories" element={<Categories />} />
      </Route>
    </Route>
  ))
  return (
    <RouterProvider router={router}></RouterProvider>
  )
}

export default App
