"use client"
import { Box, Typography, Alert, Button } from "@mui/material";
import { GranitCatalogCard } from "../GranitCatalogCard/GranitCatalogCard";
import { PaginationStyles, Ctatalogbox, StackStyle, TypographyStyle, ShowMoreContainer } from "./GranitCatalogCard.Styles";
import MobileFilterDrawer from "../MobileFilterDrawer/MobileFilterDrawer";
import GranitShowMoreButton from "../GranitShowMoreButton/GranitShowMoreButton";
import { useFilteredProducts } from "@/hooks/useFilteredProducts";
import { useFilterContext } from "@/contexts/FilterContext";
import { usePagination } from "@/hooks/usePagination";
import { ProductCardSkeleton, Skeleton } from "../Skeleton/Skeleton";
import EmptyState from "../EmptyState/EmptyState";

const CATALOG_SCROLL_ID = 'catalog-top';

const GranitCatalogCards = () => {
    const { filters } = useFilterContext();
    const { products, loading, error, totalCount } = useFilteredProducts(filters);
    const {
        currentPage,
        totalPages,
        visibleItems,
        itemsPerPage,
        hasMoreItems,
        remainingItems,
        isExpanded,
        handlePageChange,
        handleShowMore,
        handleCollapse,
        isMobile,
    } = usePagination(totalCount, { scrollTargetId: CATALOG_SCROLL_ID });

    if (loading) {
        return (
            <Ctatalogbox>
                <Box display="flex" alignItems="center" justifyContent="space-between" marginBottom="32px">
                    <Skeleton height="20px" width="200px" />
                    <MobileFilterDrawer />
                </Box>
                <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(280px, 1fr))" gap="20px" justifyContent="center">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <ProductCardSkeleton key={i} />
                    ))}
                </Box>
            </Ctatalogbox>
        );
    }

    if (error) {
        return (
            <Ctatalogbox>
                <Alert severity="error">{error}</Alert>
            </Ctatalogbox>
        );
    }

    // Товары для текущей страницы: мобилка использует "Показать ещё", десктоп — постраничную навигацию
    const currentProducts = isMobile
        ? products.slice(0, visibleItems)
        : products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Функция для склонения слова "результат"
    const getResultText = (count: number) => {
        const lastDigit = count % 10;
        const lastTwoDigits = count % 100;

        if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
            return 'результатов';
        }
        if (lastDigit === 1) {
            return 'результат';
        }
        if (lastDigit >= 2 && lastDigit <= 4) {
            return 'результата';
        }
        return 'результатов';
    };

    return (
        <Ctatalogbox id={CATALOG_SCROLL_ID}>
            <Box display="flex" alignItems="center" justifyContent="space-between" marginBottom="32px">
                <Typography fontSize="16px" color="#9A9DA4">
                    Показано {isMobile ? Math.min(visibleItems, totalCount) : currentProducts.length} из {totalCount} {getResultText(totalCount)}
                </Typography>
                <MobileFilterDrawer />
            </Box>

            {products.length === 0 ? (
                <EmptyState
                    message="Товары не найдены"
                    variant="default"
                    height={200}
                />
            ) : (
                <>
                    <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(280px, 1fr))" gap="20px" justifyContent="center">
                        {currentProducts.map((product) => (
                            <Box key={product.id} display="flex" justifyContent="center">
                                <GranitCatalogCard
                                    name={product.name}
                                    subtext={product.short_description}
                                    price={product.discounted_price || product.price}
                                    oldPrice={product.discount ? product.price : undefined}
                                    image={product.image}
                                    discount={product.discount}
                                    is_new={product.is_new}
                                    is_popular={product.is_popular}
                                    product={product}
                                />
                            </Box>
                        ))}
                    </Box>

                    {/* Пагинация для десктопа */}
                    {!isMobile && totalPages > 1 && (
                        <StackStyle spacing={2}>
                            <PaginationStyles
                                count={totalPages}
                                size="large"
                                page={currentPage}
                                shape="rounded"
                                onChange={(_, page) => handlePageChange(page)}
                            />
                        </StackStyle>
                    )}

                    {/* Кнопка "Показать ещё" / "Свернуть" для мобилки */}
                    {isMobile && (hasMoreItems || isExpanded) && (
                        <ShowMoreContainer>
                            {hasMoreItems && (
                                <GranitShowMoreButton onClick={handleShowMore}>
                                    Показать ещё ({remainingItems})
                                </GranitShowMoreButton>
                            )}
                            {isExpanded && (
                                <Button
                                    onClick={handleCollapse}
                                    variant="outlined"
                                    sx={{
                                        display: { xs: 'flex', sm: 'none' },
                                        mt: hasMoreItems ? 1.5 : 0,
                                        borderRadius: '12px',
                                        textTransform: 'none',
                                        fontSize: '16px',
                                        padding: '14px 24px',
                                        borderColor: '#2c2c2c',
                                        color: '#2c2c2c',
                                        '&:hover': {
                                            borderColor: '#5E5D5D',
                                            backgroundColor: 'rgba(44, 44, 44, 0.05)',
                                        },
                                    }}
                                >
                                    Свернуть
                                </Button>
                            )}
                            <TypographyStyle>Показано {Math.min(visibleItems, totalCount)} из {totalCount} товаров</TypographyStyle>
                        </ShowMoreContainer>
                    )}
                </>
            )}
        </Ctatalogbox>
    );
};

export default GranitCatalogCards;