import { Badge, Stack, Text } from "@chakra-ui/react"

//shows stats filter buttons
function FilterButtons({ setCurrentOpt, currentOpt, options }) {
    return <Stack direction='row'>
        <Text h={"min-content"}>הצג:</Text>
        {options.map((o, index) =>
            <Badge key={index} onClick={() => { setCurrentOpt(index) }}
                userSelect={"none"}
                cursor={"pointer"}
                variant={index == currentOpt ? "solid" : 'outline'}
                _hover={{ bg: "gray.400", color: "purple.900" }}
                colorScheme={o.color || 'purple'} value={index}
                p={"0.5em"} h={"min-content"} verticalAlign={"center"}>
                {o.title}
            </Badge>)}
    </Stack>
}
export default FilterButtons