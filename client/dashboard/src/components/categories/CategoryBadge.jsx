import { Badge } from "@chakra-ui/react"

function CategoryBadge({ category }) {
    const name = category.name,
        color = category.color;
    return (<>
        {name && <Badge variant='subtle' colorScheme={color}>{name}</Badge>}
    </>)

}
export default CategoryBadge