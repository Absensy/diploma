import { Box, Typography } from "@mui/material";
import { CatalogCardProps, CategoryCard, DiscountBadge, PriceContainer, OldPrice, CardActions, PopularBadge, NewBadge, StatusBadge } from "./GranitCatalogCard.Styles"
import DetailsButton from "../GranitDetailsButton/GranitDetailsButton"
import Image from "next/image";
import ProductModal from "../ProductModal/ProductModal";
import { useState } from "react";
import { Product } from "@/lib/db";
import { styled } from "@mui/material/styles";

export const GranitCatalogCard: React.FC<CatalogCardProps> = ({ name, price, oldPrice, image, discount, subtext, is_new, is_popular, product }) => {
    const [modalOpen, setModalOpen] = useState(false);

    const handleDetailsClick = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    // Динамический стиль для NewBadge в зависимости от наличия PopularBadge
    const DynamicNewBadge = styled(StatusBadge)(({ theme }) => ({
        backgroundColor: '#2196f3',
        top: is_popular ? 40 : 8, // Если есть PopularBadge, то ниже, иначе вверху
        left: 8,
    }));

    return (
        <>
            <CategoryCard>
                <Box height={{ xs: "200px", sm: "210px", md: "220px" }} position="relative" display="block" minHeight="200px">
                    {discount ? <DiscountBadge>-{discount}%</DiscountBadge> : null}
                    {is_popular && <PopularBadge>Популярное</PopularBadge>}
                    {is_new && <DynamicNewBadge>Новинка</DynamicNewBadge>}
                    <Image src={image} alt={name} fill sizes="100%" style={{ objectFit: 'cover' }} />
                </Box>
                <Box padding="20px" display="flex" flexDirection="column" flex={1} justifyContent="space-between">
                    <Typography variant="h3" fontSize="20px" fontWeight="700" color="text.primary" marginBottom="8px">
                        {name}
                    </Typography>
                    <Typography fontSize="14px" color="text.secondary" lineHeight="1.4">
                        {subtext}
                    </Typography>
                    <PriceContainer>
                        {oldPrice && <OldPrice>{oldPrice} BYN</OldPrice>}
                        <Typography fontSize="20px" fontWeight="700" color={oldPrice ? "#ff5252" : "text.primary"} >
                            {price} BYN
                        </Typography>
                    </PriceContainer>
                    <CardActions>
                        <DetailsButton onClick={handleDetailsClick} />
                    </CardActions>
                </Box>
            </CategoryCard>

            {product && (
                <ProductModal
                    open={modalOpen}
                    onClose={handleCloseModal}
                    product={product}
                />
            )}
        </>
    );
};