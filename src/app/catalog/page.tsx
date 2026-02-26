"use client"
import { Box } from "@mui/material";
import GranitCatalogFilter from "@/components/GranitCatalogFilter/GranitCatalogFilter";
import GranitCatalogCard from "@/components/GranitCatalogCards/GranitCatalogCards";
import GranitCatalogHeader from "@/components/GranitCatalogHeader/GranitCatalogHeader";
import { FilterProvider } from "@/contexts/FilterContext";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function CatalogContent() {
    const searchParams = useSearchParams();
    const categories = searchParams.get('categories');
    const categoryId = categories ? parseInt(categories.split(',')[0]) : undefined;

    return (
        <FilterProvider initialCategoryId={categoryId}>
            <Box>
                <GranitCatalogHeader />
                <Box 
                    display="flex" 
                    minHeight="calc(100vh - 200px)"
                    flexDirection={{ xs: 'column', md: 'row' }}
                >
                    <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                        <GranitCatalogFilter />
                    </Box>
                    <Box flexGrow={1}>
                        <GranitCatalogCard />
                    </Box>
                </Box>
            </Box>
        </FilterProvider>
    )
}

export default function Catalog() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CatalogContent />
        </Suspense>
    )
}