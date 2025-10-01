import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { DividerWithIcon } from '../components/GranitDividerWithIcon/GranitDividerWithIcon';
import { AboutCompany } from '@/components/GranitAboutCompany/GranitAboutCompany';
import GranitCategoriesCard from '@/components/GranitCategoriesCard/GranitCtaegoriesCard';


export default function Home() {
  return (
    <>
      <Container maxWidth={false} disableGutters>
        <Box paddingTop="80px">
          <Typography component="h1" fontWeight="bold" fontSize="48px" textAlign="center">
            Наш каталог
          </Typography>
          <DividerWithIcon />
        </Box>
        <GranitCategoriesCard />
        <AboutCompany />  
      </Container>

    </>
  );
}

