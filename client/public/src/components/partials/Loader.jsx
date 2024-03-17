import { Box, Spinner } from "@chakra-ui/react"

function Loader({ size }) {
    return (
        <Spinner color="purple.300" size={size || "xl"}
            position={"absolute"} inset={0} margin={"auto"} thickness="0.4em" >
        </Spinner>
    )
}
export default Loader