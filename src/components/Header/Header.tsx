'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import CatalogButton from '../GranitCatalogButton/GranitCatalogButton';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Badge from '@mui/material/Badge';
import { HeaderMenuButton } from './Header.styles';
import LogoGranitPrimaryIcon from '@/icons/logoGranitPrimary2';
import FavoriteShoppingIcon from '@/icons/favoriteShopping';
import GpsIcon from '@/icons/gps';
import TelIcon from '@/icons/tel';
import InstIcon from '@/icons/inst';
import GreenCheckIcon from '@/icons/greenCheck';
import LogoGranitPrimary1Icon from '@/icons/logoGranitPrimary1';
import ClocksIcon from '@/icons/clocks';


const Header = () => {
  return (
    <Box>
      {/* Верхняя часть Header */}
    <Box bgcolor="FFFFFF" borderBottom="1px solid #e6e6e7" padding="10px 80px">
      <Container maxWidth={false} disableGutters >
         <Stack direction="row" justifyContent="space-between">
           <Stack direction="row" alignItems="center">
             <LogoGranitPrimary1Icon />
             <Stack spacing={1} alignItems="flex-start" marginLeft="0" justifyContent="center" paddingLeft="17px">
               <Stack direction="row" spacing={1} alignItems="center">
                 <GpsIcon />
                 <Typography variant="body2" color="text.primary">
                   пр. Янки Купалы 22а, цокольный этаж
                 </Typography>
               </Stack>
               <Stack direction="row" spacing={1} alignItems="center">
                 <TelIcon />
                 <Typography variant="body2" color="text.primary">
                   +375 (29) 708-21-11
                 </Typography>
               </Stack>
               <Stack direction="row" spacing={1} alignItems="center">
                 <InstIcon />
                 <Typography variant="body2" color="text.primary">
                   granit.grodno
                 </Typography>
               </Stack>
             </Stack>
           </Stack>

           <Stack direction="row" spacing={2} alignItems="flex-start" paddingRight="10%">
             <Box paddingTop="3px">
               <ClocksIcon />
             </Box>
             <Stack textAlign="left">
               <Typography variant="subtitle2" fontWeight="600" fontSize="18px" color="text.primary">Режим работы</Typography>
               <Typography variant="body2" color="text.secondary">Пн-Пт: 9:00 - 18:00</Typography>
               <Typography variant="body2" color="text.secondary">Сб-Вс: 10:00 - 16:00</Typography>
             </Stack>
           </Stack>

           <Box bgcolor="#9a9da4" borderRadius="21px">
             <Stack spacing={1} alignItems="flex-start" padding="10px 24px">
               <Stack direction="row" spacing={1} alignItems="center">
                 <GreenCheckIcon />
                 <Typography variant="body2" color="#FFFFFF">Качество материалов</Typography>
               </Stack>
               <Stack direction="row" spacing={1} alignItems="center">
                 <GreenCheckIcon />
                 <Typography variant="body2" color="#FFFFFF">Индивидуальный подход</Typography>
               </Stack>
               <Stack direction="row" spacing={1} alignItems="center">
                 <GreenCheckIcon />
                 <Typography variant="body2" color="#FFFFFF">Гарантия и надёжность</Typography>
               </Stack>
             </Stack>
           </Box>
         </Stack>
       </Container>
     </Box>
     {/* Нижняя часть Header */}
    <Box bgcolor="#ffffff" boxShadow="0 4px 6px 0 rgba(0, 0, 0, 0.08)" padding="0px 80px">
    <AppBar position="sticky" color="inherit" elevation={0}>
      <Container maxWidth={false} disableGutters>
         <Toolbar disableGutters>
         <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} width="100%">
          {/* Левая часть: Логотип */}
          <Box display='flex' alignItems= 'center'>
            <LogoGranitPrimaryIcon />
            <Typography variant="h6" component="div" fontWeight="700" fontSize="24px" paddingLeft = '10px'>
              Гранит памяти
            </Typography>
          </Box>

          {/* Центральная часть: Меню */}
          <Stack direction="row" spacing={5} >
            <HeaderMenuButton variant="text" color="inherit">Каталог</HeaderMenuButton>
            <HeaderMenuButton variant="text" color="inherit">О нас</HeaderMenuButton>
            <HeaderMenuButton variant="text" color="inherit">Услуги</HeaderMenuButton>
            <HeaderMenuButton variant="text" color="inherit">Примеры работ</HeaderMenuButton>
          </Stack>

          {/* Правая часть: Кнопка и иконки */}
          <Stack direction='row' spacing='1' alignItems='center'>
            {/*Кнопка "Открыть каталог"*/}
            <CatalogButton />
            <Box display="flex" alignItems="center" justifyContent="center" paddingLeft='10px '>
              <Badge color="secondary" badgeContent={0} overlap="circular">
                <FavoriteShoppingIcon />
              </Badge>
            </Box>
            
          </Stack>
         </Stack>
         </Toolbar>
      </Container>
    </AppBar>
    </Box>
    </Box>
  );
};

export default Header;