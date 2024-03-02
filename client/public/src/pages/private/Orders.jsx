import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';

const Orders = () => {
  // Assuming orders data is passed as props or fetched from an API
  const orders = [
    { id: 1, date: '2023-05-22', total: 29.99, status: 'Delivered' },
    { id: 2, date: '2023-05-18', total: 49.99, status: 'Shipped' },
    { id: 3, date: '2023-05-15', total: 19.99, status: 'Processing' },
  ];

  return (
    <Box minH="65vh" maxW="1000px" mx="auto" py={10} px={4}>
      <Heading as="h2" size="xl" mb={6}>
        My Orders
      </Heading>
      <Table variant="striped">
        <Thead>
          <Tr>
            <Th>Order ID</Th>
            <Th>Date</Th>
            <Th>Total</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {orders.map((order) => (
            <Tr key={order.id}>
              <Td>{order.id}</Td>
              <Td>{order.date}</Td>
              <Td>${order.total}</Td>
              <Td>{order.status}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default Orders;
