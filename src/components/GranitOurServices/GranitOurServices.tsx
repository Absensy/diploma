import { Box, Typography } from "@mui/material"
import OurServicesCard from "../OurServicesCard/OurServicesCard";
import data from '@/mocks/OurServices.json';

const GranitOurServices = () => {
    return (
        <Box padding="80px">
            <Box>
                <Typography variant="h2" fontSize="36px" fontWeight="700" textAlign="center" paddingBottom="60px" >Наши услуги</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
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