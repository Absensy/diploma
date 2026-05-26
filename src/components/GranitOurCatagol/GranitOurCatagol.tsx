"use client"

import { useState, useEffect } from "react"
import { Box, Typography, Alert, useMediaQuery, useTheme } from "@mui/material"
import { MonumentCategoryCard } from "../MonumentCategoriesCard/MonumentCategoriesCard"
import { DividerWithIcon } from "../GranitDividerWithIcon/GranitDividerWithIcon";
import { useCategories } from '@/hooks/useCategories';
import { CategoryCardSkeleton } from "../Skeleton/Skeleton";
import EmptyState from "../EmptyState/EmptyState";
import { CatalogSectionPagination, CatalogPaginationStack } from "./GranitOurCatalog.styles";

const SECTION_ID = 'catalog';

const GranitOurCatagol = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // < 600px: 1 col
  // sm+ → 2 cols (sm-md) and 3 cols (md+), both fit 6 items per page (2 rows)
  const itemsPerPage = isMobile ? 3 : 6;

  const { categories, loading, error } = useCategories();
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [itemsPerPage]);

  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const currentItems = categories.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    if (typeof window === 'undefined') return;
    const section = document.getElementById(SECTION_ID);
    const top = section
      ? section.getBoundingClientRect().top + window.scrollY - 80
      : 0;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <Box paddingTop={{ xs: "40px", md: "80px" }} paddingX={{ xs: "4%", md: "5%" }}>
        <Typography component="h2" fontWeight="bold" fontSize={{ xs: "24px", sm: "30px", md: "48px" }} textAlign="center">
          Наш каталог
        </Typography>
        <DividerWithIcon />
        <Box
          display="grid"
          gridTemplateColumns={{ xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }}
          gap={{ xs: "16px", sm: "20px", md: "24px" }}
          paddingTop={{ md: "40px", lg: "80px" }}
          paddingBottom={{ xs: "40px", lg: "80px" }}
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <CategoryCardSkeleton key={i} />
          ))}
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box paddingTop={{ xs: "40px", md: "80px" }} paddingX={{ xs: "4%", md: "5%" }}>
        <Typography component="h2" fontWeight="bold" fontSize={{ xs: "24px", sm: "30px", md: "48px" }} textAlign="center">
          Наш каталог
        </Typography>
        <DividerWithIcon />
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box paddingTop={{ xs: "40px", md: "80px" }} paddingX={{ xs: "4%", md: "5%" }}>
      <Typography component="h2" fontWeight="bold" fontSize={{ xs: "24px", sm: "30px", md: "48px" }} textAlign="center">
        Наш каталог
      </Typography>
      <DividerWithIcon />

      {categories.length === 0 ? (
        <EmptyState message="Категории не найдены" variant="default" height={300} />
      ) : (
        <>
          <Box
            display="grid"
            gridTemplateColumns={{ xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }}
            gap={{ xs: "16px", sm: "20px", md: "24px" }}
            paddingTop={{ xs: "24px", md: "40px", lg: "60px" }}
          >
            {currentItems.map((category) => (
              <MonumentCategoryCard
                key={category.id}
                name={category.name}
                price={category.discounted_price ? Number(category.discounted_price) : Number(category.price_from)}
                image={category.photo}
                discount={category.discount || undefined}
                categoryId={category.id}
              />
            ))}
          </Box>

          {totalPages > 1 && (
            <CatalogPaginationStack>
              <CatalogSectionPagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                size="large"
                shape="rounded"
              />
            </CatalogPaginationStack>
          )}

          {/* Нет пагинации — сохраняем нижний отступ */}
          {totalPages <= 1 && (
            <Box paddingBottom={{ xs: "40px", lg: "80px" }} />
          )}
        </>
      )}
    </Box>
  );
};

export default GranitOurCatagol;
