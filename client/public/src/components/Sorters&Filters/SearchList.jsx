import { HStack, Input, InputGroup, InputLeftElement, InputRightElement, Text, useColorModeValue } from "@chakra-ui/react"
import { useState } from "react"
import { BiSearchAlt2 } from "react-icons/bi"

function SearchList({ list, filteredList, searchLogic, placeholder = "חיפוש" }) {
    if (!searchLogic)
        throw new Error("Missing {searchLogic} props, please use useSearchLogic hook")
    const { setSearchTerm } = searchLogic;


    const colors = useColorModeValue(
        ["white"],
        ["gray.300"]
    )

    return (
        <InputGroup>
            <HStack w={"inherit"}>
                <InputLeftElement pointerEvents='none'>
                    <BiSearchAlt2 />
                </InputLeftElement>
                <Input p={"1em"} pr={"2.5em"} type='search' borderColor={colors[0]} borderWidth={2}
                    onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                    placeholder={placeholder} />
                {list && filteredList && <Text whiteSpace={"nowrap"}>{filteredList.length} מתוך {list.length}</Text>}

            </HStack>
        </InputGroup>
    )
}
export default SearchList

/**
 * 
 * @param {{onlyStartWith:Boolean}} param0 
 * @returns 
 */
export function useSearchLogic(args = { onlyStartWith: true }) {
    const { onlyStartWith } = args;
    const [searchTerm, setSearchTerm] = useState("");
    return { setSearchTerm, filterFn: (item) => deepSearch(item, searchTerm, onlyStartWith) }
}

//recursive deep search function to search at all order data
function deepSearch(obj, match, onlyStartWith = true) {
    if (!obj)
        return false;
    return Object.values(obj).find(val => {
        if (typeof val === "object")
            return deepSearch(val, match, onlyStartWith)
        val = val?.toString().toLowerCase();
        let isMatch = false;
        if (onlyStartWith)
            isMatch = val?.startsWith(match);
        else
            isMatch = val?.includes(match);

        return isMatch
    })
}
