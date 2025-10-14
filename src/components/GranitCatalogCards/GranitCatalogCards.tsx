"use client"
import { Box, Typography, Grid } from "@mui/material";
import data from "@/mocks/CatalogCards.json";
import {GranitCatalogCard} from "../GranitCatalogCard/GranitCatalogCard";
import { Pagination, Stack } from '@mui/material';
import {PaginationStyles} from "./GranitCatalogCard.Styles";

const GranitCatalogCards = () => {
    return (
        <Box>
            <Typography fontSize="16px" color="#9A9DA4" marginBottom="24px">
                Показано {} результатов
            </Typography>
            <Box display="grid" gridTemplateColumns="repeat(3, minmax(280px, 3fr))" gap="20px">
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
            <Stack spacing={2} alignItems="center" marginTop="20px">
                <PaginationStyles count={4} size="large" page={1} shape="rounded">
                </PaginationStyles>
            </Stack>
        </Box>
    );
}
    
export default GranitCatalogCards;