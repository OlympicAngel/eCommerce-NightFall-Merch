export function toastSuccess(title, toast) {
    toast({
        id: "created",
        description: title,
        status: 'success',
        duration: 7000,
        isClosable: true,
    })
}

export function toastError(e, toast) {
    let title = e.response.data.message || e.message,
        desc = e.response.data.error;
    toast({
        id: "error",
        title: title,
        description: desc,
        status: 'error',
        duration: 10000,
        isClosable: true,
    })
}