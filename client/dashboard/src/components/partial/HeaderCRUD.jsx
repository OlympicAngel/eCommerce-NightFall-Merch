import { Box, Button, Flex, HStack, Heading, Text, Tooltip } from "@chakra-ui/react";
import { AiFillPlusCircle } from "react-icons/ai";
import { SiMicrosoftexcel } from "react-icons/si";
import ConvertToExcel from "../../utils/toExcel";

function HeaderCRUD({ name, list, onAdd, children }) {
    if (!name)
        throw new Error("missing name prop")
    return (
        <Flex w={"100%"} gap={3} justifyContent={"space-between"} wrap="wrap">
            <Heading flex="999" whiteSpace={"nowrap"}>
                רשימת {name}:
            </Heading>
            <Flex display={"inline-flex"} gap={3} w={"100%"} flex="1" flexDirection={"column"}>
                {(list || onAdd) &&
                    <Flex gap={3} justifyContent={"flex-end"}>
                        {list &&
                            <Tooltip label="הורדה בצורת אקסל" aria-label='A tooltip'>
                                <Button flex={[1, 0]} minW={"fit-content"} colorScheme="blue" onClick={ConvertToExcel.bind(null, list, "כל ה" + name)}>
                                    <SiMicrosoftexcel size={30} /></Button>
                            </Tooltip>
                        }
                        {onAdd &&
                            <Button flex="1" minW={"fit-content"} colorScheme="green" boxShadow="2xl" onClick={() => { onAdd && onAdd(); }}>
                                <HStack><AiFillPlusCircle /><Text>הוסף {name.replace(/(ים)$/, "").replace(/(ות)$/, "ה")}</Text></HStack>
                            </Button>
                        }
                    </Flex>
                }
                {children}
                {children && <Box></Box>}
            </Flex>
        </Flex>
    )
}
export default HeaderCRUD