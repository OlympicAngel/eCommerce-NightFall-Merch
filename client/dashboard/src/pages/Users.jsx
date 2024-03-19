import { BsPersonFillGear } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import { Card, Tab, TabList, TabPanel, TabPanels, Tabs, useColorModeValue } from "@chakra-ui/react";
import NormalUsers from "../components/users/normal/NormalUsers";
import Managers from "../components/users/managers/Managers";
import { useState } from "react";

function Users() {
    const colors = useColorModeValue(
        ['teal.100', 'gray.200', "teal.50", "red.50"],
        ['teal.700', 'gray.800', "teal.900", "red.900"]
    )
    const [tabIndex, setTabIndex] = useState(0);
    return (
        <Card w="100%" p={["0.5em", "1em"]} boxShadow="2xl">
            <Tabs isLazy lazyBehavior="unmount" isFitted variant='line' colorScheme="black"
                borderRadius={"0.5em"} onChange={(index) => setTabIndex(index)} >
                <TabList>
                    <Tab borderRadius={"1em 1em 0 0"} bg={colors[tabIndex]} fontSize={"1.5em"}><FaUsers /> משתמשים</Tab>
                    <Tab borderRadius={"1em 1em 0 0"} bg={colors[1 + tabIndex * 2]} fontSize={"1.5em"}><BsPersonFillGear /> מנהלים</Tab>
                </TabList>
                <TabPanels bg={colors[2 + tabIndex]} borderRadius={"0 0 1em 1em"}>
                    <TabPanel p={[1, "1em"]}>
                        <NormalUsers />
                    </TabPanel>
                    <TabPanel p={[1, "1em"]}>
                        <Managers />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Card>
    )
}
export default Users