'use client'
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export interface MonumentCategoryCardProps {
    name: string;
    price: number;
    image: string;
    discount?: number;
}

export const Card = styled(Box)(({ theme }) => ({
    justifySelf: 'center',
    width: '500px',
    borderRadius: 16,
    backgroundColor: '#fff',
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid rgba(0,0,0,0.06)',
}));

export const DiscountBadge = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#ff5252',
    color: '#fff',
    borderRadius: 5,
    padding: '4px 10px',
    fontSize: '36px',
    fontWeight: 600,
    zIndex: 1,
}));