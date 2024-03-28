import { useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";
import React from 'react';
import { Flex, Heading, Text, Icon, Divider, Button, Tooltip, Card, Thead, Tr, Th, Tbody, Td, Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverCloseButton, PopoverBody, PopoverHeader, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, useDisclosure, Box } from '@chakra-ui/react';
import { MdEdit, MdDelete } from 'react-icons/md';
import DynTable from "../../components/partials/DynTable";
import useMutationLogic from "../../hooks/useMutationLogic";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../../components/forms/RegisterForm";
import OrdersList from "../../components/orders/OrdersList";
import useTitle from "../../hooks/useTitle";

function Profile() {
    useTitle("פרופיל")

    const { user, setUser, setIsAuth } = useContext(AuthContext)
    const navigate = useNavigate()

    const { mutate: handleDelete } = useMutationLogic({
        urlPath: "users",
        method: "delete",
        onSuccess: () => {
            setIsAuth(false);
            navigate("/")
        }
    })

    const { onClose: closeEdit, onOpen: openEdit, isOpen } = useDisclosure()
    function onClose(data) {
        closeEdit()
        if (!data)
            return;
        const newUser = data?.data.user;
        setUser(newUser)
    }

    return (<>
        <Modal isOpen={isOpen} onClose={onClose} >
            <ModalOverlay />
            <ModalContent maxW="2xl">
                <ModalHeader><Heading>עדכון פרטים:</Heading></ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <RegisterForm onClose={onClose} />
                </ModalBody>
            </ModalContent>
        </Modal>
        <Card>
            <UserProfileHeader handleDelete={handleDelete} openEdit={openEdit} />
            <Divider mb={6} />
            <UserProfileBody user={user} />

            <Box as="section" bg={"gray"} p={["0.25em", "1em"]} borderRadius={"0.5em"} mt={"1em"}>
                <Heading>הזמנות:</Heading>
                <OrdersList />
            </Box>
        </Card>
    </>
    );
};

const UserProfileHeader = ({ handleDelete, openEdit }) => {
    return (
        <Flex alignItems="center" justifyContent="space-between" mb={4} flexWrap={"wrap"} gap={"1em"}>
            <Heading as="h1">
                פרופיל משתמש:
            </Heading>
            <Flex gap={"1em"} flex={[1, 0]} justifyContent={"space-around"}>
                <Tooltip label="ערוך פרופיל">
                    <Button leftIcon={<Icon as={MdEdit} />} onClick={() => openEdit(true)} variant="outline" flex="1">
                        ערוך
                    </Button>
                </Tooltip>
                <Popover>
                    <PopoverTrigger>
                        <Button leftIcon={<Icon as={MdDelete} />} colorScheme="red" variant="outline" flex="1">
                            מחק
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader><Heading>אימות!</Heading></PopoverHeader>

                        <PopoverBody p={4}>
                            <Text>האם אתה בטוח שברצונך למחוק משתמש זה?</Text>
                            <Button mt={4} colorScheme="red" onClick={() => handleDelete()}>
                                אשר מחיקה
                            </Button>
                        </PopoverBody>
                    </PopoverContent>
                </Popover>
            </Flex>
        </Flex>
    );
};

const UserProfileBody = ({ user }) => {
    return (
        <>
            <DynTable >
                <Thead>
                    <Tr>
                        <Th>שם</Th>
                        <Th>אימייל</Th>
                        <Th>טלפון</Th>
                        <Th>כתובת</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    <Tr>
                        <Td>{user.name}</Td>
                        <Td>{user.email}</Td>
                        <Td>{user.phone}</Td>
                        <Td>{Object.values(user.address).filter(i => i).join(", ")}</Td>
                    </Tr>
                </Tbody>
            </DynTable>
        </>
    );
};


export default Profile
