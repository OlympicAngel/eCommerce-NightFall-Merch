import {
  createBrowserRouter, RouterProvider, Route, createRoutesFromElements,
} from "react-router-dom";

import Root from './pages/Root';

import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Register from './pages/public/Register';
import Login from './pages/public/Login';

import Products from './pages/public/products/Products';
import Product from './pages/public/products/Product';

import Orders from './pages/private/Orders';
import Purchase from './pages/public/Purchase';

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />}>
        <Route index element={<Products />} />
        <Route path="product/:id" element={<Product />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="orders" element={<Orders />} />
        <Route path="purchase" element={<Purchase />} />
      </Route>
    )
  )


  return (
    <RouterProvider router={router} />
  )
}

export default App
