import { FaInfoCircle } from "react-icons/fa";
import { CgFileDocument } from "react-icons/cg";
import { HiLocationMarker } from "react-icons/hi";
import { Box, Accordion, AccordionItem, AccordionButton, AccordionIcon, AccordionPanel, Divider, Text, Flex, Button, Tag } from "@chakra-ui/react";
import OrderStatus, { orderStatusSteps } from "./OrderStatus";
import Search, { useSearchLogic } from "../Sorters&Filters/SearchList";
import Loader from "../partials/Loader";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useQueryLogic from "../../hooks/useQueryLogic";
import ErrorView from "../partials/ErrorView";


function OrdersList() {

    const { data: orders = [], error, isLoading } = useQueryLogic({
        key: "orders",
        urlPath: "orders"
    })

    //manually control which accordion item is open (in order to be able to close it on wil)
    const [accordionIndex, setAccordionIndex] = useState([])
    //handler to easy toggle item in the array
    const addAccordionIndex = (index) => {
        const newAccIndex = accordionIndex.includes(index) ?
            accordionIndex.filter(i => i != index) : //remove current index
            [index, ...accordionIndex] //add index
        setAccordionIndex(newAccIndex)
    }

    const searchLogic = useSearchLogic({});

    //convert date to Date object for later sorting & COPY order list so we can modify it
    let filteredOrders = orders.map(o => { o.created_at_parsed = new Date(o.created_at)?.toLocaleString("he-il", { "dateStyle": "short" }); return o; });
    filteredOrders = filteredOrders.filter(searchLogic.filterFn)


    return (
        <Box >
            <Search list={orders} filteredList={filteredOrders} searchLogic={searchLogic} placeholder='חיפוש הזמנה לפי מוצר, מחיר, תאריך וכו...' />
            <Box position={"relative"} minH={"3em"} mt={"1em"}>
                {isLoading &&
                    <Loader /> ||
                    <>
                        {orders.length == 0 && <Box as={"p"} color="gray.500" w={"100%"} textAlign={"center"}> ~ אין כרגע הזמנות  ~</Box>}
                        {filteredOrders.length == 0 && orders.length > 0 && <Box textAlign={"center"} as={"i"} color="gray.500"> ~ אין תוצאות - יש לשנות את סגנון הסינון ~</Box>}
                        <Accordion w="100%" allowMultiple index={accordionIndex}>
                            {filteredOrders.map((order, index) => <OrderRow id={index} key={order._id} {...{ order, index, addAccordionIndex }} />)}
                        </Accordion>
                    </>}
            </Box>
            {error && <ErrorView error={error} />}
        </Box>
    )
}

//each order row element
function OrderRow({ order, index, addAccordionIndex }) {
    const navigate = useNavigate();
    const customer = order.customer;

    return <AccordionItem id={order._id} borderTopColor="purple.600" _odd={{ bg: "rgba(0,0,0,0.15)" }} bg="rgba(255,255,255,0.05)" borderRadius={"1em"}>
        {({ isExpanded }) => <>
            <AccordionButton onClick={() => addAccordionIndex(index)} p={"1em"} _hover={{ bg: 'gray.600' }} borderRadius={"1em"}
                {...(isExpanded ? { bg: 'purple.800', color: "purple.100", _hover: { bg: 'purple.600' } } : {})}>
                <Box as="span" flex='1' textAlign='right'>
                    <Tag colorScheme={orderStatusSteps[order.status - 1].color}>
                        {orderStatusSteps[order.status - 1].title.split(" ").pop()}
                    </Tag> תאריך: {order.created_at_parsed}, הזמנה: {order._id}</Box>
                <Box fontSize={"1.5em"}>₪
                    {order.total_price.toLocaleString("he-il")}
                </Box>
                <AccordionIcon />
            </AccordionButton>
            <AccordionPanel p={4} direction="ltr" >
                <OrderInfo order={order} key={order._id} />
                <Button as={Link} background={"purple.500"} to={"/order/" + order._id}>תצוגה מלאה</Button>
                <Divider mt={"1em"} mb={"1em"} />
                <OrderStatus status={order.status} />
            </AccordionPanel>
        </>
        }
    </AccordionItem>;
}

//order summery info
function OrderInfo({ order }) {
    const customer = order.customer;

    return <Flex gap={"1em"} wrap={"wrap"} w="100%">
        <OrderInfoBlock icon={<HiLocationMarker size={"1.5em"} />}>
            <Text><strong>שם:</strong> {customer.name}</Text>
            <Text><strong>נייד:</strong> {customer.phone}</Text>
            <Text direction="rtl"><strong>כתובת:</strong> {`${customer.address.city}, ${customer.address.street} ${customer.address.building}`}</Text>
        </OrderInfoBlock>

        <OrderInfoBlock icon={<CgFileDocument size="1.5em" />}>
            <strong>סיכום הזמנה:</strong>
            <Text> סה"כ - ₪{order.total_price.toLocaleString("he-il")}.
            </Text>
        </OrderInfoBlock>

        <OrderInfoBlock icon={<FaInfoCircle size="1.5em" />}>
            <strong>פריטים:</strong>
            <Box overflow={"auto"} maxH={"10em"}>{order.products.map((p, i) => <ProductListing key={i} p={p} />)}
            </Box>
        </OrderInfoBlock>
    </Flex>
}

//product list item used by <OrderInfo></OrderInfo>
function ProductListing({ p }) {
    return <Text as={"i"} display={"block"} key={p._id}>{p.quantity} יח' {p.product?.name || "-הוסר-"} ב ₪{p.RTP}</Text>
}

//semantic container of info 
function OrderInfoBlock({ icon, children }) {
    return <Flex gap={"0.5em"} flex="1">
        {icon}
        <Flex flexDir={"column"}>
            {children}
        </Flex>
    </Flex>
}

export default OrdersList
