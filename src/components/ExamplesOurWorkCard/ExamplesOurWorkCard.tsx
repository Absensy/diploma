import React from "react";
import { ExamplesOurWorkCardProps, ExamplesWorkCard } from "./ExamplesOurWorkCard.styles";
import { Box, Typography, Divider } from "@mui/material";
import Image from "next/image";

const ExamplesOurWorkCard: React.FC<ExamplesOurWorkCardProps> = ({ image, title, material, dimensions, date }) => {
    return (
        <ExamplesWorkCard>
            <Box>
                <Image src={image} alt={title} width={384} height={192}/>
            </Box>
            <Box>
                <Typography fontSize="24px" fontWeight="600" padding="10px 20px">{title}</Typography>
                <Box padding="0px 20px" paddingBottom="20px">
                <Divider style={{ backgroundColor: '#ccc', height: '1px', border: 'none' }} /> 
                </Box>
                <Box display="flex" justifyContent="space-between" padding="0px 20px" paddingBottom="16px">
                    <Box color="text.secondary" textAlign="left">
                        <Typography  fontSize="16px" fontWeight="400">Материал: </Typography>
                        <Typography  fontSize="16px" fontWeight="400">Размеры: </Typography>
                        <Typography  fontSize="16px" fontWeight="400">Дата установки: </Typography>
                    </Box>
                    <Box color="text.primary" textAlign="right">
                        <Typography fontSize="16px" fontWeight="500">{material}</Typography>
                        <Typography fontSize="16px" fontWeight="500">{dimensions}</Typography>
                        <Typography fontSize="16px" fontWeight="500">{date}</Typography>
                    </Box>
                </Box>
            </Box>
        </ExamplesWorkCard>
    )
}

export default ExamplesOurWorkCard;