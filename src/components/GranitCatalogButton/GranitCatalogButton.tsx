import * as React from 'react';
import { CatalogButtonStyles } from './GranitCatalogButton.styles';
import ShoppingCartIcon from '@/icons/ShoppingCart';
import Typography from '@mui/material/Typography';

const CatalogButton = () => {
  return (
    <CatalogButtonStyles variant="contained">
    <Typography variant="body2" fontSize='16px' fontWeight='400' paddingRight='10px '>Открыть каталог</Typography>
    <ShoppingCartIcon/>
    </CatalogButtonStyles> 
  );
};

export default CatalogButton;