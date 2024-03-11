import { AiFillCloseCircle } from "react-icons/ai";
import { Flex, Button, Container, Spacer, Text, HStack, Image, FormLabel, Textarea } from "@chakra-ui/react";
import FormInput from "./components/FormInput";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { Form, Formik } from "formik";
import * as yup from "yup";
import FormSelect from "./components/FormSelect";
import useQueryLogic from "../../hooks/useQueryLogic";
import useMutationLogic from "../../hooks/useMutationLogic";


function ProductForm({ product = {}, method = "post", closeDialog, btnText = "הוסף" }) {
    const { SERVER } = useContext(AuthContext)
    const formRef = useRef()
    const [image, setImage] = useState(product.image);
    const buttonColorConfig = { post: "green.200", put: "orange.300" }
    const allCategories = useQueryLogic({ "key": "categories", "urlPath": "categories" });

    //send request & data handlers
    const mutation = useMutationLogic({
        "relatedQuery": "products",
        "urlPath": `products${method == "put" ? `/${product._id}` : ""}`,
        onSuccess: () => {
            closeDialog && closeDialog();
        },
        method
    })
    //const formData = new FormData(formRef.current);
    const isLoading = mutation.isLoading;

    function updateImageView(e) {
        const input = e.target;
        var reader = new FileReader();
        reader.onload = function (e) {
            setImage(e.target.result)
        }
        if (input.files[0])
            reader.readAsDataURL(input.files[0]);
        else
            setImage()
    }

    return (
        <Formik
            initialValues={{ name: product.name || "", price: product.price || "", description: product.description || "", category: product.category?._id || "", image: image || "" }}
            validationSchema={yup.object({
                name: yup.string().required("חייב להזין שם").min(2, "שם קצר מידי"),
                price: yup.number().required("חייב להזין מחיר כלשהו").min(0, "מחיר לא יכול להיות שלילי"),
                category: yup.string().required("חייב לבחור קטגוריה")
            })}
            onSubmit={(values, actions) => { mutation.mutate(values); }}>
            <Container as={Form} p="1em" ref={formRef}>
                <Flex gap="1em">
                    <FormInput placeholder={"שם"} name="name" isRequired={true} min="1" />
                    <FormInput placeholder={"מחיר"} type="number" name="price" isRequired={true} />
                </Flex>
                <FormInput placeholder={"תיאור"} as={Textarea} name="description" />
                <FormSelect placeholder={"קטגוריה"} name="category" isRequired={true} >
                    {allCategories?.data?.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                </FormSelect>
                <FormInput id="imageInput" display={image ? "none" : "block"} onChange={updateImageView}
                    placeholder={"תמונה"} type="file" name="image" accept=".png, .jpeg, .jpg" value="" />
                {image &&
                    <FormLabel mt={-4} htmlFor="imageInput" cursor={"pointer"} textAlign="center" color="gray.400">
                        <Image src={image} />
                        <Text fontSize={"small"}>לחץ לשינוי</Text>
                    </FormLabel>}

                <Flex w={"100%"} mt={"16"}>
                    <Button disabled={isLoading} onClick={() => { closeDialog() }} >
                        <HStack><AiFillCloseCircle /><Text>ביטול</Text></HStack>
                    </Button>
                    <Spacer></Spacer>
                    <Button type="submit" colorScheme="green" bgColor={buttonColorConfig[method]} {...{ isLoading }}>
                        {btnText}
                    </Button>
                </Flex>

            </Container>
        </Formik>
    )
}
export default ProductForm