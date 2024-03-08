import { BiCaretDown } from "react-icons/bi";
import { IoMdColorPalette } from "react-icons/io";
import { Button, Container, Flex, HStack, Heading, Spacer, Text, useToast } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import FormInput from "./components/FormInput";
import * as yup from 'yup';
import { useRef } from "react";
import { AiFillCloseCircle, AiFillPlusCircle, AiOutlineEdit } from "react-icons/ai";
import FormSelect from "./components/FormSelect";
import useMutationLogic from "../../hooks/useMutationLogic";

function CategoryForm({ category, onClose }) {
    const method = category ? "put" : "post";

    const categoryCRUD = useMutationLogic({
        urlPath: `categories/${category ? category._id : ""}`,
        relatedQuery: "categories",
        onSuccess: onClose,
        method,
    })
    const { isLoading } = categoryCRUD;

    const formRef = useRef();
    const btnConfig = {
        "post": { c: "lime.500", t: <HStack><AiFillPlusCircle /><Text>הוסף!</Text></HStack>, tSimple: "הוסף" },
        "put": { c: "orange.300", t: <HStack><AiOutlineEdit /><Text>ערוך!</Text></HStack>, tSimple: "ערוך" }
    }

    return (
        <>
            <Heading>{btnConfig[method].tSimple} קטגוריה:</Heading>
            <Formik
                initialValues={{ name: category?.name || "", color: category?.color || "" }}
                validationSchema={yup.object({ name: yup.string().required("חייב להזין שם").min(2, "שם קצר מידי"), })}
                onSubmit={(values, actions) => { categoryCRUD.mutate(values) }}>
                <Container as={Form} p="1em" ref={formRef}>
                    <FormInput placeholder={"שם הקטגוריה"} name="name" isRequired={true} min="2" />
                    <FormSelect title="צבע הקטגוריה" placeholder={"בחר צבע"} icon={<><IoMdColorPalette /><BiCaretDown /></>} name="color" isRequired={true} min="2">
                        <Text as={"option"} value="red" color={"red.500"}>אדום</Text>
                        <Text as={"option"} value="orange" color={"orange.500"}>כתום</Text>
                        <Text as={"option"} value="yellow" color={"yellow.500"}>צהוב</Text>
                        <Text as={"option"} value="green" color={"green.500"}>ירוק</Text>
                        <Text as={"option"} value="teal" color={"teal.500"}>ירקרק</Text>
                        <Text as={"option"} value="blue" color={"blue.500"}>כחול</Text>
                        <Text as={"option"} value="cyan" color={"cyan.500"}>תכלת</Text>
                        <Text as={"option"} value="purple" color={"purple.500"}>סגול</Text>
                        <Text as={"option"} value="pink" color={"pink.500"}>ורוד</Text>
                    </FormSelect>
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