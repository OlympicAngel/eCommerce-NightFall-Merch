import { Badge, Stack, Text } from "@chakra-ui/react";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";

//shows sort by buttons
function SortButtons({ setCurrentOpt, currentOpt, options, setAccordionIndex }) {
    return <Stack direction='row' m={"1em"}>
        <Text h={"min-content"}>מיון:</Text>
        {options.map((o, index) => {
            const isChecked = index + 1 == Math.abs(currentOpt);
            return <Badge key={index} onClick={() => { setCurrentOpt(index + 1); setAccordionIndex([]) }}
                userSelect={"none"}
                cursor={"pointer"}
                variant={isChecked ? "solid" : 'outline'}
                _hover={{ bg: "gray.400", color: "purple.900" }}
                colorScheme={o.color || 'purple'}
                p={"0.5em"} h={"min-content"} verticalAlign={"center"}>
                {isChecked && (Math.sign(currentOpt) == 1 ? <AiFillCaretDown /> : <AiFillCaretUp />)}{o.title}
            </Badge>
        })}

    </Stack>
}

export default SortButtons;