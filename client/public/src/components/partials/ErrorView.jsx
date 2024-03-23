import { Flex, Heading, Highlight, Text } from "@chakra-ui/react"

function ErrorView({ error }) {
    if (!error)
        return;
    const msg = error.data?.message || error.message

    return (
        <Flex gap="0.5em" color="red.500" background="blackAlpha.500" borderRadius="0.5em" w={"fit-content"} m={"auto"} px={"1em"}>
            <Heading colorScheme="red" size={"md"}>
                שגיאה:
            </Heading>
            <Text color="white">
                <Highlight query={["error", "שגיאה", "בעייה", "failed"]} styles={{ fontWeight: 700, color: "red.400" }}>
                    {msg}
                </Highlight>
            </Text>
        </Flex>
    )
}
export default ErrorView