import { useLocation, useNavigate, useParams } from "react-router-dom";
import useQueryLogic from "../../hooks/useQueryLogic";
import { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import { toastError } from "../../utils/toast.helper";
import ProductView from "../../components/Product/ProductView";

function ProductSingle() {
  const { state } = useLocation();
  const [product, setProduct] = useState(state?.product)

  //get url product id
  const { id: urlProductID } = useParams()
  const { data: server_product, error } = useQueryLogic({
    key: "product_" + urlProductID,
    urlPath: "products/" + urlProductID,
  })

  //if we get error get back to home page
  const toast = useToast()
  const navigate = useNavigate()
  if (error) {
    const readableError = error?.response?.data?.message;
    toastError(readableError ? new Error(readableError) : error, toast)
    navigate("/")
  }

  //update product data from the server
  useEffect(() => {
    if (server_product)
      setProduct(server_product)
  }, [server_product])


  return (
    <ProductView product={product} />
  )
}
export default ProductSingle