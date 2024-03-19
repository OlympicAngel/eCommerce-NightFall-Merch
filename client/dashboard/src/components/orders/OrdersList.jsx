import { ImSad2 } from "react-icons/im";
import { FaInfoCircle } from "react-icons/fa";
import { CgFileDocument } from "react-icons/cg";
import { HiLocationMarker } from "react-icons/hi";
import { Box, Accordion, AccordionItem, AccordionButton, AccordionIcon, AccordionPanel, Divider, Text, Flex, Button, Tag, useToast } from "@chakra-ui/react";
import OrderStatus, { orderStatusSteps } from "./OrderStatus";
import FilterButtons, { FilterBtn } from "../Sorters&Filters/FilterButtons";
import SortButtons, { SortBtn } from "../Sorters&Filters/SortButtons";
import OrderFullview from "./OrderFullview";
import HeaderCRUD from "../partial/HeaderCRUD";
import Search, { useSearchLogic } from "../Sorters&Filters/SearchList";
import Loader from "../partial/Loader";
import useMutationLogic from "../../hooks/useMutationLogic";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toastError } from "../../utils/toast.helper";
import useTitle from "../../hooks/useTitle";


function OrdersList({ orders = [], isLoading }) {
    //manually control which accordion item is open (in order to be able to close it on wil)
    const [accordionIndex, setAccordionIndex] = useState([])
    //handler to easy toggle item in the array
    const addAccordionIndex = (index) => {
        const newAccIndex = accordionIndex.includes(index) ?
            accordionIndex.filter(i => i != index) : //remove current index
            [index, ...accordionIndex] //add index
        setAccordionIndex(newAccIndex)
    }

    //convert date to Date object for later sorting & COPY order list so we can modify it
    let filteredOrders = orders.map(o => { o.created_at_parsed = new Date(o.created_at)?.toLocaleString("he-il", { "dateStyle": "short" }); return o; });

    //filter by type
    const filters = genFilterOptions()//gen filter option list
    const filterLogic = FilterBtn.useFilterBtnLogic(filters) //use hook with <FilterButtons> comp

    //filter by user search
    const searchLogic = useSearchLogic()

    //sort by
    const sorters = genSortOptions() //gen sort option list
    const sortLogic = SortBtn.useSortLogic(sorters)//use hook with <SortButtons> comp

    filteredOrders = filteredOrders
        .filter(filterLogic.filterFn)
        .filter(searchLogic.filterFn)
        .sort(sortLogic.sortFn)

    const [fullview, setFullview] = useState();
    const closeFullview = () => {
        setFullview();
        navigate("/orders");
    }

    //load params from url - to directly show a user
    const { orderID } = useParams();
    const navigate = useNavigate();
    const toast = useToast()
    useTitle(fullview ? `הזמנה ${orderID}` : "תצוגת הזמנות");
    useEffect(() => {
        //if component has not initialized with orders yet - ignore
        if (!orders.length || !orderID)
            return;

        const paramOrder = orders.find(o => o._id == orderID);
        if (!paramOrder) {
            toastError(new Error(`הזמנה מס' - "${orderID}" לא נמצאה. `), toast)
            return closeFullview()
        }
        setFullview(paramOrder);
    }, [orderID, orders.length == 0]) //update when param change OR if orders length changes from 0 (initial state)


    return (
        <>
            <HeaderCRUD name={"הזמנות"} list={filteredOrders}>
                <FilterButtons filterLogic={filterLogic} />
            </HeaderCRUD>
            <Search list={orders} filteredList={filteredOrders} searchLogic={searchLogic} placeholder='חיפוש הזמנה לפי שם, לקוח, מחיר, תאריך וכו...' />
            <SortButtons sortLogic={sortLogic} onChange={() => { setAccordionIndex([]) }} />
            {isLoading &&
                <Loader /> ||
                <>
                    {orders.length == 0 && <Box textAlign={"center"} as={"i"} color="gray.500"> ~ אין כרגע הזמנות <ImSad2 /> ~</Box>}
                    {filteredOrders.length == 0 && orders.length > 0 && <Box textAlign={"center"} as={"i"} color="gray.500"> ~ אין תוצאות - יש לשנות את סגנון הסינון ~</Box>}
                    <Accordion w="100%" allowMultiple index={accordionIndex}>
                        {filteredOrders.map((order, index) => <OrderRow id={index} key={order._id} {...{ order, index, addAccordionIndex }} />)}
                    </Accordion>
                </>}
            <OrderFullview {...{ order: fullview, handleClose: closeFullview }} />
        </>
    )
}

//each order row element
function OrderRow({ order, index, addAccordionIndex }) {
    const navigate = useNavigate();
    const updateOrder = useMutationLogic({
        "urlPath": `orders/manage/${order._id}/status`,
        "method": "put",
        "relatedQuery": "orders"
    }).mutate;
    const customer = order.customer;

    return <AccordionItem id={order._id} borderTopColor="purple.600" _odd={{ bg: "rgba(0,0,0,0.15)" }} bg="rgba(255,255,255,0.05)" borderRadius={"1em"}>
        {({ isExpanded }) => <>
            <AccordionButton onClick={() => addAccordionIndex(index)} p={"1em"} _hover={{ bg: 'gray.600' }} borderRadius={"1em"}
                {...(isExpanded ? { bg: 'purple.800', color: "purple.100", _hover: { bg: 'purple.600' } } : {})}>
                <Box as="span" flex='1' textAlign='right'>
                    <Tag colorScheme={orderStatusSteps[order.status - 1].color}>
                        {orderStatusSteps[order.status - 1].title.split(" ").pop()}
                    </Tag> לקוח: {customer.name}, טלפון: {customer.phone}</Box>
                <Box>₪
                    {order.total_price.toLocaleString("he-il")}
                </Box>
                <AccordionIcon />
            </AccordionButton>
            <AccordionPanel p={4} direction="ltr" >
                <OrderInfo order={order} key={order._id} />
                <Button background={"purple.500"} onClick={() => navigate("./" + order._id)}>תצוגה מלאה</Button>
                <Divider mt={"1em"} mb={"1em"} />
                <OrderStatus status={order.status} onChange={(newState) => {
                    updateOrder({ status: newState })
                    window.open(`https://www${import.meta.env.DEV ? ".sandbox" : ""}.paypal.com/activity/actions/refund/edit/${order.payment.transaction_number}`, "_blank", "noreferrer");
                }} />
                <Box textAlign={"center"} fontSize={"0.7em"}>- לחץ בכדי לעדכן סטטוס -</Box>
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
            <strong>תאריך רכישה:</strong>
            <Text> {order.created_at_parsed}</Text>
            <strong>הזמנה מספר:</strong> {order._id}
        </OrderInfoBlock>

        <OrderInfoBlock icon={<FaInfoCircle size="1.5em" />}>
            <strong>סיכום הזמנה:</strong>
            <Text> סה"כ - ₪{order.total_price.toLocaleString("he-il")}.
            </Text>

            <Box>פריטים: {order.products.map((p, i) => <ProductListing key={i} p={p} />)}
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

//utils functions:

//array of filter objects used to create buttons & run functions of filtration
function genFilterOptions() {
    const btns = [
        new FilterBtn("הכל", (order) => order, "orange")
    ]
    orderStatusSteps.forEach((step, index) => btns.push(new FilterBtn(
        step.title.split(" ").pop(),
        (order) => order.status == index + 1,
        step.color)
    ));
    return btns;
}

//array of sorters objects used to create buttons & run functions of sort
function genSortOptions() {
    return [
        new SortBtn("תאריך", (o1, o2) => new Date(o1.created_at) < new Date(o2.created_at) ? 1 : -1),
        new SortBtn("מחיר", (o1, o2) => o1.total_price < o2.total_price ? 1 : -1),
        new SortBtn("שם", (o1, o2) => o1.customer.name < o2.customer.name ? 1 : -1),
        new SortBtn("כתובת", (o1, o2) => o1.customer.address.city < o2.customer.address.city ? 1 : -1),
        new SortBtn("סטטוס", (o1, o2) => o1.status < o2.status ? 1 : -1),
        new SortBtn("מזהה", (o1, o2) => o1._id < o2._id ? 1 : -1)
    ]
}

export default OrdersList
