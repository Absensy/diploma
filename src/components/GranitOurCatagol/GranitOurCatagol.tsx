import { Box, Typography, Grid } from "@mui/material"
import { MonumentCategoryCard } from "../MonumentCategoriesCard/MonumentCategoriesCard"
import data from '@/mocks/MonumentCategories.json';
import { DividerWithIcon } from "../GranitDividerWithIcon/GranitDividerWithIcon";
import { GridOurCatalog } from "./GranitOurCatalog";

const GranitOurCatagol = () => { 
    return (
        <Box paddingTop="80px">
          <Typography component="h2" fontWeight="bold" fontSize="48px" textAlign="center">
            Наш каталог
          </Typography>
          <DividerWithIcon />
            <GridOurCatalog container spacing={{ xs: "24px", md: "45px" }}>
            {data.monumentCategories.map((c) => (
                    <MonumentCategoryCard 
                    key={c.id}
                    name={c.name} 
                    price={c.price} 
                    image={c.image} 
                    discount={c.discount}
                    />
            ))}
            </GridOurCatalog>
        </Box>
    )
}

export default GranitOurCatagol;