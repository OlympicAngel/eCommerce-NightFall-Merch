import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { BiSearchAlt2 } from "react-icons/bi";
import { FaInfoCircle } from "react-icons/fa";
import { CgFileDocument } from "react-icons/cg";
import { HiLocationMarker } from "react-icons/hi";
import { FaShekelSign } from "react-icons/fa";
import { Heading, Box, useToast, Accordion, AccordionItem, AccordionButton, AccordionIcon, AccordionPanel, StatLabel, Stat, StatNumber, StatHelpText, Divider, Text, CardHeader, Flex, RadioGroup, Button, Stack, Radio, Badge, VStack, Tag, InputGroup, InputLeftAddon, Input, InputLeftElement, Spacer, InputRightElement } from "@chakra-ui/react"
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthProvider";
import OrderStatus from "./OrderStatus";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { toastError, toastSuccess } from "../../utils/toast.helper"
import FilterButtons from "./Sorters&Filters/FilterButtons";
import SortButtons from "./Sorters&Filters/SortButtons";
import OrderFullview from "./OrderFullview";


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
    const [filterOpt, setFilterOpt] = useState(0)
    const filters = filterOptions()
    const filter = filters[filterOpt];
    filteredOrders = filteredOrders.filter(filter.fn);

    //filter by user search
    const [searchTerm, setSearchTerm] = useState("")
    filteredOrders = filteredOrders.filter(order => deepSearch(order, searchTerm))

    //sorty by (down/up by +/- sign)
    const [sorterOpt, setSorterOpt] = useState(1)
    //set sorting option OR if its the same sorting opt - change -/+ sign
    const setSorter = (val) => { val == sorterOpt ? setSorterOpt(val * -1) : setSorterOpt(val) }
    const sorters = sortOptions()
    const sorter = sorters[Math.abs(sorterOpt) - 1];
    filteredOrders = filteredOrders.sort((a, b) => sorter.fn(a, b, Math.sign(sorterOpt)))


    const [fullview, setFullview] = useState();

    return (
        <>
            <Flex mb={"0.5em"} >
                <Heading flex={1}>
                    רשימת הזמנות:
                </Heading>
                <FilterButtons setCurrentOpt={setFilterOpt} currentOpt={filterOpt} options={filters} />
            </Flex>
            <InputGroup >
                <InputRightElement pointerEvents='none'>
                    <BiSearchAlt2 />
                </InputRightElement>
                <Input p={"1em"} pr={"2.5em"} type='search' onChange={(e) => setSearchTerm(e.target.value.toLowerCase())} placeholder='חיפוש הזמנה לפי שם, לקוח, מחיר, תאריך וכו...' />
            </InputGroup>
            <SortButtons setCurrentOpt={setSorter} currentOpt={sorterOpt} options={sorters} setAccordionIndex={setAccordionIndex} />
            {filteredOrders.length == 0 && <Box textAlign={"center"} as={"i"} color="gray.500"> ~ אין תוצאות - יש לשנות את סגנון הסינון ~</Box>}
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

//recursive deep search function to search at all order data
function deepSearch(obj, match) {
    return Object.values(obj).find(val => {
        if (typeof val === "object")
            return deepSearch(val, match)
        val = val?.toString().toLowerCase();
        const isMatch = val?.startsWith(match);
        return isMatch
    })
}

//array of filter objects used to create buttons & run functions of filtration
function filterOptions() {
    return [
        { title: "הכל", fn: (order) => order, color: "orange" },
        { title: "חדש", fn: (order) => order.status == 1 },
        { title: "במשלוח", fn: (order) => order.status == 2 },
        { title: "בוצע", fn: (order) => order.status == 3 },
        { title: "בוטל", fn: (order) => order.status == 4 },
    ]
}

//array of sorters objects used to create buttons & run functions of sort
function sortOptions() {
    return [
        { title: "תאריך", fn: (o1, o2, sign) => sign * (new Date(o1.created_at) < new Date(o2.created_at) ? 1 : -1) },
        { title: "מחיר", fn: (o1, o2, sign) => sign * (o1.total_price < o2.total_price ? 1 : -1) },
        { title: "שם", fn: (o1, o2, sign) => sign * (o1.customer_details.customer_name < o2.customer_details.customer_name ? 1 : -1) },
        { title: "כתובת", fn: (o1, o2, sign) => sign * (o1.customer_details.customer_address.city < o2.customer_details.customer_address.city ? 1 : -1) },
        { title: "סטטוס", fn: (o1, o2, sign) => sign * (o1.status < o2.status ? 1 : -1) },
        { title: "מזהה", fn: (o1, o2, sign) => sign * (o1._id < o2._id ? 1 : -1) },
    ]
}

export default OrdersList
