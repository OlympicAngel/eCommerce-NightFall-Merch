import { Avatar, Badge, Box, Divider, HStack, Tag, TagLabel, Text, VStack } from "@chakra-ui/react"

function LoggedAdminFooter({ manager }) {
    if (!manager)
        return


    return (
        <Box as="footer" bg="purple.900" color="white" boxShadow={"0 1em 1em 1em rgba(0,0,0,0.3)"}
            p={"0.5em 0"}>
            <HStack justifyContent={"center"}>
                <Box flex="1" textAlign={"end"}>
                    <Tag size="lg" borderRadius={"full"} >
                        <TagLabel>{manager.name}</TagLabel>
                        <Avatar bg="purple.200" name={manager.name} src={manager.image} m="1" me="-2" size="sm" />
                    </Tag>
                </Box>
                <ManagerBadge manager={manager} ></ManagerBadge>
            </HStack>
        </Box>
    )
}
export default LoggedAdminFooter

export function ManagerBadge({ manager }) {
    const permissions = getPermissions()
    const role = permissions[manager.permission - 1 || 0];
    return <VStack gap={0} alignItems={"flex-start"} flex="1">
        <Badge colorScheme={role.color} variant={"solid"} p="0 0.5em" fontSize="sm">{role.name}</Badge>
        <Text fontSize="10" maxW={"25vw"}><b>הרשאות:</b> {role.desc}.</Text>
    </VStack>
}

function getPermissions() {
    return [
        { color: "black", desc: "הצגה ושינוי נתונים - בלי מחיקה", name: "מנהל" },
        { color: "red", desc: "כל הפעולות כולל מחיקה", name: "אדמין" }
    ]
}