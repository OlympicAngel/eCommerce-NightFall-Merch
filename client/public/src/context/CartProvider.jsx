import { useState } from "react"
import { useEffect } from "react"
import { createContext } from "react"
import { useContext } from "react"

export const CardContext = createContext()

function CartProvider({ children }) {

  const [cartItems, setCart] = useState([])

  //attemp load cart from local storage
  useEffect(() => {
    try {
      const memoCart = JSON.parse(localStorage.cartItems);
      setCart(memoCart);
    } catch (e) { }
  }, [])

  useEffect(() => {
    localStorage.cartItems = JSON.stringify(cartItems)
  }, [cartItems])

  function addToCart(product) {
    const isProductAlreadyInCart = cartItems.find(p => p.product == product._id)

    if (!isProductAlreadyInCart) {
      //if not in cart add new with value of 1
      return setCart([...cartItems, {
        product: product._id,
        quantity: 1,
        ref: product
      }]) //we save this way so later we can just delete {ref} and send it to server side
    }

    //update quantity only
    setCart(cartItems.map(p => {
      if (p.product == product._id)
        p.quantity++;
      return p;
    }))
  }
  function removeFromCart(product) {
    const isProductAlreadyInCart = cartItems.find(p => p.product == product._id)

    //if not in cart we cant remove?
    if (!isProductAlreadyInCart)
      return;

    //update quantity only
    setCart(cartItems.filter(p => {
      if (p.product == product._id)
        p.quantity--; //reduce quantity
      return p.quantity > 0; //if quantity <= 0 set to false - filter it out
    }))
  }
  function deleteFromCart(product) {
    //keep only none this
    setCart(cartItems.filter(p => p.product != product._id))
  }
  //calculate item count
  function getCartItems() {
    return cartItems.reduce((preVal, p) => preVal + p.quantity, 0)
  }

  const data = {
    cartItems,
    addToCart,
    removeFromCart,
    deleteFromCart,
    resetCart: () => { setCart = [] },
    getCartItems,
  }
  return (
    <CardContext.Provider value={data}>
      {children}
    </CardContext.Provider>
  )
}
export default CartProvider