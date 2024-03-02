import { Button, Container, Flex, HStack, Heading, Spacer, Text, useToast } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import FormInput from "./components/FormInput";
import * as yup from 'yup';
import { QueryClient, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { useContext, useRef } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { toastError, toastSuccess } from "../../utils/toast.helper";
import { AiFillCloseCircle, AiFillPlusCircle, AiOutlineEdit } from "react-icons/ai";

function CategoryForm({ category, onClose, onSuccess }) {
    const method = category ? "put" : "post";

    const toast = useToast()
    const { SERVER } = useContext(AuthContext)
    const queryClient = useQueryClient()
    const categoryCRUD = useMutation({
        mutationFn: async (data) => axios({
            "url": `${SERVER}categories/${category ? category._id : ""}`,
            method,
            "data": data,
            "withCredentials": true
        }),
        onError: (e) => toastError(e, toast),
        onSuccess: (res) => {
            toastSuccess(res.data.message, toast);
            queryClient.invalidateQueries("getCategories")
            onClose();
        }
    })
    const { isLoading } = categoryCRUD;

    const formRef = useRef();
    const btnConfig = {
        "post": { c: "lime.500", t: <HStack><AiFillPlusCircle /><Text>הוסף!</Text></HStack>, tSimple: "הוסף" },
        "put": { c: "orange.300", t: <HStack><AiOutlineEdit /><Text>ערוך!</Text></HStack>, tSimple: "ערוך" }
    }

    return (
        <>
            <Heading>
                {btnConfig[method].tSimple} קטגוריה:
            </Heading>
            <Formik
                initialValues={{ name: category?.name || "" }}
                validationSchema={yup.object({ name: yup.string().required("חייב להזין שם").min(2, "שם קצר מידי"), })}
                onSubmit={(values, actions) => { categoryCRUD.mutate(values) }}>
                <Container as={Form} p="1em" ref={formRef}>

                    <FormInput placeholder={"שם הקטגוריה"} name="name" isRequired={true} min="2" />
                    <Flex w={"100%"} mt={"5"}>
                        {onClose && <Button disabled={isLoading} onClick={() => { onClose() }} >
                            <HStack><AiFillCloseCircle /><Text>ביטול</Text></HStack>
                        </Button>}

                        <Spacer></Spacer>
                        <Button type="submit" colorScheme="green" bgColor={btnConfig[method].c} {...{ isLoading }}>
                            {btnConfig[method].t}
                        </Button>
                    </Flex>

                </Container>
            </Formik>
        </>
    )
}
export default CategoryForm