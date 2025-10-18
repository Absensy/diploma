import { Box, Typography } from "@mui/material"
import OurServicesCard from "../OurServicesCard/OurServicesCard";
import data from '@/mocks/OurServices.json';
import { GridOurServices } from "./GranitOurServices.styles";

const GranitOurServices = () => {
    return (
        <Box margin={{xs: "15px", md: "80px"}}>
            <Box>
                <Typography fontSize={{xs: "24px",  md: "36px"}} fontWeight="700" textAlign="center" margin={{xs: "48px 0px", md: "60px 0px"}} >Наши услуги</Typography>
            </Box>
            <GridOurServices container spacing="24px">
            {data.ourServices.map((c) => (
                <OurServicesCard
                key={c.id}
                image={c.image}
                name={c.name}
                subtext={c.subtext}
                />
            ))}
            </GridOurServices>
        </Box>
    )
}

export default GranitOurServices;