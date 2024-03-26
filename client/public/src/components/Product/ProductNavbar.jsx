import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, Card, Flex, HStack, Spacer, Text, VStack } from "@chakra-ui/react"
import SearchList from "../Sorters&Filters/SearchList"
import FilterButtons from "../Sorters&Filters/FilterButtons"
import SortButtons from "../Sorters&Filters/SortButtons"
import { useContext } from "react"
import { CartContext } from "../../context/CartProvider"

function ProductNavbar({ searchLogic, products, filteredProducts, filterLogic, sortLogic }) {
    const { OpenCart, cartItems } = useContext(CartContext);

    return (
        <Card position={"sticky"} bottom="1em" zIndex={1} as={HStack} boxShadow="dark-lg" alignItems={"flex-start"} gap={"0.5em"}
            bg={"gray"} mt={"1em"} p="0.3em">
            <Accordion w={"100%"} allowToggle >
                <AccordionItem >
                    <h2>
                        <AccordionButton >
                            <HStack as="span" flex='1' textAlign='start'>
                                <AccordionIcon fontSize={"2em"} />
                                <Text>אפשרויות סינון</Text>
                                <Spacer></Spacer>
                                <Button as={Box} variant={"solid"} colorScheme="blue" isDisabled={cartItems.length == 0}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (cartItems.length == 0)
                                            return;
                                        OpenCart()
                                    }} >עבור לסל
                                </Button>
                            </HStack>
                        </AccordionButton>
                    </h2>
                    <AccordionPanel py="0">
                        <SearchList searchLogic={searchLogic} list={products} filteredList={filteredProducts} placeholder="חיפוש לפי שם מוצר, קטגוריה, מחיר, ועוד.." />

                        <Flex flexWrap="wrap" w={"100%"} m="0 !important" mt={"1em !important"} gap={["0", "2em"]} justifyContent={"space-between"} flexDir={["column", "row"]}>
                            <FilterButtons filterLogic={filterLogic} />
                            <SortButtons sortLogic={sortLogic} />
                        </Flex>
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>
        </Card>
    )
}
export default ProductNavbar