"use client";

import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import LogoGranitPrimary2Icon from '@/icons/LogoGranitPrimary2';
import { Grid } from '@mui/material';

const Footer = () => {
  return (
    <Box component="footer" bgcolor="common.black" padding="40px 80px">
      <Container maxWidth={false} disableGutters>
        <Grid container>
          <Grid display="flex" justifyContent="left" alignItems="center">
            <Stack spacing="8px" width="395px">
              <Stack flexDirection="row" alignItems="center" marginBottom="16px">
              <LogoGranitPrimary2Icon />
              <Typography variant="h6" fontWeight="700" fontSize="24px" color="common.white" marginLeft="16px">Гранит памяти</Typography>
              </Stack>
              <Typography variant="body2" fontWeight="400" fontSize="16px" color="common.white">
              Сохраняем память о ваших близких в граните на века
              </Typography>
            </Stack>
          </Grid>

          <Grid display="flex" justifyContent="center" alignItems="center">
            <Stack spacing="8px" width="400px" marginLeft="28px">
              <Typography variant="subtitle2" fontWeight="600" fontSize="20px" color="common.white" marginBottom="16px">Контакты</Typography>
              <Link href="tel:+375297082111" underline="none" fontWeight="400" fontSize="16px" color="common.white">+375(29)708-21-11</Link>
              <Link href="mailto:info@granite-memory.by" underline="none" fontWeight="400" fontSize="16px" color="common.white">info@granite-memory.by</Link>
              <Typography variant="body2" fontWeight="400" color="common.white">пр.Янки Купалы 22а, цокольный этаж</Typography>
            </Stack>          
          </Grid>

          <Grid display="flex" justifyContent="right" alignItems="center" size="grow" >
            <Stack spacing="8px" width="280px">
              <Typography variant="subtitle2" fontWeight="600" fontSize="20px" color="common.white" marginBottom="16px">Правовая информация</Typography>
              <Typography variant="body2" fontWeight="400" fontSize="16px" color="common.white">ООО "Гранит Памяти"</Typography>
              <Typography variant="body2" fontWeight="400" fontSize="16px" color="common.white">ИНН: 1234567890</Typography>
              <Typography variant="body2" fontWeight="400" fontSize="16px" color="common.white">Лицензия на ритуальные услуги</Typography>
            </Stack>
          </Grid>
        </Grid>

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

