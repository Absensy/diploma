import { Box } from '@mui/material';
import GranitAboutCompany from '@/components/GranitAboutCompany/GranitAboutCompany';
import GranitCategoriesCard from '@/components/GranitOurCatagol/GranitOurCatagol';
import GranitOurServices from '@/components/GranitOurServices/GranitOurServices';
import GranitExamplesOurWork from '@/components/GranitExamplesOurWork/GrintExamplesOurWork';
import GranitContacts from '@/components/GranitContacts/GranitContacts';

export default function Home() {
  return (
    <Box>
      <GranitCategoriesCard />
      <GranitAboutCompany />
      <GranitOurServices />
      <GranitExamplesOurWork />
      <GranitContacts />
    </Box>
  );
}

