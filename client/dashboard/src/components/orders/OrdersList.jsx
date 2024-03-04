import { ImSad2 } from "react-icons/im";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { BiSearchAlt2 } from "react-icons/bi";
import { FaInfoCircle } from "react-icons/fa";
import { CgFileDocument } from "react-icons/cg";
import { HiLocationMarker } from "react-icons/hi";
import { FaShekelSign } from "react-icons/fa";
import { Heading, Box, useToast, Accordion, AccordionItem, AccordionButton, AccordionIcon, AccordionPanel, StatLabel, Stat, StatNumber, StatHelpText, Divider, Text, CardHeader, Flex, RadioGroup, Button, Stack, Radio, Badge, VStack, Tag, InputGroup, InputLeftAddon, Input, InputLeftElement, Spacer, InputRightElement, HStack } from "@chakra-ui/react"
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthProvider";
import OrderStatus from "./OrderStatus";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { toastError, toastSuccess } from "../../utils/toast.helper"
import FilterButtons, { FilterBtn } from "../Sorters&Filters/FilterButtons";
import SortButtons, { SortBtn } from "../Sorters&Filters/SortButtons";
import OrderFullview from "./OrderFullview";
import HeaderCRUD from "../partial/HeaderCRUD";
import Search, { useSearchLogic } from "../Sorters&Filters/SearchList";


function OrdersList({ orders = [] }) {
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

    filteredOrders = filteredOrders.filter(filterLogic.filterFn).filter(searchLogic.filterFn).sort(sortLogic.sortFn)


    const [fullview, setFullview] = useState();

    return (
        <>
            <HeaderCRUD name={"הזמנות"} list={filteredOrders}>
                <FilterButtons filterLogic={filterLogic} />
            </HeaderCRUD>
            <Search list={orders} filteredList={filteredOrders} searchLogic={searchLogic} placeholder='חיפוש הזמנה לפי שם, לקוח, מחיר, תאריך וכו...' />
            <SortButtons sortLogic={sortLogic} onChange={() => { setAccordionIndex([]) }} />
            {orders.length == 0 && <Box textAlign={"center"} as={"i"} color="gray.500"> ~ אין כרגע הזמנות <ImSad2 /> ~</Box>}
            {filteredOrders.length == 0 && orders.length > 0 && <Box textAlign={"center"} as={"i"} color="gray.500"> ~ אין תוצאות - יש לשנות את סגנון הסינון ~</Box>}
            <Accordion w="100%" allowMultiple index={accordionIndex}>
                {filteredOrders.map((order, index) => <OrderRow id={index} key={order._id} {...{ order, index, addAccordionIndex, setFullview }} />)}
            </Accordion>
            <OrderFullview {...{ order: fullview, setFullview }} />
        </>
    )
}

//each order row element
function OrderRow({ order, index, addAccordionIndex, setFullview }) {
    const toast = useToast();
    const { SERVER } = useContext(AuthContext)
    const API = `${SERVER}orders/manage/${order._id}/status`;

    const queryClient = useQueryClient()
    const { mutate } = useMutation({
        mutationFn: async (status) => await axios.put(API, { status }, { withCredentials: true }),
        onError: (e) => { toastError(e, toast) },
        onSuccess: (res) => {
            toastSuccess(res.data.message, toast);
            queryClient.invalidateQueries("getOrders")
        }
    })
    const customer = order.customer_details;

    return <AccordionItem id={order._id} borderTopColor="purple.600" _odd={{ bg: "rgba(0,0,0,0.15)" }} bg="rgba(255,255,255,0.05)" borderRadius={"1em"}>
        {({ isExpanded }) => <>
            <AccordionButton onClick={() => addAccordionIndex(index)} p={"1em"} _hover={{ bg: 'gray.600' }} borderRadius={"1em"}
                {...(isExpanded ? { bg: 'purple.800', color: "purple.100", _hover: { bg: 'purple.600' } } : {})}>
                <Box as="span" flex='1' textAlign='right'>
                    <Tag colorScheme={["orange", "blue", "green", "red"][order.status - 1]}>
                        {["חדש", "משלוח", "בוצעה", "בוטל"][order.status - 1]}
                    </Tag> לקוח: {customer.customer_name}, טלפון: {customer.customer_phone}</Box>
                <Box>
                    {order.total_price.toLocaleString("he-il")}
                    <FaShekelSign size={"0.5em"} />
                </Box>
                <AccordionIcon />
            </AccordionButton>
            <AccordionPanel p={4} direction="ltr" >
                <OrderInfo order={order} key={order._id} />
                <Button background={"purple.500"} onClick={() => setFullview(order)}>תצוגה מלאה</Button>
                <Divider mt={"1em"} mb={"1em"} />
                <OrderStatus status={order.status} onChange={(newState) => mutate(newState)} />
                <Box textAlign={"center"} fontSize={"0.7em"}>- לחץ בכדי לעדכן סטטוס -</Box>
            </AccordionPanel>
        </>
        }
    </AccordionItem>;
}

//order summery info
function OrderInfo({ order }) {
    const customer = order.customer_details;

    return <Flex gap={"1em"} wrap={"wrap"} w="100%">
        <OrderInfoBlock icon={<HiLocationMarker size={"1.5em"} />}>
            <Text>{customer.customer_name}</Text>
            <Text>{customer.customer_phone}</Text>
            <Text>{Object.values(customer.customer_address).join(", ")}</Text>
        </OrderInfoBlock>

        <OrderInfoBlock icon={<CgFileDocument size="1.5em" />}>
            <strong>תאריך רכישה:</strong>
            <Text> {order.created_at_parsed}</Text>
            <strong>הזמנה מספר:</strong> {order._id}
        </OrderInfoBlock>

        <OrderInfoBlock icon={<FaInfoCircle size="1.5em" />}>
            <strong>סיכום הזמנה:</strong>
            <Text> סה"כ - {order.total_price.toLocaleString("he-il")}
                <FaShekelSign size={"0.5em"} />.
            </Text>

            <Box>פריטים: {order.products.map((p, i) => <ProductListing key={i} p={p} />)}
            </Box>
        </OrderInfoBlock>
    </Flex>
}

//product list item used by <OrderInfo></OrderInfo>
function ProductListing({ p }) {
    return <Text as={"i"} display={"block"} key={p._id}>{p.quantity} יח' {p.product?.name || "-הוסר-"} ב {p.RTP}<FaShekelSign size={"0.5em"} /></Text>
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
    return [
        new FilterBtn("הכל", (order) => order, "orange"),
        new FilterBtn("חדש", (order) => order.status == 1),
        new FilterBtn("במשלוח", (order) => order.status == 2),
        new FilterBtn("בוצע", (order) => order.status == 3),
        new FilterBtn("בוטל", (order) => order.status == 4)
    ]
}

//array of sorters objects used to create buttons & run functions of sort
function genSortOptions() {
    return [
        new SortBtn("תאריך", (o1, o2) => new Date(o1.created_at) < new Date(o2.created_at) ? 1 : -1),
        new SortBtn("מחיר", (o1, o2) => o1.total_price < o2.total_price ? 1 : -1),
        new SortBtn("שם", (o1, o2) => o1.customer_details.customer_name < o2.customer_details.customer_name ? 1 : -1),
        new SortBtn("כתובת", (o1, o2) => o1.customer_details.customer_address.city < o2.customer_details.customer_address.city ? 1 : -1),
        new SortBtn("סטטוס", (o1, o2) => o1.status < o2.status ? 1 : -1),
        new SortBtn("מזהה", (o1, o2) => o1._id < o2._id ? 1 : -1)
    ]
}

export default OrdersList
