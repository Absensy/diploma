'use client'

import { Grid, Pagination, Stack, styled } from "@mui/material";

export const GridOurCatalog = styled(Grid)(({ theme }) => ({
     justifyContent: 'center',
    margin:'0px 80px',
    [theme.breakpoints.down("xl")]: {
        margin:'0px 40px',
    },
    [theme.breakpoints.down("md")]: {
        margin:'0px',
    }
}));

export const CatalogSectionPagination = styled(Pagination)(({ theme }) => ({
    '& .MuiPaginationItem-root': {
        color: theme.palette.grey[700],
        fontWeight: 500,
        '&.Mui-selected': {
            backgroundColor: '#000000',
            color: '#ffffff',
            borderRadius: 8,
            '&:hover': {
                backgroundColor: '#000000',
                color: '#ffffff',
            },
        },
        '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
        },
    },
    [theme.breakpoints.down('sm')]: {
        '& .MuiPaginationItem-root': {
            minWidth: 32,
            height: 32,
            margin: '0 2px',
        },
    },
}));

export const CatalogPaginationStack = styled(Stack)(({ theme }) => ({
    alignItems: 'center',
    paddingTop: '40px',
    paddingBottom: '80px',
    [theme.breakpoints.down('md')]: {
        paddingTop: '24px',
        paddingBottom: '40px',
    },
}));
