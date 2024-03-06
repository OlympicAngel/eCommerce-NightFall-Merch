export function toastSuccess(title, toast) {
    toast({
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
        title: title,
        description: desc,
        status: 'error',
        duration: 10000,
        isClosable: true,
    })
}