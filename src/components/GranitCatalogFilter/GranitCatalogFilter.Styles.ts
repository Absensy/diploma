'use client'
import { styled } from '@mui/material/styles';
import { Typography, Box } from "@mui/material";

export const TypographyWrapStyles = styled(Typography) (({ theme }) => ({
     whiteSpace: 'normal', 
     fontSize: '16px',
     overflowWrap: 'break-word',

}));

export const FilterBox = styled(Box) (({theme})=> ({
     [theme.breakpoints.down('md')]: {
          display: 'none',
        },
}))