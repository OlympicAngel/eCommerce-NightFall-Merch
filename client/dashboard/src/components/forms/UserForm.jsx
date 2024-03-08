import { Button, Container, Divider, Flex, FormLabel, HStack, Heading, Spacer, Text } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import FormInput from "./components/FormInput";
import * as yup from 'yup';
import { useRef } from "react";
import { AiFillCloseCircle, AiFillPlusCircle, AiOutlineEdit } from "react-icons/ai";
import { emailValidation, passwordValidation, passwordValidationOption } from "../../utils/yup.helper";
import useMutationLogic from "../../hooks/useMutationLogic";

function UserForm({ user, onClose }) {
    const method = user ? "put" : "post";

    const userCRUD = useMutationLogic({
        "urlPath": `users/${user ? "manage/" + user._id : ""}`,
        "relatedQuery": "users",
        onSuccess: () => { onClose() },
        method
    })
    const { isLoading } = userCRUD;

    const formRef = useRef();
    const btnConfig = {
        "post": { c: "lime.500", t: <HStack><AiFillPlusCircle /><Text>הוסף!</Text></HStack>, tSimple: "הוסף" },
        "put": { c: "orange.300", t: <HStack><AiOutlineEdit /><Text>ערוך!</Text></HStack>, tSimple: "ערוך" }
    }

    return (
        <>
            <Heading>{btnConfig[method].tSimple} משתמש:</Heading>
            <Formik
                initialValues={{
                    name: user?.name || "",
                    email: user?.email || "",
                    password: "",
                    phone: user?.phone || "",
                    city: user?.address?.city || "",
                    street: user?.address?.street || "",
                    building: user?.address?.building || ""
                }}
                validationSchema={yup.object({
                    name: yup.string().required("חייב להזין שם").min(2, "שם קצר מידי"),
                    email: emailValidation,
                    password: user ? passwordValidationOption : passwordValidation
                })}
                onSubmit={(values, actions) => {
                    values.address = {
                        city: values.city + "",
                        building: values.building + "",
                        street: values.street + ""
                    }
                    userCRUD.mutate(values)
                }}>
                <Container as={Form} p="1em" ref={formRef}>
                    <FormInput placeholder={"שם פרטי"} name="name" isRequired={true} min="2" />
                    <FormInput placeholder={"אמייל"} name="email" type="email" autoComplete="email" isRequired={true} />
                    <FormInput placeholder={"סיסמה"} name="password" type="password" min="4" isRequired={!user} autoComplete="password" />
                    <FormInput placeholder="טלפון" name="phone" type="tel" autoComplete="tel" />
                    <FormLabel>כתובת</FormLabel>
                    <Flex flexDirection={"row"} gap={"0.5em"} w={"100%"}>
                        <FormInput placeholder="עיר" title={false} flex="1" name="city" autoComplete="shipping address-line 2" isRequired={true} />
                        <FormInput placeholder="שכונה" title={false} flex="1" name="street" autoComplete="shipping address-line 1" isRequired={true} />
                        <FormInput placeholder="מס דירה" title={false} flex="0 0 7em" name="building" type="number" autoComplete="shipping address-level5" />
                    </Flex>

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
export default UserForm