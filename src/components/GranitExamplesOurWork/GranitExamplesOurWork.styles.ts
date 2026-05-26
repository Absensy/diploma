'use client'
import { styled } from '@mui/material/styles'
import { Pagination, Stack } from '@mui/material'

export const ExamplesPagination = styled(Pagination)(({ theme }) => ({
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
}))

export const PaginationStack = styled(Stack)(({ theme }) => ({
    alignItems: 'center',
    marginTop: '48px',

    [theme.breakpoints.down('md')]: {
        marginTop: '32px',
    },
}))
