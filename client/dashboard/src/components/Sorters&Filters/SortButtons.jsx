import { Badge, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";

//shows sort by buttons
function SortButtons({ sortLogic, onChange }) {

    if (!sortLogic)
        throw new Error("missing sortLogic hook handler. use: SortBtn.useSortLogic(...)")

    const { sortList, currSorter, setCurrSorter } = sortLogic

    return <Stack direction='row' m={"1em"}>
        <Text h={"min-content"}>מיון:</Text>
        {sortList.map((o, index) => {
            const isChecked = index + 1 == Math.abs(currSorter);
            return <Badge key={index} onClick={() => { setCurrSorter(index + 1); onChange && onChange() }}
                userSelect={"none"}
                cursor={"pointer"}
                variant={isChecked ? "solid" : 'outline'}
                _hover={{ bg: "gray.400", color: "purple.900" }}
                colorScheme={o.color || 'purple'}
                p={"0.5em"} h={"min-content"} verticalAlign={"center"}>
                {isChecked && (Math.sign(currSorter) == 1 ? <AiFillCaretDown /> : <AiFillCaretUp />)}{o.title}
            </Badge>
        })}

    </Stack>
}

export default SortButtons;

export class SortBtn {
    /**
     * 
     * @param {String} title  btn text
     * @param {Function} sortFunc sort function (a,b,sign)=>{} 
     */
    constructor(title, sortFn) {
        this.title = title;
        this.sortFn = sortFn;
    }

    /**
     * 
    * @param {SortBtn[]} sortBtnList 
     * @returns 
     */
    static useSortLogic(sortBtnList) {
        const [currSorter, setSorterOpt] = useState(1)
        //set sorting option OR if its the same sorting opt - change -/+ sign
        const setCurrSorter = (val) => { val == currSorter ? setSorterOpt(val * -1) : setSorterOpt(val) }
        return {
            currSorter,
            setCurrSorter,
            sortFn: (a, b) => {
                const fn = sortBtnList[Math.abs(currSorter) - 1].sortFn;
                return fn(a, b) * Math.sign(currSorter);
            },
            sortList: sortBtnList
        }
    }
}