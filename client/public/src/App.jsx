import {
  createBrowserRouter, RouterProvider, Route, createRoutesFromElements
} from "react-router-dom";
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Register from './pages/public/Register';
import Login from './pages/public/Login';
import Products from './pages/public/Products';
import ProductSingle from './pages/public/ProductSingle';
import Orders from './pages/private/Orders';
import Root from "./pages/public/Root";

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
