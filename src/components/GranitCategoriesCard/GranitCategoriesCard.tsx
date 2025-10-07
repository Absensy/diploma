import { Box, Typography } from "@mui/material"
import { MonumentCategoryCard } from "../MonumentCategoriesCard/MonumentCategoriesCard"
import data from '@/mocks/MonumentCategories.json';
import { DividerWithIcon } from "../GranitDividerWithIcon/GranitDividerWithIcon";


const GranitCategoriesCard = () => { 
    return (
        <Box paddingTop="80px">
          <Typography component="h2" fontWeight="bold" fontSize="48px" textAlign="center">
            Наш каталог
          </Typography>
          <DividerWithIcon />
            <Box mx="80px" mb="80px" display='grid' gridTemplateColumns='repeat(3, 30%)' gap="68px" justifyContent='center'>
            {data.monumentCategories.map((c) => (
                    <MonumentCategoryCard 
                    key={c.id}
                    name={c.name} 
                    price={c.price} 
                    image={c.image} 
                    discount={c.discount}
                    />
            ))}
            </Box>
        </Box>
    )
}

export default GranitCategoriesCard;