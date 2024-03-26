import { RxDropdownMenu } from "react-icons/rx";
import { Box, FormControl, FormErrorMessage, FormLabel, Select, Text } from "@chakra-ui/react"
import { Field, useField } from "formik";
import { useState } from "react";

/**
 * @param {{ title:String, placeholder: String, name: String, isRequired: Boolean, type: "text" | "number", onChange: Function }} props 
 * @returns 
 */
function FormSelect(props) {
    const { title, placeholder, isRequired = false, name, icon, onChange, children, value } = props;

    //formik field handler - used to get values & handle validation
    const [filed, meta] = useField(props);
    const isValid = !meta.error && meta.value;
    const validColor = isValid ? "green.500" : 'red.500';

    const val = filed.value || "";

    return (
        <FormControl isRequired={isRequired} mb="1.5em" isInvalid={meta.error && meta.touched}>
            <FormLabel>{title || placeholder}</FormLabel>
            <Field as={Select} iconColor={validColor} {...{ icon: icon || <RxDropdownMenu /> }} focusBorderColor={isValid ? validColor : "purple.500"}
                color={val + ".500"} textAlign="center" fontWeight="700" {...props} placeholder={null} {...filed} onChange={(e) => { onChange && onChange(e); filed.onChange(e) }}
            >
                <option value={""} disabled>{placeholder}</option>
                {children}
            </Field>
            <FormErrorMessage>
                {meta.error}{!meta.error?.endsWith(".") && "."}
            </FormErrorMessage>
        </FormControl>
    )
}
export default FormSelect