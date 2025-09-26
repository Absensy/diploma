import styled from "@emotion/styled";
import Button from "@mui/material/Button";

export const CatalogButtonStyles = styled(Button)(({ theme }) => ({
           // Buttons Default State (обычное состояние)
           backgroundColor: '#2c2c2c',
           color: '#ffffff',
           borderRadius: '8px',
           textTransform: 'none',
           padding: '10px 20px',
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
}))

export default CatalogButtonStyles;