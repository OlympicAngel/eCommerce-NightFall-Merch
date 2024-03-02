import { Button, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, Spacer, Flex } from "@chakra-ui/react"

function Dialog({ children, isOpen, onOpen, onClose, animation = "scale", config }) {
    if (isOpen == undefined || !onOpen || !onClose)
        throw "Missing useDisclosure, please use: `const { isOpen, onOpen, onClose } = useDisclosure()`";
    if (!config)
        throw `Missing config:{ hasForm: false, header: "", cancel: "ביטול", action: "אישור", confirmColor: "green.200", onConfirm: null, isLoading: false }`

    config = Object.assign({ hasForm: false, header: "", cancel: "ביטול", action: "אישור", confirmColor: "green.200", onConfirm: null, isLoading: false }, config)

    config.onClose = onClose;

    return <AlertDialog
        isOpen={isOpen}
        onClose={onClose}
        motionPreset={animation}
        isCentered
    >
        <DialogContent  {...config} >{children}</DialogContent>
    </AlertDialog>

}

function DialogContent({ children, w, hasForm, header, cancel = "ביטול", action = "אישור", onConfirm, confirmColor = "green.200", onClose, isLoading = false }) {
    return <AlertDialogOverlay >
        <AlertDialogContent minWidth={w} >
            {header &&
                <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                    {header}
                </AlertDialogHeader>
            }

            <AlertDialogBody>
                {children}
            </AlertDialogBody>

            {
                !hasForm && <AlertDialogFooter>
                    <Flex w="100%">
                        {cancel && <Button onClick={onClose}>{cancel}</Button>}

                        <Spacer></Spacer>
                        <Button isLoading={isLoading} colorScheme="green" bgColor={confirmColor} onClick={async () => {
                            const keepOpen = onConfirm && await onConfirm();
                            if (!keepOpen)
                                onClose();

                        }}>
                            {action}
                        </Button>
                    </Flex>
                </AlertDialogFooter>
            }
        </AlertDialogContent>
    </AlertDialogOverlay>
}
export default Dialog