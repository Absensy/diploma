import { Box, Typography } from "@mui/material"
import { MonumentCategoryCard } from "../MonumentCategoriesCard/MonumentCategoriesCard"
import data from '@/mocks/MonumentCategories.json';
import { DividerWithIcon } from "../GranitDividerWithIcon/GranitDividerWithIcon";

const GranitOurCatagol = () => {
  return (
    <Box paddingTop={{ xs: "40px", md: "80px" }} paddingX={{ xs: "4%", md: "5%" }}>
      <Typography component="h2" fontWeight="bold" fontSize={{ xs: "24px", sm: "30px", md: "48px" }} textAlign="center">
        Наш каталог
      </Typography>
      <DividerWithIcon />
      <Box
        display="grid"
        gridTemplateColumns={{
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)"
        }}
        gap={{ xs: "16px", sm: "20px", md: "24px" }}
        paddingTop={{ md: "40px", lg: "80px" }}
        paddingBottom={{ xs: "40px", lg: "80px" }}
      >
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

export default GranitOurCatagol;