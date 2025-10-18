import { Box, Typography } from "@mui/material"
import OurServicesCard from "../OurServicesCard/OurServicesCard";
import data from '@/mocks/OurServices.json';
import { GridOurServices } from "./GranitOurServices.styles";

const GranitOurServices = () => {
    return (
        <Box padding={{ xs: "40px 4%", md: "80px 5%" }}>
            <Box>
                <Typography fontSize={{ xs: "24px", md: "36px" }} fontWeight="700" textAlign="center" margin={{ xs: "0px 0px 40px 0px", md: "0px 0px 60px 0px" }}>Наши услуги</Typography>
            </Box>
            <Box
                display="grid"
                gridTemplateColumns={{
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)"
                }}
                gap={{ xs: "16px", sm: "20px", md: "24px" }}
                justifyContent="center"
            >
                {data.ourServices.map((c) => (
                    <OurServicesCard
                        key={c.id}
                        image={c.image}
                        name={c.name}
                        subtext={c.subtext}
                    />
                ))}
            </Box>
        </Box>
    )
}

export default GranitOurServices;