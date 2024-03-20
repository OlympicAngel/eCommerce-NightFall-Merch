export function toastSuccess(title, toast, id) {
    toast({
        id,
        description: title,
        status: 'success',
        duration: 3000,
        position: "top",
        isClosable: true,
    })
}

export function toastError(e, toast) {
    let title = e.response?.data.message || e.message,
        desc = e.response?.data.error;
    toast({
        id: "error",
        title: title,
        description: desc,
        status: 'error',
        duration: 5000,
        isClosable: true,
    })
}