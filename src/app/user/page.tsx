import { Box } from "@chakra-ui/react"

const BaseUserPage = () => (
    <Box>
        User base page, should never be rendered because of the ProfileWrapper Component.
        Possible to avoid this page using shallow routing
    </Box>
)

export default BaseUserPage
