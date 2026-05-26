'use client';

import * as React from 'react';
import { Badge, Box } from '@mui/material';
import { CatalogButtonStyles } from './GranitCatalogButton.styles';
import ShoppingCartIcon from '@/icons/ShoppingCart';
import { useCart } from '@/contexts/CartContext';

interface CatalogButtonProps {
  categoryId?: number;
}

const CatalogButton: React.FC<CatalogButtonProps> = () => {
  const { openCart, totalItems } = useCart();

  return (
    <CatalogButtonStyles variant="contained" onClick={openCart}>
      <Box
        component="span"
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '10px',
          whiteSpace: 'nowrap',
        }}
      >
        <Box component="span" sx={{ fontSize: '16px', fontWeight: 400 }}>
          Открыть корзину
        </Box>
        <Badge
          badgeContent={totalItems > 0 ? totalItems : undefined}
          sx={{
            '& .MuiBadge-badge': {
              backgroundColor: '#e53935',
              color: '#fff',
              fontSize: '10px',
              minWidth: '16px',
              height: '16px',
              padding: '0 4px',
              top: -4,
              right: -4,
            },
          }}
        >
          <ShoppingCartIcon />
        </Badge>
      </Box>
    </CatalogButtonStyles>
  );
};

export default CatalogButton;
