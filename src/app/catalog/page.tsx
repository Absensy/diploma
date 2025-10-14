import { Box, Stack } from "@mui/material";
import GranitCatalogFilter from "@/components/GranitCatalogFilter/GranitCatalogFilter";
import GranitCatalogCard from "@/components/GranitCatalogCards/GranitCatalogCards";
import GranitCatalogHeader from "@/components/GranitCatalogHeader/GranitCatalogHeader";

export default function Catalog() {
    return (
        <Box padding="40px 80px 80px">
            <GranitCatalogHeader />
            <Stack spacing="80px" marginTop="32px" direction="row">        
                <GranitCatalogFilter />
                <GranitCatalogCard />
            </Stack>
        </Box>
    )
}