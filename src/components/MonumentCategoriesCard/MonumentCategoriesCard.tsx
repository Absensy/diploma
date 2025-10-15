import React from 'react';
import { CategoryCard, DiscountBadge } from './MonumentCategoriesCard.styles';
import { MonumentCategoryCardProps } from './MonumentCategoriesCard.styles';
import CatalogButton from '../GranitCatalogButton/GranitCatalogButton';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';

export const MonumentCategoryCard: React.FC<MonumentCategoryCardProps> = ({ name, price, image, discount }) => {

    return (
        <CategoryCard>
            <Box height={420} position="relative" display="block">
                {discount ? <DiscountBadge>-{discount}%</DiscountBadge> : null}
                <Image src={image} alt={name} fill sizes="100%" style={{ objectFit: 'cover' }} />
            </Box>
            <Box padding="24px" display="flex" flexDirection="column">
                <Typography variant="h3" fontSize="24px" fontWeight="700" color="text.primary">{name}</Typography>
                <Typography padding="24px 0px" fontSize="30px" fontWeight="800" color="text.primary">от {price} BYN</Typography>
                <CatalogButton />
            </Box>
        </CategoryCard>
    );
};