import { Box, Grid, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverTrigger, Skeleton, Text, useDisclosure } from "@chakra-ui/react";
import useQueryLogic from "../../hooks/useQueryLogic";
import useTitle from "../../hooks/useTitle";
import ProductCard from "../../components/Product/ProductCard";
import ErrorView from "../../components/partials/ErrorView";
import { Product } from "../../utils/types";
import RelatedProducts from "../../components/Product/RelatedProducts";
import { useState } from "react";


function Products() {
  useTitle("ראשי")

  const { data: products, error, isLoading } = useQueryLogic({
    key: "products",
    urlPath: "products",
  })

  /** @type {Product} */
  const [relatedToProduct, setRelatedToProduct] = useState()


  //TODO: pagination? sorts

  //TODO: handle pop over?
  return (<>

    <Grid className="grid">
      {(products || Array(6).fill(undefined))?.map((p, i) => {
        return <ProductCard key={p?._id || Math.random()} product={p} onAddToCart={setRelatedToProduct}>
          {relatedToProduct == p &&
            <RelatedProducts product={relatedToProduct} />
          }
        </ProductCard>
      })}
    </Grid>
    <ErrorView error={error} />
  </>
  )
}

export default Products