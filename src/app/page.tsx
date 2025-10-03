import { Box } from '@mui/material';
import GranitAboutCompany  from '@/components/GranitAboutCompany/GranitAboutCompany';
import GranitCategoriesCard from '@/components/GranitCategoriesCard/GranitCategoriesCard';
import GranitOurServices from '@/components/GranitOurServices/GranitOurServices';


export default function Home() {
  return (
      <Box margin="0px 80px">
        <GranitCategoriesCard />
        <GranitAboutCompany />
        <GranitOurServices />
      </Box>
  );
}

