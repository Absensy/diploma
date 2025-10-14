'use client'
import styled from "@emotion/styled";
import { Pagination } from "@mui/material";
import { SxProps, Theme } from '@mui/material/styles';

export const PaginationStyles = styled(Pagination) (({ theme }) => ({
         '& .MuiPaginationItem-root': {
             color: "grey.600", 
             "&.Mui-selected": {
                 backgroundColor: '#2C2C2C', 
                 color: 'white',
                 borderRadius:"8px"} 
             }
}));