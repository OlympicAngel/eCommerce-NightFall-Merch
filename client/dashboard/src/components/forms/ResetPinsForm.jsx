import { Form, Formik } from "formik";
import * as yup from "yup";
import useMutationLogic from "../../hooks/useMutationLogic";
import { passwordValidation } from "../../utils/yup.helper";
import { Button, Container, FormControl, FormErrorMessage, FormLabel, HStack, PinInput, PinInputField } from "@chakra-ui/react";
import FormInput from "./components/FormInput";
import { useState } from "react";

function ResetPinsForm({ setPage }) {
    //send req
    const { mutate, isLoading, error, isError } = useMutationLogic({
        "method": "post",
        "urlPath": "users/managers/resetpassword/verify",
        onSuccess: () => {
            setPage("login")
        }
    });

    const [otp, setOtp] = useState()

    return (
        <>
            <FormControl isRequired={true} mb="1.5em">
                <FormLabel>קוד חד פעמי</FormLabel>
                <HStack w="inherit" justify={"space-between"} flexDir={"row-reverse"}>
                    <PinInput otp size='md' onChange={setOtp} type='alphanumeric'>
                        <PinInputField />
                        <PinInputField />
                        <PinInputField />
                        <PinInputField />
                        <PinInputField />
                        <PinInputField />
                    </PinInput>
                </HStack>
            </FormControl>
            <Formik
                initialValues={{ password: "" }}
                validationSchema={yup.object({
                    password: passwordValidation,
                })}
                onSubmit={(values, actions) => {
                    mutate({ ...values, otp })
                }}>
                <Container as={Form} p="1em" >
                    <FormInput placeholder={"סיסמה חדשה"} type="password" name="password" isRequired autoComplete="email" />
                    <Button type="submit" colorScheme="green" bgColor={"green.200"} {...{ isLoading }} w="100%">
                        אפס סיסמה
                    </Button>
                    <FormControl isInvalid={isError && error && !isLoading}>
                        <FormErrorMessage>
                            {error?.response?.data?.error || error?.message}
                        </FormErrorMessage>
                    </FormControl>
                </Container>
            </Formik>
        </>
    )
}

export default ResetPinsForm