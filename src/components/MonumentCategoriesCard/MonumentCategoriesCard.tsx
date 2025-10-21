import React from 'react';
import { CategoryCard, DiscountBadge } from './MonumentCategoriesCard.styles';
import { MonumentCategoryCardProps } from './MonumentCategoriesCard.styles';
import CatalogButton from '../GranitCatalogButton/GranitCatalogButton';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';

export const MonumentCategoryCard: React.FC<MonumentCategoryCardProps> = ({ name, price, image, discount, categoryId }) => {

    return (
        <CategoryCard>
            <Box height="250px" position="relative" display="block">
                {discount ? <DiscountBadge>-{discount}%</DiscountBadge> : null}
                <Image src={image} alt={name} fill sizes="100%" style={{ objectFit: 'cover' }} />
            </Box>
            <Box padding={{ xs: "16px", md: "24px" }} display="flex" flexDirection="column" flex="1">
                <Typography variant="h3" fontSize={{ xs: "18px", md: "24px" }} fontWeight="700" color="text.primary">{name}</Typography>
                <Typography padding={{ xs: "12px 0px", md: "24px 0px" }} fontSize={{ xs: "24px", md: "30px" }} fontWeight="800" color="text.primary">
                    от {price} BYN
                </Typography>
                <Box marginTop="auto">
                    <CatalogButton categoryId={categoryId} />
                </Box>
            </Box>
        </CategoryCard>
    );
};