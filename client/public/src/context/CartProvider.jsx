import { useState } from "react"
import { useEffect } from "react"
import { createContext } from "react"
import { CartItem, Product } from "../utils/types"
import CartView from "../components/partials/CartView"

export const CartContext = createContext()

function CartProvider({ children }) {
  /** @type {[CartItem[],Function]} */
  const [cartItems, setCart] = useState([])
  const [isToggle, setIsToggle] = useState()



  //attemp load cart from local storage
  useEffect(() => {
    try {
      const memoCart = JSON.parse(localStorage.cartItems);
      setCart(memoCart);
    } catch (e) { }
  }, [])

  //save to local storage
  useEffect(() => {
    localStorage.cartItems = JSON.stringify(cartItems)
  }, [cartItems])

  /**
   * adds a product to cart
   * @param {Product} product 
   * @returns 
   */
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
  /**
   * removed a product from cart (as count)
   * @param {Product} product 
   * @returns 
   */
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

  /**
   * completely remove product from cart
   * @param {Product} product 
   */
  function deleteFromCart(product) {
    //keep only none this
    setCart(cartItems.filter(p => p.product != product._id))
  }

  /**
   * get total ite m COUNT
   * @returns {Number}
   */
  function getItemsCount() {
    return cartItems.reduce((preVal, p) => preVal + p.quantity, 0)
  }

  /**
   * get total cart worth
   * @returns {Number}
   */
  function getCartPrice() {
    return cartItems.reduce((preVal, p) => preVal + p.quantity * p.ref.price, 0)
  }

  /**
   * used to pass it to server with minimal data required
   * @returns {CartItem[]}
   */
  function simplifyCart() {
    return cartItems.map((item) => {
      const { product, quantity } = item;
      return { product, quantity }
    });
  }

  /**
   * checks if an product is inside the card
   * @param {Product} product 
   * @returns {CartItem}
   */
  function checkIsOnCart(product) {
    return cartItems.find(ci => ci.product == product._id)
  }

  const data = {
    cartItems,
    addToCart,
    removeFromCart,
    deleteFromCart,
    resetCart: () => { setCart([]) },
    getItemsCount,
    getCartPrice,
    simplifyCart,
    OpenCart: () => setIsToggle(prev => !prev),
    checkIsOnCart
  }
  return (
    <CartContext.Provider value={data}>
      {children}
      <CartView toggleOpen={isToggle} />
    </CartContext.Provider>
  )
}
export default CartProvider