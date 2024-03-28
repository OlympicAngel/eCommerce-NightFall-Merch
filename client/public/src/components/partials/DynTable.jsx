import { Box, Flex, Table, Tbody, Td, Tr, useBreakpointValue } from "@chakra-ui/react"

function DynTable(props) {
    const isMobile = useBreakpointValue({ base: true, md: false })
    const innerChilds = props.children.filter(c => !c?.trim);

    if (isMobile)
        return <Box  {...props} children={undefined}>
            <Table size={["xs", "sm"]}>
                <Tbody>
                    {innerChilds[0].props.children.props.children.filter(c => !c?.trim).map((c, index) => {
                        return <Tr key={index} bg={index % 2 == 0 && "blackAlpha.300"}>
                            {c}{innerChilds[1].props.children.props.children.filter(c => !c?.trim)[index]}
                        </Tr>
                    })}
                </Tbody>
            </Table>
        </Box>

    return <Table size={["sm", "md", "lg"]} {...props} children={undefined}>
        {innerChilds}
    </Table>

}
export default DynTable
