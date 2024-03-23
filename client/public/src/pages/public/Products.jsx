import { Box, Grid, Skeleton } from "@chakra-ui/react";
import useQueryLogic from "../../hooks/useQueryLogic";
import useTitle from "../../hooks/useTitle";
import ProductCard from "../../components/Product/ProductCard";
import ErrorView from "../../components/partials/ErrorView";


function Products() {
  useTitle("ראשי")

  const { data: products, error, isLoading } = useQueryLogic({
    key: "products",
    urlPath: "products",
  })

  //TODO: pagination? sorts
  return (<>

    <Grid className="grid">
      {(products || Array(6).fill(undefined))?.map(p => <ProductCard key={p?._id || Math.random()} product={p} />)}
    </Grid>
    <ErrorView error={error} />
  </>
  )
}

export default Products