import { Box, Step, StepDescription, StepIcon, StepIndicator, StepSeparator, StepStatus, StepTitle, Stepper, useSteps } from "@chakra-ui/react"
import { AiFillClockCircle } from "react-icons/ai"
import { BsSlashLg } from "react-icons/bs"
import { MdError } from "react-icons/md"

/**
 * 
 * @param {{status:Number, onChange:Function}} param0 
 * @returns 
 */
function OrderStatus({ status, onChange }) {
    status = status - 1;
    const steps = orderStatusSteps

    const { activeStep, setActiveStep } = useSteps({
        index: status,
        count: steps.length,
    })
    const isCanceled = activeStep == steps.length - 1;
    return (
        <Stepper colorScheme={isCanceled ? "red" : "green"} index={activeStep} flexWrap={"wrap"} minW={"fit-content"}>
            {steps.map((step, index) => {
                //if user view = hide all other steps
                if (!onChange && index > activeStep)
                    return;

                return <Step key={index} onClick={() => {
                    onChange && onChange(index + 1);
                    setActiveStep(index)
                }}
                    cursor={"pointer"} _hover={onChange ? { color: "purple.500", opacity: 1 } : {}} transition={"0.25s"}
                    opacity={activeStep > index ? 0.3 : 1}
                    pointerEvents={!onChange && "none"}
                >
                    <StepIndicator cursor={"pointer"} bg={"gray.700"} color="white">
                        <StepStatus
                            complete={isCanceled ? <BsSlashLg /> : step.icon || <StepIcon />}
                            active={step.icon || <AiFillClockCircle size={"1.5em"} />}
                        />
                    </StepIndicator>

                    <Box flexShrink='0.1'>
                        <StepTitle>{step.title}</StepTitle>
                        <StepDescription>{step.description}</StepDescription>
                    </Box>

                    <StepSeparator background="gray.500" />
                </Step>
            }
            )}
        </Stepper>
    )
}
export default OrderStatus

export const orderStatusSteps = [
    { title: 'הזמנה זמנית', description: 'מחכה לתשלום', color: "gray" },
    { title: 'הזמנה חדשה', description: 'מחכה לאישור', color: "orange" },
    { title: 'הזמנה במשלוח', description: 'ההזמנה בדרך :)', color: "blue" },
    { title: ' בוצעה', description: 'משלוח הגיעה ללקוח', color: "green" },
    { title: 'הזמנה בוטלה', description: 'ההזמנה בוטלה ולא תישלח', icon: <MdError size={"2em"} color="red" />, color: "red" },
]