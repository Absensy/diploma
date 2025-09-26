import * as React from 'react';
import Button from '@mui/material/Button';

const FilterButton = () => {
    return (
        <Button variant="contained" disableElevation
          sx={{
            // Buttons Default State (обычное состояние)
            backgroundColor: '#2c2c2c',
            color: '#ffffff',
            borderRadius: '8px',
            textTransform: 'none',
            padding: '10px 48px',
            boxShadow: 'none',
            // Buttons Hover State (при наведении)
            '&:hover': {
              backgroundColor: '#5E5D5D',
              boxShadow: 'none',
            },
            // Buttons Pressed State (при нажатии)
            '&:active': {
              backgroundColor: '#000000',
              boxShadow: 'none',
            },
            // Buttons Focused State (в фокусе)
            '&:focus': {
              backgroundColor: '#5E5D5D',
              boxShadow: 'none',
            },
          }}
        >
        Применить фильтр
        </Button>
    )
}

export default FilterButton;
