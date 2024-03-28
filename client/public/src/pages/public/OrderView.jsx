import { useToast } from "@chakra-ui/react";
import { toastError } from "../../utils/toast.helper";
import useQueryLogic from "../../hooks/useQueryLogic";
import Loader from "../../components/partials/Loader";
import { useContext, useEffect } from "react";

import React from "react";
import {
  Box,
  Heading,
  Text,
  Divider,
  Flex,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
  Tooltip,
  Icon,
  Badge,
} from "@chakra-ui/react";
import {
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdDateRange
} from "react-icons/md";
import { BsCreditCard } from "react-icons/bs";
import { FaPaypal } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import OrderStatus, { orderStatusSteps } from "../../components/orders/OrderStatus";
import { AuthContext } from "../../context/AuthProvider";
import useTitle from "../../hooks/useTitle";


const OrderView = () => {
  useTitle("פרטי הזמנה")

  const { isAuth } = useContext(AuthContext)
  if (isAuth == undefined)
    return;

  //load params from url - to directly show a user
  const { orderID } = useParams();
  const toast = useToast()
  const navigate = useNavigate();

  const { data: order, error, isLoading } = useQueryLogic({
    "key": "order_" + orderID,
    "urlPath": "orders/" + (!isAuth ? "guest/" : "") + orderID,
  })

  useEffect(() => {
    if (!error)
      return;

    console.log(error)

    toastError(error, toast);
    navigate("/")
  }, [error])

  const bgColor = useColorModeValue("gray.100", "gray.800");
  const titleColor = useColorModeValue("purple.600", "blue.300");
  const highlightColor = useColorModeValue("purple.500", "blue.200");
  const iconColor = useColorModeValue("blue.200", "purple.200");

  if (error)
    return;

  if (isLoading)
    return <Box position={"relative"}>
      <Loader />
    </Box>

  return (
    <Box
      p={4}
      borderWidth="1px"
      borderRadius="md"
      shadow="md"
      bg={bgColor}
      width="100%"
      maxWidth={{ base: "100%", lg: "80%" }}
      margin="auto"
      textAlign="right"
    >
      <SummaryHeader titleColor={titleColor} status={order.status} />
      <Divider mt={2} mb={4} />
      <Flex direction={{ base: "column", md: "row" }} justify="space-between">
        <CustomerDetails customer={order.customer} iconColor={iconColor} />
        <OrderInfo
          iconColor={iconColor}
          highlightColor={highlightColor}
          orderId={order._id}
          orderDate={new Date(order.created_at).toLocaleString()}
          totalPrice={order.total_price}
        />
      </Flex>
      <Divider my={4} />
      <VStack align="stretch" spacing={4}>
        <OrderStatus status={order.status}></OrderStatus>
        <Heading size="md" color={titleColor} mb={2}>
          מוצרים
        </Heading>
        <ProductTable products={order.products} />
      </VStack>
      <Divider my={4} />
      <PaymentDetails payment={order.payment} iconColor={iconColor} />
    </Box>
  );
};

const SummaryHeader = ({ titleColor, status }) => {
  const sts = orderStatusSteps[status - 1];
  return (
    <Flex align="center" justify="space-between">
      <Heading size="lg" color={titleColor}>
        סיכום ההזמנה
      </Heading>
      <Tooltip label="הזמנה הושלמה" placement="top">
        <Badge colorScheme={sts.color} fontSize="lg">
          <Icon as={sts.icon} ml={1} /> {sts.title}
        </Badge>
      </Tooltip>
    </Flex>
  );
};

const CustomerDetails = ({ customer, iconColor }) => {
  return (
    <VStack align="flex-start" spacing={2} mb={{ base: 4, md: 0 }}>
      <Flex align="center">
        <Icon as={MdLocationOn} color={iconColor} />
        <Text fontSize="lg">
          <b>שם לקוח:</b> {customer.name}
        </Text>
      </Flex>
      <Flex align="center">
        <Icon as={MdEmail} color={iconColor} />
        <Text fontSize="lg">
          <b>אימייל:</b> {customer.email}
        </Text>
      </Flex>
      <Flex align="center">
        <Icon as={MdPhone} color={iconColor} />
        <Text fontSize="lg">
          <b>טלפון:</b> {customer.phone}
        </Text>
      </Flex>
      <Flex align="center">
        <Icon as={MdLocationOn} color={iconColor} />
        <Text fontSize="lg">
          <b>כתובת משלוח:</b> {customer.address.street},{" "}
          {customer.address.city}
        </Text>
      </Flex>
    </VStack>
  );
};

const OrderInfo = ({ orderId, orderDate, totalPrice, iconColor, highlightColor }) => {
  return (
    <VStack align="flex-start" spacing={2}>
      <Flex align="center">
        <Icon as={MdDateRange} color={iconColor} />
        <Text fontSize="lg">
          <b>מספר הזמנה:</b> {orderId}
        </Text>
      </Flex>
      <Flex align="center">
        <Icon as={MdDateRange} color={iconColor} />
        <Text fontSize="lg">
          <b>תאריך הזמנה:</b> {orderDate}
        </Text>
      </Flex>
      <Heading fontSize="3xl" color={highlightColor}>
        <b>סכום כולל:</b> ${totalPrice}
      </Heading>
    </VStack>
  );
};

const ProductTable = ({ products }) => {
  return (
    <Table>
      <Thead>
        <Tr>
          <Th>שם המוצר</Th>
          <Th>כמות</Th>
          <Th>מחיר</Th>
        </Tr>
      </Thead>
      <Tbody>
        {products.map((item) => (
          <Tr key={item._id}>
            <Td>{item.product.name}</Td>
            <Td>{item.quantity}</Td>
            <Td>{item.RTP}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

const PaymentDetails = ({ payment, iconColor }) => {
  return (
    <VStack align="flex-start" spacing={2}>
      <Flex align="center">
        <Icon as={MdDateRange} color={iconColor} />
        <Text fontSize="lg">
          <b>תאריך התשלום:</b> {new Date(payment.date).toLocaleString()}
        </Text>
      </Flex>
      <Flex align="center">
        <Icon as={FaPaypal} color={iconColor} />
        <Text fontSize="lg">
          <b>מזהה העסקה בפייפאל:</b> {payment.paypal_id}
        </Text>
      </Flex>
      <Flex align="center">
        <Icon as={BsCreditCard} color={iconColor} />
        <Text fontSize="lg">
          <b>מספר העסקה:</b> {payment.transaction_number}
        </Text>
      </Flex>
    </VStack>
  );
};

export default OrderView;
