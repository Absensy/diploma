'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import CircularProgress from '@mui/material/CircularProgress';
import LogoGranitPrimary2Icon from '@/icons/LogoGranitPrimary2';
import { Grid } from '@mui/material';
import { useContactContext } from '@/contexts/ContactContext';
import { GridFooter, StackFooter } from './Footer.styles';

const Footer = () => {
  const { contactInfo, loading } = useContactContext();

  if (loading) {
    return (
      <Box component="footer" bgcolor="common.black" padding={{ xs: "40px 4%", md: "40px 5%" }} display="flex" justifyContent="center">
        <CircularProgress sx={{ color: 'white' }} />
      </Box>
    );
  }

  return (
    <Box component="footer" bgcolor="common.black" padding={{ xs: "40px 4%", md: "40px 5%" }}>
      <Container maxWidth={false} disableGutters>
        <Box display="flex" flexDirection={{ xs: "column", md: "row" }} justifyContent="space-between" flexWrap="wrap" alignItems={{ xs: "flex-start", md: "center" }} gap={{ xs: "16px", md: "0px" }}>
          <Box>
            <StackFooter width={{ xs: "100%", md: "395px" }}>
              <Stack flexDirection="row" alignItems="center" marginBottom="16px">
                <LogoGranitPrimary2Icon />
                <Typography variant="h6" fontWeight="700" fontSize="24px" color="common.white" marginLeft="16px">Гранит памяти</Typography>
              </Stack>
              <Typography variant="body2" fontWeight="400" fontSize="16px" color="common.white">
                Сохраняем память о ваших близких в граните на века
              </Typography>
            </StackFooter>
          </Box>

          <Box>
            <StackFooter width={{ xs: "100%", md: "400px" }}>
              <Typography variant="subtitle2" fontWeight="600" fontSize="20px" color="common.white" marginBottom="16px">Контакты</Typography>
              <Link
                href={`tel:${contactInfo?.phone?.replace(/\s/g, '') || '+375297082111'}`}
                underline="none"
                fontWeight="400"
                fontSize="16px"
                color="common.white"
              >
                {contactInfo?.phone || '+375(29)708-21-11'}
              </Link>
              <Link
                href={`mailto:${contactInfo?.email || 'info@granite-memory.by'}`}
                underline="none"
                fontWeight="400"
                fontSize="16px"
                color="common.white"
              >
                {contactInfo?.email || 'info@granite-memory.by'}
              </Link>
              <Typography variant="body2" fontWeight="400" color="common.white">
                {contactInfo?.address || 'пр.Янки Купалы 22а, цокольный этаж'}
              </Typography>
            </StackFooter>
          </Box>

          <Box>
            <StackFooter width={{ xs: "100%", md: "280px" }}>
              <Typography variant="subtitle2" fontWeight="600" fontSize="20px" color="common.white" marginBottom="16px">Правовая информация</Typography>
              <Typography variant="body2" fontWeight="400" fontSize="16px" color="common.white">ООО "Гранит Памяти"</Typography>
              <Typography variant="body2" fontWeight="400" fontSize="16px" color="common.white">ИНН: 1234567890</Typography>
              <Typography variant="body2" fontWeight="400" fontSize="16px" color="common.white">Лицензия на ритуальные услуги</Typography>
            </StackFooter>
          </Box>
        </Box>

        <Box marginTop={4}>
          <Divider />
        </Box>

        <Stack marginTop="33px" alignItems="center">
          <Typography variant="caption" color="common.white">© {new Date().getFullYear()} Гранит памяти. Все права защищены.</Typography>
        </Stack>

      </Container>
    </Box>
  );
};

export default Footer;

