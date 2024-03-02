import { Button, Container, FormControl, FormErrorMessage, } from "@chakra-ui/react";
import FormInput from "./components/FormInput";
import { Field, Form, Formik } from 'formik';
import * as yup from "yup";
import useLogin from "../../hooks/useLogin";
import { emailValidation, passwordValidation } from "../../utils/yup.helper";


function LoginForm() {
    const { mutate, isLoading, error, isError } = useLogin()

    return (
        <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={yup.object({
                email: emailValidation,
                password: passwordValidation
            })}
            onSubmit={(values, actions) => {
                mutate(values)
                actions.resetForm({ values: { password: "", "email": values.email } });
            }}>
            <Container as={Form} p="1em" >
                <FormInput placeholder={"אמייל"} type="email" name="email" isRequired autoComplete="email" />
                <FormInput placeholder={"סיסמה"} name="password" type="password" isRequired minLength="4" maxLength="32" />
                <Button type="submit" colorScheme="green" bgColor={"green.200"} {...{ isLoading }} w="100%">
                    התחבר
                </Button>
                <FormControl isInvalid={isError && error && !isLoading}>
                    <FormErrorMessage>{error?.response?.data?.error || error?.message}</FormErrorMessage>
                </FormControl>
            </Container>

        </Formik>
    )
}
export default LoginForm