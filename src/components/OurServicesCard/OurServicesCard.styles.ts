'use client';

import { styled } from '@mui/material/styles';
import { Grid } from '@mui/material';

export interface OurServicesCardProps {
    image: string;
    name: string;
    subtext: string;
}

export const ServicesCard = styled(Grid)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    width: '395px',
    height: '302px',
    borderRadius: "16px", 
    textAlign: 'center',
    justifyContent: 'space-around',
    transition: 'background-color 0.2s',
    boxShadow: '0 25px 50px 0 rgba(0, 0, 0, 0.08)',
    '&:hover': {
        backgroundColor: '#f3f3f3',
    },
}));
