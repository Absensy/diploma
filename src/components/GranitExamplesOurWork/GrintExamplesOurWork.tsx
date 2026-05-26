"use client"

import { useState, useEffect } from "react";
import { Box, Typography, Alert, useMediaQuery, useTheme } from "@mui/material";
import ExamplesOurWorkCard from "../ExamplesOurWorkCard/ExamplesOurWorkCard";
import { useExamplesWork } from "@/hooks/useExamplesWork";
import { ExampleWorkCardSkeleton } from "../Skeleton/Skeleton";
import EmptyState from "../EmptyState/EmptyState";
import { ExamplesPagination, PaginationStack } from "./GranitExamplesOurWork.styles";

const SECTION_ID = 'examples';

const GRID_COLS = {
  xs: "1fr",
  md: "repeat(2, 1fr)",
  lg: "repeat(3, 1fr)",
} as const;

const GranitExamplesOurWork = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));   // < 900px: 1 col
    const isLarge  = useMediaQuery(theme.breakpoints.up('lg'));     // ≥ 1200px: 3 cols

    // Desktop: 3 col × 2 rows = 6 | Tablet: 2 col × 2 rows = 4 | Mobile: 1 col × 3 = 3
    const itemsPerPage = isMobile ? 3 : isLarge ? 6 : 4;

    const { examplesWork, loading, error } = useExamplesWork();
    const [page, setPage] = useState(1);

    useEffect(() => {
        setPage(1);
    }, [itemsPerPage]);

    const totalPages = Math.ceil(examplesWork.length / itemsPerPage);
    const currentItems = examplesWork.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        if (typeof window === 'undefined') return;
        const section = document.getElementById(SECTION_ID);
        const top = section
            ? section.getBoundingClientRect().top + window.scrollY - 80
            : 0;
        window.scrollTo({ top, behavior: 'smooth' });
    };

    const grid = (
        <Box
            display="grid"
            gridTemplateColumns={GRID_COLS}
            gap={{ xs: "16px", sm: "20px", md: "24px" }}
            padding={{ xs: "0px 4%", md: "0px 5%" }}
        >
            {currentItems.map((work) => (
                <ExamplesOurWorkCard
                    key={work.id}
                    image={work.image}
                    title={work.title}
                    description={work.description}
                    dimensions={work.dimensions}
                    date={work.date}
                />
            ))}
        </Box>
    );

    if (loading) {
        return (
            <Box paddingBottom={{ xs: "64px", md: "128px" }} bgcolor="background.paper">
                <Box textAlign="center" paddingTop={{ xs: "40px", md: "80px" }} paddingBottom={{ xs: "30px", md: "60px" }}>
                    <Typography component="h2" fontSize={{ xs: "24px", md: "36px" }} fontWeight="700">
                        Примеры наших работ
                    </Typography>
                </Box>
                <Box display="grid" gridTemplateColumns={GRID_COLS} gap={{ xs: "16px", sm: "20px", md: "24px" }} padding={{ xs: "0px 4%", md: "0px 5%" }}>
                    {[1, 2, 3].map((i) => <ExampleWorkCardSkeleton key={i} />)}
                </Box>
            </Box>
        );
    }

    if (error) {
        return (
            <Box paddingBottom={{ xs: "64px", md: "128px" }} bgcolor="background.paper">
                <Box textAlign="center" paddingTop={{ xs: "40px", md: "80px" }} paddingBottom={{ xs: "30px", md: "60px" }}>
                    <Typography component="h2" fontSize={{ xs: "24px", md: "36px" }} fontWeight="700">
                        Примеры наших работ
                    </Typography>
                </Box>
                <Box padding="0px 4%">
                    <Alert severity="error">Ошибка загрузки данных: {error}</Alert>
                </Box>
            </Box>
        );
    }

    return (
        <Box paddingBottom={{ xs: "64px", md: "128px" }} bgcolor="background.paper">
            <Box textAlign="center" paddingTop={{ xs: "40px", md: "80px" }} paddingBottom={{ xs: "30px", md: "60px" }}>
                <Typography component="h2" fontSize={{ xs: "24px", md: "36px" }} fontWeight="700">
                    Примеры наших работ
                </Typography>
            </Box>

            {examplesWork.length === 0 ? (
                <EmptyState message="Примеры работ не найдены" variant="default" height={300} />
            ) : (
                <>
                    {grid}

                    {totalPages > 1 && (
                        <PaginationStack>
                            <ExamplesPagination
                                count={totalPages}
                                page={page}
                                onChange={handlePageChange}
                                size="large"
                                shape="rounded"
                            />
                        </PaginationStack>
                    )}
                </>
            )}
        </Box>
    );
};

export default GranitExamplesOurWork;
