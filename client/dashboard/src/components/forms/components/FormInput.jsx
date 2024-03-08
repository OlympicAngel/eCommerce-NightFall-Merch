import { AiFillPhone } from "react-icons/ai";
import { AiOutlineFieldNumber } from "react-icons/ai";
import { AiOutlineNumber } from "react-icons/ai";
import { FaUpload } from "react-icons/fa";
import { BiCloudUpload } from "react-icons/bi";
import { MdEmail } from "react-icons/md";
import { FormControl, FormErrorMessage, FormLabel, Input, InputGroup, InputRightElement } from "@chakra-ui/react"
import FormPassword from "./FormPassword";
import { Field, useField } from "formik";
import { useState } from "react";

/**
 * @param {{ title:String, placeholder: String, name: String, isRequired: Boolean, type: "text" | "number", onChange: Function }} props 
 * @returns 
 */
function FormInput(props) {
    const { title, placeholder, isRequired = false, type = "text", name, onChange } = props;

    const isPassword = type && type.toLocaleLowerCase() == "password";
    if (isPassword)
        return <FormPassword {...props} />;

    //formik field handler - used to get values & handle validation
    const [filed, meta] = useField(props);
    const isValid = !meta.error && meta.value;
    const validColor = isValid ? "green.500" : 'red.500';
    const [gotInput, setGotInput] = useState(false)
    //if user gave input once
    if (!gotInput && meta.touched && meta.value)
        setGotInput(true)

    let icon;
    switch (type) {
        case "email":
            icon = <MdEmail />;
            break;
        case "file":
            icon = <FaUpload />
            break;
        case "tel":
            icon = <AiFillPhone />
            break;

        case "number":
            icon = <AiOutlineFieldNumber />
            break;
    }

    return <FormControl style={{ flex: props.flex }} isRequired={isRequired} mb="1.5em" isInvalid={meta.error && meta.touched && gotInput}>
        {title !== false && <FormLabel>{title || placeholder}</FormLabel>}
        <InputGroup >
            <Input focusBorderColor={isValid ? validColor : "purple.500"} as={Field} {...props} title="" pr="7" {...filed}
                onChange={(e) => { onChange && onChange(e); filed.onChange(e) }} lineHeight={"2em"} />
            <InputIcon {...{ icon, validColor }} />
        </InputGroup>
        <FormErrorMessage>
            {meta.error}{!meta.error?.endsWith(".") && "."}
        </FormErrorMessage>
    </FormControl>
}

export default FormInput

function InputIcon({ icon, validColor }) {
    return <InputRightElement color={validColor} width='fit-content' pr={2} pl={2}>
        {icon}
    </InputRightElement>
}