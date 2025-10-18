import { Box, Stack } from "@mui/material";
import GranitCatalogFilter from "@/components/GranitCatalogFilter/GranitCatalogFilter";
import GranitCatalogCard from "@/components/GranitCatalogCards/GranitCatalogCards";
import GranitCatalogHeader from "@/components/GranitCatalogHeader/GranitCatalogHeader";

export default function Catalog() {
    return (
        <Box>
            <GranitCatalogHeader />
            <Box display="flex">            
                <GranitCatalogFilter />
                <Box flexGrow={1}>
                    <GranitCatalogCard />
                </Box>
            </Box>

        </Box>
    )
}