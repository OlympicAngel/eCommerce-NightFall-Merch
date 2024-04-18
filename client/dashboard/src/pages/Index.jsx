import { HiUsers } from "react-icons/hi";
import { FaTimes } from "react-icons/fa";
import { FaShekelSign } from "react-icons/fa";
import { Box, Card, Divider, Flex, HStack, Heading, Stat, StatArrow, StatHelpText, StatLabel, StatNumber, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, VStack, useColorModeValue } from "@chakra-ui/react";
import useFirebaseDB from "../hooks/useFirebaseDB";
import useTitle from "../hooks/useTitle";
import { VictoryPie, VictoryLabel, VictoryChart, VictoryArea } from 'victory';
import Loader from "../components/partial/Loader";
import DynTable from "../components/partial/DynTable";


function Index() {
    useTitle("ראשי")
    const data = useFirebaseDB();

    const activePages = data.activePages && Object.keys(data.activePages).map((key, index) => (
        {
            x: index,
            y: data.activePages[key],
            label: ~~data.activePages[key] + " - " + key
        }))

    return (
        <>
            <Heading>סטטיסטיקה בזמן אמת:</Heading>
            <Flex flexDirection="row" w={"100%"} gap={"1em"} wrap={"wrap"} padding={"1em"} maxW={"1200px"}>
                <StatSection text={"איפה המשתמשים:"} waitFor={activePages} bg="purple.500">
                    <svg viewBox="0 0 400 400">
                        <VictoryPie
                            colorScale="blue"
                            cornerRadius={5}
                            standalone={false}
                            width={400} height={350}
                            data={activePages}
                            labelIndicator="true"
                            labelIndicatorOuterOffset={5}
                            padAngle="0.04"
                            startAngle={30}
                            endAngle={360 + 30}
                            innerRadius={50} labelRadius={180}
                            style={{ labels: { fontSize: 20, fill: "inherit", fontFamily: "inherit", fontWeight: "700" } }}
                        />
                        <VictoryLabel
                            textAnchor="middle"
                            style={{ fontSize: 17, fill: "inherit", fontFamily: "inherit" }}
                            x={400 / 2} y={350 / 2}
                            text="דפים פעילים"
                        />
                    </svg>
                    {data.activePages && Object.keys(data.activeUsers).length > 1 &&
                        <TableContainer w={"-webkit-fill-available"} mx={"1em"}>
                            <Table size={["xs", "sm"]}>
                                <Thead>
                                    <Tr>
                                        <Th>משתמשים</Th>
                                        <Th >כתובת</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {
                                        Object.keys(data.activePages)
                                            .map(key => { return { url: key, users: data.activePages[key] } })
                                            .sort((a, b) => a.users < b.users ? 1 : -1)
                                            .map(entry => <Tr key={entry.url}>
                                                <Td>{entry.users?.toLocaleString()}</Td>
                                                <Td dir="ltr">{decodeURI(entry.url)}</Td>
                                            </Tr>)
                                    }

                                </Tbody>
                            </Table>
                        </TableContainer>
                    }
                </StatSection>

                <StatSection text={"משתמשים מחוברים:"} waitFor={data.activeUsers != undefined} bg="blue.200">
                    <StockStatView arrayData={data.activeUsers} text={"משתמשים:"} sign={<HiUsers />} />
                    <VictoryChart
                        width={400}
                        height={400}
                        animate={{
                            duration: 500,
                            onLoad: { duration: 1000 }
                        }}
                    >
                        <VictoryArea
                            interpolation="natural"
                            labels={({ datum }) => datum.y}
                            data={data.activeUsers}
                            style={{ data: { fill: 'mediumpurple', stroke: 'purple', strokeWidth: 5 } }}
                        />
                    </VictoryChart>
                </StatSection>

                <StatSection text={"סל קניות משותף:"} waitFor={data.totalCartsWorth || data.totalCartsItems} bg="blue.200">
                    <Flex justifyContent={"stretch"} p={"0 1em"} gap={"1em"} w="100%">
                        <StockStatView arrayData={data.totalCartsWorth} text={"שווי: (שקל)"} sign={<FaShekelSign size={"0.5em"} />} />
                        <StockStatView arrayData={data.totalCartsItems} text={"סך פריטים:"} sign={<FaTimes size={"0.5em"} />} />
                    </Flex>
                    <VictoryChart
                        width={400}
                        height={400}
                        animate={{
                            onLoad: { duration: 1000 }
                        }}
                    >
                        <VictoryArea
                            labels={({ index, datum }) => (index > data.totalCartsWorth.length - 5 && index % 3 == 0 || index == 0) && (datum.y + "שח") || ""}
                            data={data.totalCartsWorth}
                            style={{ data: { fill: 'indianred', stroke: 'tomato', strokeWidth: 2 } }}
                        />
                        <VictoryArea
                            labels={({ index, datum }) => (index > data.totalCartsWorth.length - 5 && index % 3 == 0 || index == 0) && (datum.y + "x") || ""}
                            data={data.totalCartsItems}
                            style={{ data: { fill: 'lightgreen', stroke: 'green', strokeWidth: 5 } }}
                        />
                    </VictoryChart>
                </StatSection>
            </Flex>
        </>
    )
}
export default Index


function StatSection({ children, text, bg, waitFor }) {
    const color = useColorModeValue("black", "white")

    return <VStack alignItems={"stretch"} flex="1" fill={color} bg={bg} position={"relative"} borderRadius={"xl"} minW={"300px"} overflow={"hidden"}>
        <Heading fontSize={25} textAlign={"center"} bg={"blackAlpha.500"} mb={"1em"}>

            {text}
        </Heading>
        <VStack aspectRatio={1} flex={1} justifyContent={"center"}>
            {waitFor && children
                || <Box position={"absolute"} inset={"0"} m={"auto"} h={"min-content"}><Loader /></Box>}
        </VStack>

    </VStack>
}

function StockStatView({ arrayData, text, sign = "" }) {
    if (!arrayData)
        throw new Error("{arrayData} was not delivered to <StockStatView> component");

    const lastValue = arrayData[0]?.y;
    const preValue = arrayData[1]?.y;

    let direction = "", change = 0;
    if (preValue != undefined && preValue != lastValue) {
        if (lastValue > preValue)
            direction = "increase";
        else
            direction = "decrease"
        if (preValue == 0)
            change = 100;
        else
            change = ~~((lastValue / preValue - 1) * 1000) / 10;
    }

    return <Card w={"-webkit-fill-available"} p={"0.5em 1em"} flex={1} m="0 1em">
        <Stat colorScheme="purple" textAlign={"center"}>
            <StatLabel>{text}</StatLabel>
            <StatNumber as={HStack} justifyContent={"center"}><Text>{lastValue.toLocaleString()}</Text> <Text>{sign}</Text></StatNumber>
            <StatHelpText>
                {direction && <StatArrow type={direction} />}
                {change}%
            </StatHelpText>
        </Stat>
    </Card>
}