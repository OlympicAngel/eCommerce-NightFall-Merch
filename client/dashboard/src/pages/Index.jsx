import { Box, Divider, Flex, Heading, useColorModeValue } from "@chakra-ui/react";
import useFirebaseDB from "../hooks/useFirebaseDB";
import useTitle from "../hooks/useTitle";
import { VictoryPie, VictoryLabel, VictoryChart, VictoryArea } from 'victory';
import Loader from "../components/partial/Loader";


function Index() {
    useTitle("ראשי")
    const data = useFirebaseDB();

    // console.log(data)

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
                </StatSection>

                <StatSection text={"משתמשים מחוברים:"} waitFor={data.activeUsers?.length > 0} bg="blue.200">
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

                <StatSection text={"סל קניות משותף:"} waitFor={data.activeUsers?.length > 0} bg="blue.200">
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

    return <Box flex="1" fill={color} bg={bg} aspectRatio={1} position={"relative"} borderRadius={"xl"} minW={"300px"}>
        <Heading fontSize={25} textAlign={"center"}>{text}</Heading>
        <Divider />
        {waitFor && children
            || <Box position={"absolute"} inset={"0"} m={"auto"} h={"min-content"}><Loader /></Box>}
    </Box>
}