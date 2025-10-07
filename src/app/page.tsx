import { Box } from '@mui/material';
import GranitAboutCompany  from '@/components/GranitAboutCompany/GranitAboutCompany';
import GranitCategoriesCard from '@/components/GranitCategoriesCard/GranitCategoriesCard';
import GranitOurServices from '@/components/GranitOurServices/GranitOurServices';
import GranitExamplesOurWork from '@/components/GranitExamplesOurWork/GrintExamplesOurWork';

export default function Home() {
  return (
      <Box>
        <GranitCategoriesCard />
        <GranitAboutCompany />
        <GranitOurServices />
        <GranitExamplesOurWork />
      </Box>
  );
}

