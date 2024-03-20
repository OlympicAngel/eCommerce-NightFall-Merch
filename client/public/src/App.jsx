import {
  createBrowserRouter, RouterProvider, Route, createRoutesFromElements
} from "react-router-dom";
import { lazy } from "react";
import Root from "./pages/public/Root";

const About = lazy(() => import('./pages/public/About'))
const Contact = lazy(() => import('./pages/public/Contact'))
const Register = lazy(() => import('./pages/public/Register'))
const Login = lazy(() => import('./pages/public/Login'))
const Products = lazy(() => import('./pages/public/Products'))
const ProductSingle = lazy(() => import('./pages/public/ProductSingle'))
const Orders = lazy(() => import('./pages/private/Orders'))

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />}>
        <Route index element={<Products />} />
        <Route path="product/:id" element={<ProductSingle />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="orders" element={<Orders />} />
      </Route>
    )
  )
  return (
    <RouterProvider router={router} />
  )
}





export default App
