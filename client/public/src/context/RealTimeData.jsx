import { useContext, useEffect } from "react";
import { AuthContext } from "./AuthProvider";
import { ref, remove, update } from "firebase/database";
import { getFirebaseUser, rtDB } from "../../firebase.config";
import { CartContext } from "./CartProvider";

function RealTimeData({ children }) {
    const { isAuth, user } = useContext(AuthContext)
    const { getItemsCount, getCartPrice, cartItems } = useContext(CartContext)

    //when leaves site - remove user from db.
    async function handleUnload(e) {
        e.preventDefault();
        await removeRealTimeUser();
    }

    //add event hooks to detect activity of user - runs only once!
    useEffect(() => {
        window.addEventListener("unload", handleUnload) //detects when user leaves site
        window.addEventListener("visibilitychange", updateRealTimeLooking.bind(null, isAuth, user)) //detects when user is no longer looking

        //cleanup
        return () => {
            window.removeEventListener("unload", handleUnload);
            window.removeEventListener("visibilitychange", updateRealTimeLooking);
        }
    }, []);


    //handle cart changes -> send minimal statistics data to realtime db
    useEffect(() => {
        const worth = getCartPrice();
        const itemCount = getItemsCount();
        updateRealTimeCart(worth, itemCount)
    }, [cartItems])

    return children;
}
export default RealTimeData


export async function updateRealTimeLooking() {
    const userID = (await getFirebaseUser()).uid

    const looking = document.visibilityState === "visible";
    const users = ref(rtDB, "users/" + userID)
    await update(users, {
        looking: looking && ("/" + window.location.href.replace("//", "").split("/").splice(1).join("/")),
        lastUpdated: new Date()
    })
}

async function updateRealTimeCart(worth, itemCount) {
    const userID = (await getFirebaseUser()).uid
    const users = ref(rtDB, "users/" + userID)
    await update(users, {
        cart: {
            worth,
            itemCount
        },
        lastUpdated: new Date()
    })
}

export async function removeRealTimeUser() {
    const userID = (await getFirebaseUser()).uid
    const users = ref(rtDB, "users/" + userID)
    await remove(users)
}