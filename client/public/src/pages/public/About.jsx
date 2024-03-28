import { Box, Card, Heading, Text } from "@chakra-ui/react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import useTitle from "../../hooks/useTitle";


function About() {

  useTitle("עלינו")


  return (
    <Card maxW={"800px"}>
      <Heading as="h1" size="xl" mb={4}>אודות האתר</Heading>
      <Text fontSize="lg" lineHeight="tall">
        האתר הוקם כפלטפורמה לרכישת מוצרי מרצ' של קהילת נייטפול,
        נייטפול זו קהילת יוצרי תוכן שיוצרים סרטונים במשחק מיינקראפט, עם מעל 12 מליון צפיות ביוטיוב!
      </Text>
      <Text fontSize="lg" lineHeight="tall" mt={4}>
        המוצרים המוצעים באתר כוללים פריטים כמו חולצות, כובעים, פוסטרים ועוד,
        אשר עיצובם וסגנונם מתאימים לקהילת נייטפול.
        הרווחים מהאתר עוזרים לנו להמשיך להתקיים כקהילה, להחזיק את השרתים שלנו, ליצור איוונטים לקהילה ולהביא לנו את היכולת להחזיר לכם בפרסים ועוד..
      </Text>
      <Text fontSize="lg" lineHeight="tall" mt={4}>
        האתר נבנה במסגרת פרויקט גמר בקורס Fullstack, והשתמש בטכנולוגיות מתקדמות כמו React, Node.js, MongoDB, Firebase, ו-Chakra UI.
        זאת כדי לספק חווית משתמש מתקדמת ומודרנית למבקרים באתר, תוך שמירה על יעילות ופונקציונליות מרבית.
      </Text>
    </Card>
  );
}

export default About;
