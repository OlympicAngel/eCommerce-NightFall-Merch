import { useEffect, useState } from "react";
import { rtDB } from "../../firebase.config"
import { ref, get, onValue, remove } from "firebase/database";

function useFirebaseDB() {
    const usersRef = ref(rtDB, 'users');
    const [data, setData] = useState(undefined)

    function updateData(rawData) {

        const newData = {
            totalCartsWorth: rawData && Object.values(rawData).reduce((preVal, user) => preVal + user?.cart?.worth || 0, 0),
            totalCartsItems: rawData && Object.values(rawData).reduce((preVal, user) => preVal + user?.cart?.itemCount || 0, 0),
            activeUsers: rawData && Object.keys(rawData).length || 1,
            activePages: {}
        }
        if (!rawData)
            return setData(pre => (pre || {
                totalCartsWorth: [{ y: 0, x: new Date() }],
                totalCartsItems: [{ y: 0, x: new Date() }],
                activeUsers: [{ y: 0, x: new Date() }],
                activePages: {}
            }));



        for (let userID in rawData) {
            const user = rawData[userID];

            //delete user if not active for 5 min
            if (Number(new Date(user.lastUpdated)) + 1000 * 60 * 5 < Date.now()) {
                const userRef = ref(rtDB, 'users/' + userID);
                remove(userRef);
            }

            if (user.looking == undefined)
                continue;
            const page = user.looking || "לא בפוקוס על האתר";
            if (!newData.activePages[page])
                newData.activePages[page] = 1;
            else
                newData.activePages[page]++;
        }


        setData(prevData => {
            const copy = Object.assign({}, prevData)
            //scan each key
            for (let key in newData) {
                if (key == "activePages") {
                    copy[key] = newData[key];
                    continue
                }

                //if the values are different
                if (copy[key]?.[0]?.y != newData[key]) {
                    if (copy[key] == undefined)
                        copy[key] = [{ y: newData[key], x: new Date() }, { y: 0, x: new Date(Date.now() - 1000 * 60) }]//set initial value  
                    else
                        copy[key] = [{ y: newData[key], x: new Date() }, ...copy[key]]//add item
                }
            }
            return copy;
        })
    }

    useEffect(() => {
        const unSub_trigger = onValue(usersRef, (snapshot) => {
            const rawData = snapshot.val();
            updateData(rawData)
        });
        return () => {
            console.log("stoped listening")
            //on comp unload disconnect to prevent db usage
            unSub_trigger()
        }
    }, [])

    return data || {};
}
export default useFirebaseDB
