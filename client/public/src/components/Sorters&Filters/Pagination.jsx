import { AiOutlineCaretDown } from "react-icons/ai";
import { Button, Divider, Flex, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { useState } from "react";

function Pagination({ list, paginationLogic, colorScheme = "purple", pages = undefined }) {
    if (!paginationLogic)
        throw new Error("missing {paginationLogic} please use usePaginationLogic()")
    const {
        cPage,
        minPerPage,
        itemsPerPages,
        setItemsPerPages,
    } = paginationLogic;
    const pageCount = pages || Math.ceil(list?.length / itemsPerPages) || 0;
    const btnArr = Array(pageCount).fill(0)
    const maxBtn = 5;

    return (
        <Flex gap={"0.5em"} w={"inherit"} justifyContent={"center"} my="1em">
            {
                btnArr.map((v, i) => {
                    if ((i <= cPage - maxBtn / 2 && i < pageCount - maxBtn) ||
                        (i >= cPage + maxBtn / 2 && i >= maxBtn))
                        return;
                    const isCurrent = i == paginationLogic.cPage;
                    return <Button key={i} border={!isCurrent && "solid 0.05em gray"} bg="gray"
                        variant={isCurrent ? "outline" : "ghost"}
                        isDisabled={isCurrent} boxShadow={"md"}
                        colorScheme={colorScheme} fontSize={"1.5em"}
                        onClick={() => { paginationLogic.setCPage(i) }}>
                        {i + 1}</Button>
                })
            }
            <Divider orientation="vertical" ></Divider>
            <Menu placement="bottom" >
                <MenuButton as={Button} colorScheme={colorScheme} variant={"ghost"} leftIcon={<AiOutlineCaretDown />}
                    border={"solid 0.05em gray"} bg="gray" boxShadow={"md"}>
                    מציג: {itemsPerPages}
                </MenuButton>
                <MenuList minW={"5em"} >
                    <MenuItem justifyContent={"center"} onClick={setItemsPerPages.bind(null, minPerPage)}>{minPerPage}</MenuItem>
                    <MenuItem justifyContent={"center"} onClick={setItemsPerPages.bind(null, minPerPage * 2)}>{minPerPage * 2}</MenuItem>
                    <MenuItem justifyContent={"center"} onClick={setItemsPerPages.bind(null, minPerPage * 5)}>{minPerPage * 5}</MenuItem>
                    <MenuItem justifyContent={"center"} onClick={setItemsPerPages.bind(null, minPerPage * 10)}>{minPerPage * 10}</MenuItem>
                </MenuList>
            </Menu>
        </Flex>
    )
}
export default Pagination

export function usePaginationLogic({ minPerPage = 5 }) {
    //pagination
    const [cPage, setCPage] = useState(0) //indicates current page
    const [itemsPerPages, setItemsPerPages] = useState(minPerPage * 2) //indicates amount of items
    const pageFirstItemIndex = cPage * itemsPerPages;
    const pageLastItemIndex = pageFirstItemIndex + itemsPerPages;
    return {
        cPage,
        setCPage,
        minPerPage,
        itemsPerPages,
        setItemsPerPages,
        pageFirstItemIndex,
        pageLastItemIndex,
        /**
         * slices the list to contain only current page products
         * @param {[]} list 
         * @returns {[]}
         */
        sliceList: (list) => list.slice(pageFirstItemIndex, pageLastItemIndex)
    }
}