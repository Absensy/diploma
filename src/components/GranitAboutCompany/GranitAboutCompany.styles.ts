'use client'

import { Grid, Stack, Box, styled, Typography } from "@mui/material";

export const TitleAboutCompany = styled(Typography)(({ theme }) => ({
    fontWeight: '700',
    fontSize: '36px',
    color: theme.palette.primary.main,
    paddingBottom: '60px',
    [theme.breakpoints.down("md")]: {
    textAlign: 'center',
    fontSize: '24px',
    paddingBottom: '24px',
    },
}));

export const GridAboutCompany = styled(Grid)(({ theme }) => ({
    width: 'auto',
    height: 'auto',
    justifyContent: 'space-between',
    background: theme.palette.background.paper, 
    margin: '80px',
    [theme.breakpoints.down("md")]: {   
        justifyContent: 'center',
        margin: '50px',
        direction: 'row',
    }
}));

export const GridLeftCol = styled(Grid)(({ theme }) => ({
    minWidth: '450px',
    maxWidth: '700px',
    height: '400px',
    paddingRight: '80px',
    [theme.breakpoints.down("md")]: {
        justifyContent: 'center',
        size: 'auto', 
        paddingRight: '0px',
        height: 'auto',
    }
}));

export const StackStats = styled(Stack)(({ theme }) => ({
    [theme.breakpoints.down("md")]: {
        justifyContent: 'space-between',
    }
}));

export const BoxImage = styled(Box)(({ theme }) => ({
    display: 'flex',
    borderRadius: '2px',
    [theme.breakpoints.down("md")]: {
        justifyContent: 'center',
    }

}));




