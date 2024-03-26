import { RiLockPasswordFill } from "react-icons/ri";
import { Button, FormControl, FormErrorMessage, FormLabel, Input, InputGroup, InputLeftElement, InputRightElement } from "@chakra-ui/react"
import { Field, useField } from "formik"
import { useState } from "react"

function FormPassword(props) {
    //formik field handler - used to get values & handle validation
    const [filed, meta] = useField(props);
    const isValid = !meta.error && meta.value;
    const validColor = isValid ? "green.500" : 'red.500';


    //handle show / hide password
    const [timeouter, setTimouter] = useState() //save interval id to later reset
    const [show, setShow] = useState(false)
    const handleClick = () => {
        setShow(!show) //toggle view
        if (!show) { //if changed to visible
            clearTimeout(timeouter)
            //set timeout to reset view back into password
            const id = setTimeout(() => {
                setShow(false)
            }, 5000)
            setTimouter(id)
        }
    }

    const { title, placeholder, isRequired = false } = props;

    return (
        <FormControl isRequired={isRequired} mb="1.5em" isInvalid={meta.error && meta.touched}>
            <FormLabel>{title || placeholder}</FormLabel>
            <InputGroup size='md'>
                <Input
                    focusBorderColor={validColor}
                    pl='4.5rem'
                    pr="7"
                    placeholder='Enter password'
                    maxLength={32}
                    minLength={4}
                    autoComplete="current-password"
                    as={Field}
                    {...props}
                    {...filed}
                    type={show ? 'text' : 'password'}
                />
                <InputLeftElement width='fit-content' color={validColor} pr={2} pl={2}>
                    <RiLockPasswordFill />
                </InputLeftElement>
                <InputRightElement width='fit-content' pe={1}>
                    <Button h='70%' fontSize={"1em"} letterSpacing={"0.1em"} p={"0.5em"} onClick={handleClick} variant={"ghost"} colorScheme="gray">
                        {show ? 'הסתר' : 'הצג'}
                    </Button>
                </InputRightElement>
            </InputGroup>
            <FormErrorMessage>
                {meta.error}{!meta.error?.endsWith(".") && "."}
            </FormErrorMessage>
        </FormControl>
    )
}
export default FormPassword