import {
  createBrowserRouter, RouterProvider, Route, createRoutesFromElements, Navigate, Outlet
} from "react-router-dom";
import { lazy, useContext } from "react";
import Root from "./pages/public/Root";
import { AuthContext } from "./context/AuthProvider";
import useAuth from "./hooks/useAuth";

const About = lazy(() => import('./pages/public/About'))
const Login = lazy(() => import('./pages/public/Login'))
const Products = lazy(() => import('./pages/public/Products'))
const ProductSingle = lazy(() => import('./pages/public/ProductSingle'))
const Random = lazy(() => import("./pages/public/Random"))
const OrderView = lazy(() => import('./pages/public/OrderView'))
const Categories = lazy(() => import('./pages/public/Categories'))

const Profile = lazy(() => import('./pages/private/Profile'))

const LoginRegister = <Login />;

function App() {
  const { isAuth } = useContext(AuthContext)

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />}>
        <Route index element={<Products />} />
        <Route path="product" element={<Navigate to={"/"} />}></Route>
        <Route path="product/:id/*" element={<ProductSingle />} />
        <Route path="random/*" element={<Random />} />
        <Route path="about" element={<About />} />
        <Route path="register" element={LoginRegister} />
        <Route path="login" element={LoginRegister} />
        <Route path="order/:orderID" element={<OrderView />} />
        <Route path="categories" element={<Categories />} />
        <Route path="categories/:categoryName/*" element={<Categories />} />

        <Route element={isAuth ? null : <Navigate to={"/login"} />}>
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>
    )
  )
  return (
    <RouterProvider router={router} />
  )
}





export default App
