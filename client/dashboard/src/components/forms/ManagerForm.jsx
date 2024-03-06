import { BiCaretDown } from "react-icons/bi";
import { IoMdColorPalette } from "react-icons/io";
import { Button, Container, Flex, HStack, Heading, Spacer, Text, useToast } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import FormInput from "./components/FormInput";
import * as yup from 'yup';
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { toastError, toastSuccess } from "../../utils/toast.helper";
import { AiFillCloseCircle, AiFillPlusCircle, AiOutlineEdit } from "react-icons/ai";
import FormSelect from "./components/FormSelect";
import { emailValidation, passwordValidation, passwordValidationOption } from "../../utils/yup.helper";

function ManagerForm({ manager, onClose }) {
    const loggedManager = useContext(AuthContext).manager
    const isUpdatingSelf = manager && loggedManager._id != manager._id;
    const method = manager ? "put" : "post";

    const toast = useToast()
    const { SERVER } = useContext(AuthContext)
    const queryClient = useQueryClient()
    const managerCRUD = useMutation({
        mutationFn: async (data) => axios({
            "url": `${SERVER}users/managers/${isUpdatingSelf ? manager._id : ""}`,
            method,
            "data": data,
            "withCredentials": true
        }),
        onError: (e) => toastError(e, toast),
        onSuccess: (res) => {
            toastSuccess(res.data.message, toast);
            queryClient.invalidateQueries("getManagers")
            onClose();
        }
    })
    const { isLoading } = managerCRUD;
    const formRef = useRef();
    const btnConfig = {
        "post": { c: "lime.500", t: <HStack><AiFillPlusCircle /><Text>הוסף!</Text></HStack>, tSimple: "הוסף" },
        "put": { c: "orange.300", t: <HStack><AiOutlineEdit /><Text>ערוך!</Text></HStack>, tSimple: "ערוך" }
    }

    return (
        <>
            <Heading>{btnConfig[method].tSimple} מנהל:</Heading>
            <Formik
                initialValues={{ name: manager?.name || "", email: manager?.email || "", password: "", confirmPassword: "" }}
                validationSchema={yup.object({
                    name: yup.string().required("חייב להזין שם").min(2, "שם קצר מידי"),
                    email: emailValidation,
                    password: manager ? passwordValidationOption : passwordValidation
                })}
                onSubmit={(values, actions) => { managerCRUD.mutate(values) }}>
                <Container as={Form} p="1em" ref={formRef}>
                    <FormInput placeholder={"שם פרטי"} name="name" isRequired={true} min="2" />
                    <FormInput placeholder={"אמייל"} name="email" type="email" autoComplete="email" isRequired={true} />
                    <FormInput placeholder={"סיסמה"} name="password" type="password" min="4" />

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
export default ManagerForm