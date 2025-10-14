import { Box, Stack, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';

const GranitCatalogHeader = () => {
    return (
          <Box >
               <Typography variant="h6" fontWeight="700" fontSize="30px" color="text.primary" >
                    Каталог мемориальных памятников
               </Typography>
               <Typography fontSize="16px" color="#9A9DA4" maxWidth="550px">
                    Откройте для себя нашу коллекцию почтенных и элегантных мемориальных памятников.
               </Typography>
          </Box>
    )
}    
export default GranitCatalogHeader;