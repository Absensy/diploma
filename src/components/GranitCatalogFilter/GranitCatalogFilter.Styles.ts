'use client'
import styled from "@emotion/styled";
import { Typography } from "@mui/material";
import { SxProps, Theme } from '@mui/material/styles';

export const TypographyWrapStyles = styled(Typography) (({ theme }) => ({
     whiteSpace: 'normal', 
     fontSize: '16px',
     overflowWrap: 'break-word',
}))