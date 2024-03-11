import { Box, Spinner } from "@chakra-ui/react"

function Loader({ size }) {
    return (
        <Box position="relative" minH={`min(${size || "100%"},10vh`} w={"inherit"} h="inherit">
            <Spinner color="purple.300" size={size || "xl"} colorScheme="purple"
                position={"absolute"} inset={0} margin={"auto"} thickness="0.2em" >
            </Spinner>
        </Box>
    )
}
export default Loader