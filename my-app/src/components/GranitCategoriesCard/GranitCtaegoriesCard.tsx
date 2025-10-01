import { Box } from "@mui/material"
import { MonumentCategoryCard } from "../MonumentCategoriesCard/MonumentCategoriesCard"
import data from '@/mocks/MonumentCategories.json';


const GranitCategoriesCard = () => { 
    return (
        <Box mb="80px" display='grid' gridTemplateColumns='repeat(3, 30%)' gap={3} justifyContent='center'>
            {data.monumentCategories.map((c) => (
                <Box key={c.name}>
                    <MonumentCategoryCard name={c.name} price={c.price} image={c.image} discount={c.discount} />
                </Box>
            ))}
        </Box>
    )
}

export default GranitCategoriesCard;