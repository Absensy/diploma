import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import FilterButton from '@/components/GranitFilterButton/FilterButton';
import DetailsButtonStyles from "@/components/GranitDetailsButton/DetailsButton.Styles";
import LogoGranitPrimaryIcon from "@/icons/logoGranitPrimary2";


export default function Home() {
  return (
    <>
      <Container maxWidth="sm">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" textAlign='center'>
            Наш каталог
          </Typography>
        </Box>
      </Container>
    </>
  );
}

