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
import { Box, Container, Spinner } from "@chakra-ui/react";
import { AuthContext } from "./context/AuthProvider";
import useAuth from "./hooks/useAuth";
//components
const Nav = lazy(() => import("./components/partial/Nav"));
const LoggedAdminFooter = lazy(() => import("./components/partial/LoggedAdminFooter"));
//pages
const Login = lazy(() => import("./pages/Login"));
const Products = lazy(() => import("./pages/Products"));
const Orders = lazy(() => import("./pages/Orders"));
const Categories = lazy(() => import("./pages/Categories"));
const Users = lazy(() => import("./pages/Users"));




function Root() {
  const { isLoading } = useAuth()
  const { manager, isAuth } = useContext(AuthContext)

  return <>
    <Box as="header" width={"100%"} textAlign={"center"}>
      {isAuth &&
        <Nav />
      }
    </Box>
    <Container p={1} as="main" maxW='8xl' minH="100vh - 4em"
      fontSize={["xs", "sm", "md"]} borderRadius="1em" centerContent>
      {isLoading && <CustomSpinner />}
      <Suspense fallback={<CustomSpinner />} >
        {!isLoading && <Outlet />}
      </Suspense>
    </Container>

    {isAuth &&
      <LoggedAdminFooter manager={manager}></LoggedAdminFooter>
      || <Box></Box>}
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
        <Route path="/users" element={<Users />} />
      </Route>
    </Route>
  ))
  return (
    <RouterProvider router={router}></RouterProvider>
  )
}

export default App
