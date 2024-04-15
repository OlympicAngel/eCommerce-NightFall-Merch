import { useEffect } from "react"

/**
 *  * Sets the title of the document page
 * @param {String} title 
 * @param {*} updater_arg force update when this argument is changing (most likely using useState )
 */
function useTitle(title, updater_arg = undefined) {
    useEffect(() => {
        document.title = `${title} | נייטפול מרצ'`
    }, [title, updater_arg])
}
export default useTitle