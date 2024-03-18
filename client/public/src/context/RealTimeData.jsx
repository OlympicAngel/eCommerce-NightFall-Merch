import { useContext, useEffect } from "react";
import { AuthContext } from "./AuthProvider";
import { ref, remove, update } from "firebase/database";
import { rtDB } from "../../firebase.config";

function RealTimeData({ children }) {
    const { isAuth, user } = useContext(AuthContext)

    //when leaves site - remove user from db.
    async function handleUnload(e) {
        e.preventDefault();
        const userID = getUserUUID(isAuth, user);
        await removeRealTimeUser(userID);
    }

    //add event hooks to detect activity of user - runs only once!
    useEffect(() => {
        //add rnd uuid to identify guests
        if (!sessionStorage.guest)
            sessionStorage.guest = Math.random();
        //updateRealTimeLooking(isAuth, user); //sets the current page as "looking"

        window.addEventListener("unload", handleUnload) //detects when user leaves site
        window.addEventListener("visibilitychange", updateRealTimeLooking.bind(null, isAuth, user)) //detects when user is no longer looking

        //cleanup
        return () => {
            window.removeEventListener("unload", handleUnload);
            window.removeEventListener("visibilitychange", updateRealTimeLooking.bind(null, isAuth, user));
        }
    }, []);


    //TODO testings

    //handle login/logout
    useEffect(() => {
        //if user just logged in
        if (isAuth) {
            //use session storage to delete "guest"
            const userID = getUserUUID(false, user);
            delete sessionStorage.guest
            removeRealTimeUser(userID);
        }
        else { //if user logged-out
            //use old {user} to delete logged out user
            const userID = getUserUUID(true, user);
            removeRealTimeUser(userID);
        }
    }, [isAuth])

    return children;
}
export default RealTimeData

//get user id / guest session id
function getUserUUID(isAuth, user) { return isAuth ? user._id : ("guest_" + sessionStorage.guest.split(".").pop()); }


export async function updateRealTimeLooking(isAuth, user) {
    const looking = document.visibilityState === "visible";
    const userID = getUserUUID(isAuth, user);
    const users = ref(rtDB, "users/" + userID)
    await update(users, { looking: looking && ("/" + window.location.href.replace("//", "").split("/").splice(1).join("/")) })
}

export async function removeRealTimeUser(userID) {
    const users = ref(rtDB, "users/" + userID)
    await remove(users)
}