import { Badge, Stack, Text } from "@chakra-ui/react"
import { useState } from "react";

//shows stats filter buttons
function FilterButtons({ filterLogic }) {
    if (!filterLogic)
        throw new Error("missing filterLogic hook handler. use: FilterBtn.useFilterBtnLogic(...)")

    const { filterList, setCurrFilter, currFilter } = filterLogic

    return <Stack direction='row'>
        <Text h={"min-content"}>הצג:</Text>
        {filterList.map((o, index) =>
            <Badge key={index} onClick={() => { setCurrFilter(index) }}
                userSelect={"none"}
                cursor={"pointer"}
                variant={index == currFilter ? "solid" : 'outline'}
                _hover={{ bg: "gray.400", color: "purple.900" }}
                colorScheme={o.color || 'purple'} value={index}
                p={"0.5em"} h={"min-content"} verticalAlign={"center"}>
                {o.title}
            </Badge>)}
    </Stack>
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