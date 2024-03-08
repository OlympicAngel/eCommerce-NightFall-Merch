import { AiOutlineCaretDown } from "react-icons/ai";
import { Button, Divider, Flex, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { useState } from "react";

function Pagination({ list, paginationLogic, colorScheme = "purple", pages }) {
    if (!paginationLogic)
        throw new Error("missing {paginationLogic} please use usePaginationLogic()")
    const {
        cPage,
        itemsPerPages,
        setItemsPerPages,
    } = paginationLogic;
    const pageCount = pages || Math.ceil(list?.length / itemsPerPages) || 0;
    const btnArr = Array(pageCount).fill(0)
    const maxBtn = 5;

    return (
        <Flex gap={"0.5em"} w={"inherit"} justifyContent={"center"} mt="1em">
            {
                btnArr.map((v, i) => {
                    if ((i <= cPage - maxBtn / 2 && i < pageCount - maxBtn) ||
                        (i >= cPage + maxBtn / 2 && i >= maxBtn))
                        return;
                    return <Button key={i}
                        variant={i == paginationLogic.cPage ? "solid" : "outline"}
                        colorScheme={colorScheme}
                        onClick={() => { paginationLogic.setCPage(i) }}>
                        {i + 1}</Button>
                })
            }
            <Divider orientation="vertical" ></Divider>
            <Menu placement="bottom">
                <MenuButton as={Button} colorScheme="purple" leftIcon={<AiOutlineCaretDown />}>
                    מציג: {itemsPerPages}
                </MenuButton>
                <MenuList minW={"5em"} >
                    <MenuItem justifyContent={"center"} onClick={setItemsPerPages.bind(null, 5)}>5</MenuItem>
                    <MenuItem justifyContent={"center"} onClick={setItemsPerPages.bind(null, 10)}>10</MenuItem>
                    <MenuItem justifyContent={"center"} onClick={setItemsPerPages.bind(null, 25)}>25</MenuItem>
                    <MenuItem justifyContent={"center"} onClick={setItemsPerPages.bind(null, 50)}>50</MenuItem>
                </MenuList>
            </Menu>
        </Flex>
    )
}
export default Pagination

export function usePaginationLogic() {
    //pagination
    const [cPage, setCPage] = useState(0) //indicates current page
    const [itemsPerPages, setItemsPerPages] = useState(10) //indicates amount of items
    const pageFirstItemIndex = cPage * itemsPerPages;
    const pageLastItemIndex = pageFirstItemIndex + itemsPerPages;
    return {
        cPage,
        setCPage,
        itemsPerPages,
        setItemsPerPages,
        pageFirstItemIndex,
        pageLastItemIndex
    }
}