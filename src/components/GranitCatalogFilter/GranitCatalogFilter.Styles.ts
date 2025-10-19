'use client'
import { styled } from '@mui/material/styles';
import { Typography, Box } from "@mui/material";

export const TypographyWrapStyles = styled(Typography) (({ theme }) => ({
     whiteSpace: 'normal', 
     fontSize: '16px',
     overflowWrap: 'break-word',

}));

export const FilterBox = styled(Box) (({theme})=> ({
     position: 'sticky',
     top: '20px',
     alignSelf: 'flex-start',
     maxHeight: 'calc(100vh - 80px)',
     overflowY: 'auto',
     marginLeft: '80px',
     marginBottom: '80px',
     
     [theme.breakpoints.down('md')]: {
          display: 'none',
        },
}))