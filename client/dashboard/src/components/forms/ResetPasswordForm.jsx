import { Form, Formik } from "formik"
import * as yup from "yup";
import useMutationLogic from "../../hooks/useMutationLogic";
import { emailValidation } from "../../utils/yup.helper";
import { Button, Container, Flex, FormControl, FormErrorMessage, Text } from "@chakra-ui/react";
import FormInput from "./components/FormInput";
import { useEffect, useState } from "react";
import Loader from "../partial/Loader";

function ResetPasswordForm({ setEmail, setPage, email }) {
    const [timeLeft, setTimeLeft] = useState(0);

    //send req
    const { mutate, isLoading, error, isError } = useResetPassword((res) => {
        setEmail && setEmail(res.data.email);
        setTimeLeft(60 * 5);
        setPage("pins")
    })

    //listen when the server has error with the time left
    useEffect(() => {
        const serverTime = error?.response?.data?.timeLeft;
        if (serverTime)
            setTimeLeft(~~serverTime)
    }, [error])

    const [timer, setTimer] = useState();
    //update time left as a clock each second
    useEffect(() => {
        if (timeLeft > 0) {
            clearTimeout(timer);
            setTimer(setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000))
        }
        if (timeLeft <= 0) {
            setEmail && setEmail(); //reset email - allow user to send a new code
            clearTimeout(timer);
        }
    }, [timeLeft])

    return (
        <Formik
            initialValues={{ email: "" }}
            validationSchema={yup.object({
                email: emailValidation,
            })}
            onSubmit={(values, actions) => {
                mutate(values)
                actions.resetForm({ values: { "email": values.email } });
            }}>
            <Container as={Form} p="1em" >
                <FormInput placeholder={"אמייל לאיפוס"} type="email" name="email" isRequired autoComplete="email" />
                <Button type="submit" colorScheme="purple" bgColor={"purple.200"} {...{ isLoading }} w="100%" isDisabled={email || timeLeft}>
                    אפס סיסמה
                </Button>
                <FormControl isInvalid={isError && error && !isLoading || email}>
                    <FormErrorMessage>
                        {error?.response?.data?.error || error?.message}
                    </FormErrorMessage>
                    {timeLeft > 0 &&
                        <FormErrorMessage>
                            <Flex gap={"2em"}>
                                <Loader size={"sm"} />
                                <Text>
                                    ניתן יהיה לשלוח קוד חדש בעוד {timeLeft} שניות.
                                </Text>
                            </Flex>
                        </FormErrorMessage>
                    }
                </FormControl>
            </Container>
        </Formik>
    )
}

export function useResetPassword(onSuccess) {
    return useMutationLogic({
        "method": "post",
        "urlPath": "users/managers/resetpassword",
        onSuccess
    });
}
export default ResetPasswordForm