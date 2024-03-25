import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Card, Flex, Grid, HStack, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverTrigger, Skeleton, Spacer, Text, useDisclosure } from "@chakra-ui/react";
import useQueryLogic from "../../hooks/useQueryLogic";
import useTitle from "../../hooks/useTitle";
import ProductCard from "../../components/Product/ProductCard";
import ErrorView from "../../components/partials/ErrorView";
import { Product } from "../../utils/types";
import RelatedProducts from "../../components/Product/RelatedProducts";
import { useState } from "react";
import SearchList, { useSearchLogic } from "../../components/Sorters&Filters/SearchList";
import Pagination, { usePaginationLogic } from "../../components/Sorters&Filters/Pagination";
import FilterButtons, { FilterBtn } from "../../components/Sorters&Filters/FilterButtons";
import SortButtons, { SortBtn } from "../../components/Sorters&Filters/SortButtons";


function Products() {
  useTitle("ראשי")

  //get all products
  /** @type {{data: Product[]}} */
  const { data: products, error, isLoading } = useQueryLogic({
    key: "products",
    urlPath: "products",
  })
  const displayedCategories = Array.from(new Map(products?.map(p => [p.category._id, p.category]).values())).map(i => i[1])


  /** @type {Product}  handles when a products gets into cart - show related*/
  const [relatedToProduct, setRelatedToProduct] = useState()

  const searchLogic = useSearchLogic({})//search
  const paginationLogic = usePaginationLogic({ minPerPage: 4 });//pagination
  const filterLogic = FilterBtn.useFilterBtnLogic(genFilterBtns(displayedCategories))//category filter
  const sortLogic = SortBtn.useSortLogic(genSortBtns())

  const filteredProducts = (products || Array(6).fill(undefined))
    .filter(searchLogic.filterFn)
    .filter(filterLogic.filterFn)
    .sort(sortLogic.sortFn);
  const displayProducts = paginationLogic.sliceList(filteredProducts);

  //TODO: pagination? sorts

  //TODO: handle pop over?
  return (<>
    <Pagination {...{ list: filteredProducts, paginationLogic, colorScheme: "gray" }} />

    <Grid className="grid">
      {(displayProducts || Array(6).fill(undefined))?.map((p, i) => {
        return <ProductCard key={p?._id || Math.random()} product={p} onAddToCart={setRelatedToProduct}>
          {relatedToProduct == p &&
            <RelatedProducts product={relatedToProduct} bg="gray" boxShadow="inset -100vmax 0 rgba(0,0,0,0.15)" />
          }
        </ProductCard>
      })}
    </Grid>
    {displayProducts.length == 0 &&
      <Box><ErrorView error={new Error("אין תוצאות עבור חיפוש זה")} /></Box>
    }
    <ErrorView error={error} />

    <Card position={"sticky"} bottom="1em" zIndex={1} as={HStack} boxShadow="dark-lg" alignItems={"flex-start"} gap={"0.5em"}
      bg={"gray"} mt={"1em"} p="0.3em">
      <Accordion w={"100%"} allowToggle >
        <AccordionItem >
          <h2>
            <AccordionButton >
              <AccordionIcon />
              <Box as="span" flex='1' textAlign='start'>
                אפשרויות סינון
              </Box>

            </AccordionButton>
          </h2>
          <AccordionPanel>
            <SearchList searchLogic={searchLogic} list={products} filteredList={filteredProducts} placeholder="חיפוש לפי שם מוצר, קטגוריה, מחיר, ועוד.." />

            <Flex flexWrap="wrap" w={"100%"} m="0 !important" mt={"1em !important"} gap={["0", "2em"]} justifyContent={"space-between"} flexDir={["column", "row"]}>
              <FilterButtons filterLogic={filterLogic} />
              <SortButtons sortLogic={sortLogic} />
            </Flex>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Card>
  </>
  )
}


function genFilterBtns(categories = []) {
  const btns = [new FilterBtn("הכל", () => true, "gray")];
  categories.forEach(c =>
    btns.push(new FilterBtn(c.name, (p) => p.category._id == c._id, c.color)))
  return btns
}

function genSortBtns() {
  return [
    new SortBtn("חדש", (a, b) => true),
    new SortBtn("קטגוריה", (a, b) => a.category._id > b.category._id ? 1 : -1),
    new SortBtn("מחיר", (a, b) => a.price > b.price ? 1 : -1),
    new SortBtn("קטגוריה", (a, b) => a.name > b.name ? 1 : -1),
  ]
}

export default Products