'use client'
import { styled } from "@mui/material/styles";
import { Button } from "@mui/material";

export const GranitCatalogFilterButtonStyle = styled(Button) (({ theme }) => ({
     gap: '10px',
     fontSize: "14px",
     display: "none",
     backgroundColor: '#FFFFFF',
     color: '#0A0A0A',
     borderStyle: 'solid',
     borderRadius: '10px',
     borderWidth: '1px',
     borderColor:'#E5E7EB',
     textTransform: 'none',
     padding: '8px 16px',
     boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.2)',
//     '&:hover': {
//       backgroundColor: '#5E5D5D',
//       boxShadow: 'none',
//     },
//     '&:active': {
//       backgroundColor: '#000000',
//       boxShadow: 'none',
//     },
//     '&:focus': {
//       backgroundColor: '#5E5D5D',
//       boxShadow: 'none'
//      },

     [theme.breakpoints.down("md")]: {
          display: "flex"
     },
     [theme.breakpoints.down("sm")]: {
          display: "flex",
          gap: '8px',
          padding: '8px 12px',
     }
}))

export default GranitCatalogFilterButtonStyle