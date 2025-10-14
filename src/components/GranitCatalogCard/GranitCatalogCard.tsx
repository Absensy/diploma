import { Box,Typography } from "@mui/material";
import {CatalogCardProps, CategoryCard, DiscountBadge, FavoriteButton, PriceContainer, OldPrice, CardActions} from "./GranitCatalogCard.Styles"
import  DetailsButton  from "../GranitDetailsButton/GranitDetailsButton"
import Image from "next/image";
import FavoriteCardIcon from "@/icons/FavoriteCard";

export const GranitCatalogCard: React.FC<CatalogCardProps> = ({ name, price, oldPrice, image, discount, subtext }) => {
    return (
        <CategoryCard>
            <Box height={280} position="relative" display="block">
                {discount ? <DiscountBadge>-{discount}%</DiscountBadge> : null}
                <Image src={image} alt={name} fill sizes="100%" style={{ objectFit: 'cover' }} />
            </Box>
            <Box padding="20px" display="flex" flexDirection="column" flex={1}>
                <Typography variant="h3" fontSize="20px" fontWeight="700" color="text.primary" marginBottom="8px">
                    {name}
                </Typography>
                <Typography fontSize="14px" color="text.secondary" lineHeight="1.4">
                    {subtext}
                </Typography>
                <PriceContainer>
                    {oldPrice && <OldPrice>{oldPrice} BYN</OldPrice>}
                    <Typography fontSize="20px"  fontWeight="700"  color={oldPrice ? "#ff5252" : "text.primary"} >
                        {price} BYN
                    </Typography>
                </PriceContainer>
                <CardActions>
                    <DetailsButton />
                    <FavoriteButton>
                        <FavoriteCardIcon />
                    </FavoriteButton>
                </CardActions>
            </Box>
        </CategoryCard>
    );
}