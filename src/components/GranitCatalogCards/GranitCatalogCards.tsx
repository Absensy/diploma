"use client"
import { Box, Typography, Grid } from "@mui/material";
import data from "@/mocks/CatalogCards.json";
import {GranitCatalogCard} from "../GranitCatalogCard/GranitCatalogCard";
import { Pagination, Stack } from '@mui/material';
import {PaginationStyles, Ctatalogbox, StackStyle, TypographyStyle } from "./GranitCatalogCard.Styles";
import GranitCatalogFilterButton  from "../GranitCatalogFilterButton/GranitCatalogFilterButton";
import GranitShowMoreButton from "../GranitShowMoreButton/GranitShowMoreButton";

const GranitCatalogCards = () => {
    return (
        <Ctatalogbox>
            <Box display="flex" alignItems="center" justifyContent="space-between" marginBottom="32px">            
                <Typography fontSize="16px" color="#9A9DA4">
                Показано {} результатов
                </Typography>
                <GranitCatalogFilterButton></GranitCatalogFilterButton>
            </Box>

            <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(280px, 1fr))" gap="20px">
                {data.CatalogCards.map((card) => (
                    <Box key={card.id}>
                        <GranitCatalogCard
                            name={card.name}
                            subtext={card.subtext}
                            price={card.price}
                            oldPrice={card.oldPrice}
                            image={card.image}
                            discount={card.discount}
                        />
                    </Box>
                ))}
            </Box>
            <StackStyle  spacing={2}>
                <PaginationStyles count={4} size="large" page={1} shape="rounded">
                </PaginationStyles>
            </StackStyle>
            <Box display='flex' flexDirection='column' alignItems='center'>            
                <GranitShowMoreButton></GranitShowMoreButton>
                <TypographyStyle>Показано {} из {} товаров</TypographyStyle>
            </Box>
        </Ctatalogbox>
    );
}
    
export default GranitCatalogCards;