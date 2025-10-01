"use client";

import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import LogoGranitPrimary2Icon from '@/icons/logoGranitPrimary2';

const Footer = () => {
  return (
    <Box component="footer" bgcolor="common.black" padding="40px 80px">
      <Container maxWidth={false} disableGutters>
        <Stack direction="row" justifyContent="space-between">
          <Stack spacing="11px" minWidth="360px">
            <Stack direction="row" alignItems="center" spacing="16px">
              <LogoGranitPrimary2Icon />
              <Typography variant="h6" fontWeight="700" fontSize="24px" color="common.white">Гранит памяти</Typography>
            </Stack>
            <Typography variant="body2" fontWeight="400" fontSize="16px" color="common.white">
              Сохраняем память о ваших близких в граните на века
            </Typography>
          </Stack>

          <Stack spacing="11px" minWidth="300px">
            <Typography variant="subtitle2" fontWeight="600" fontSize="20px" color="common.white">Контакты</Typography>
            <Link href="tel:+375297082111" underline="none" fontWeight="400" fontSize="16px" color="common.white">+375(29)708-21-11</Link>
            <Link href="mailto:info@granite-memory.by" underline="none" fontWeight="400" fontSize="16px" color="common.white">info@granite-memory.by</Link>
            <Typography variant="body2" fontWeight="400" color="common.white">пр.Янки Купалы 22а, цокольный этаж</Typography>
          </Stack>

          <Stack spacing="11px" minWidth="320px">
            <Typography variant="subtitle2" fontWeight="600" fontSize="20px" color="common.white">Правовая информация</Typography>
            <Typography variant="body2" fontWeight="400" fontSize="16px" color="common.white">ООО "Гранит Памяти"</Typography>
            <Typography variant="body2" fontWeight="400" fontSize="16px" color="common.white">ИНН: 1234567890</Typography>
            <Typography variant="body2" fontWeight="400" fontSize="16px" color="common.white">Лицензия на ритуальные услуги</Typography>
          </Stack>
        </Stack>

        <Box marginTop={4}>
          <Divider/>
        </Box>

        <Stack marginTop="33px" alignItems="center">
          <Typography variant="caption" color="common.white">© {new Date().getFullYear()} Гранит памяти. Все права защищены.</Typography>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;

