import { Box, Step, StepDescription, StepIcon, StepIndicator, StepSeparator, StepStatus, StepTitle, Stepper, useSteps } from "@chakra-ui/react"
import { AiFillClockCircle } from "react-icons/ai"
import { BsSlashLg } from "react-icons/bs"
import { MdError } from "react-icons/md"

function OrderStatus({ status, onChange = () => { } }) {
    status = status - 1;
    const steps = [
        { title: 'הזמנה חדשה', description: 'מחכה לאישור' },
        { title: 'במשלוח', description: 'ההזמנה בדרך :)' },
        { title: 'הזמנה בוצעה', description: 'משלוח הגיעה ללקוח' },
        { title: 'בוטל', description: 'ההזמנה בוטלה', icon: <MdError size={"2em"} color="red" /> },
    ]
    const { activeStep, setActiveStep } = useSteps({
        index: status,
        count: steps.length,
    })
    const isCanceled = activeStep == steps.length - 1;
    return (
        <Stepper colorScheme={isCanceled ? "red" : "green"} index={activeStep} flexWrap={"wrap"} minW={"fit-content"}>
            {steps.map((step, index) => (
                <Step key={index} onClick={() => {
                    onChange(index + 1);
                    setActiveStep(index)
                }}
                    cursor={"pointer"} _hover={{ color: "purple.500" }}
                >
                    <StepIndicator cursor={"pointer"} bg={"gray.700"} color="white">
                        <StepStatus
                            complete={isCanceled ? <BsSlashLg /> : step.icon || <StepIcon />}
                            active={step.icon || <AiFillClockCircle size={"1.5em"} />}
                        />
                    </StepIndicator>

                    <Box flexShrink='0.1' >
                        <StepTitle>{step.title}</StepTitle>
                        <StepDescription>{step.description}</StepDescription>
                    </Box>

                    <StepSeparator background="gray.500" />
                </Step>
            ))}
        </Stepper>
    )
}
export default OrderStatus