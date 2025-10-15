import React from "react";
import { OurServicesCardProps, ServicesCard } from "./OurServicesCard.styles";
import { Box, Typography } from "@mui/material";
import Image from "next/image";

const OurServicesCard: React.FC<OurServicesCardProps> = ({ image, name, subtext }) => {
    return (
        <ServicesCard>
            <Box paddingTop="50px">
                <Image src={image} alt={name} width={64} height={64}/>
            </Box>
            <Box>
                <Typography fontSize="24px" fontWeight="600" padding="15px 18px">{name}</Typography>
                <Typography fontSize="16px" fontWeight="400" color="text.secondary" padding="0px 40px" paddingBottom="30px">{subtext}</Typography>
            </Box>
        </ServicesCard>
    )
}

export default OurServicesCard;