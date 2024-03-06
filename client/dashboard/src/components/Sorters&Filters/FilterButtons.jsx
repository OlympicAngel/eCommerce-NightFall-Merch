import { Badge, HStack, Stack, Text, VStack } from "@chakra-ui/react"
import { useState } from "react";

//shows stats filter buttons
function FilterButtons({ filterLogic }) {
    if (!filterLogic)
        throw new Error("missing filterLogic hook handler. use: FilterBtn.useFilterBtnLogic(...)")

    const { filterList, setCurrFilter, currFilter } = filterLogic

    return <HStack justifyContent={["space-between", "flex-end"]}>
        <Text h={"min-content"}>הצג:</Text>
        <Stack direction='row' alignItems={"center"} w={["-webkit-fill-available", "auto"]}>
            {filterList.map((o, index) =>
                <Badge key={index} onClick={() => { setCurrFilter(index) }}
                    userSelect={"none"} textAlign={"center"}
                    cursor={"pointer"} flex="0 1 10em"
                    variant={index == currFilter ? "solid" : 'outline'}
                    _hover={{ bg: "gray.400", color: "purple.900" }}
                    colorScheme={o.color || 'purple'} value={index}
                    p={"0.5em"} h={"min-content"} verticalAlign={"center"}>
                    {o.title}
                </Badge>)}
        </Stack>
    </HStack>
}
export default FilterButtons

export class FilterBtn {
    /**
     * 
     * @param {String} title btn title 
     * @param {Function} fn function to run on each element in list - returns true if item should be shown
     * @param {String} color colorScheme  
     */
    constructor(title, fn = () => { }, color = undefined) {
        this.title = title;
        this.fn = fn;
        this.color = color;
    }

    /**
     * 
    * @param {FilterBtn[]} filterBtnList 
     */
    static useFilterBtnLogic(filterBtnList) {
        const [currFilter, setCurrFilter] = useState(0)
        return { currFilter, setCurrFilter, filterFn: filterBtnList[currFilter].fn, filterList: filterBtnList }
    }
}