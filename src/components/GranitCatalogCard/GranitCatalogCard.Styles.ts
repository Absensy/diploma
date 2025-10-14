'use client'
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

import { Interface } from 'readline';

export interface CatalogCardProps{
     name: string;
     subtext: string;
     price: number;
     oldPrice?: number;
     image: string;
     discount?: number;
}

export const CategoryCard = styled(Box)(({ theme }) => ({
    justifySelf: 'center',
    width: '280px',
    height: '410px',
    borderRadius: 8,
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
    right: -2,
    backgroundColor: '#ff5252',
    color: '#fff',
    borderRadius: 4,
    padding: '6px 16px',
    fontSize: '32px',
    fontWeight: 600,
    zIndex: 1,
}));

export const FavoriteButton = styled(Box)(({ theme }) => ({
    bottom: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    '&:hover': {
        backgroundColor: '#e0e0e0',
    },
}));

export const PriceContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '16px',
}));

export const OldPrice = styled(Box)(({ theme }) => ({
    fontSize: '20px',
    color: '#9A9DA4',
    textDecoration: 'line-through',
}));

export const NewPrice = styled(Box)(({ theme }) => ({
    fontSize: '20px',
    fontWeight: 700,
    color: '#ff5252',
}));

export const CardActions = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '16px',
}));