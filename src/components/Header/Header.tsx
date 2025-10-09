'use client';

import * as React from 'react';
import { Box, Container, Typography, Stack, AppBar, Badge } from '@mui/material';
import CatalogButton from '../GranitCatalogButton/GranitCatalogButton';
import { ButtonHeader, HeaderMenuButton, TopHeaderBox, BottomHeaderBox, TypographyTitle } from './Header.styles';
import LogoGranitPrimary2Icon from '@/icons/LogoGranitPrimary2';
import FavoriteShoppingIcon from '@/icons/FavoriteShopping';
import GpsIcon from '@/icons/GPS';
import TelIcon from '@/icons/Tel';
import InstIcon from '@/icons/Inst';
import GreenCheckIcon from '@/icons/GreenCheck';
import LogoGranitPrimary1Icon from '@/icons/LogoGranitPrimary1';
import ClocksIcon from '@/icons/Clocks';
import MenuIcon from '@/icons/MenuIcon';


const Header = () => {
  return (
    <Box>
      {/* Верхняя часть Header */}
    <TopHeaderBox>
      <Container maxWidth={false} disableGutters >
         <Stack direction="row" justifyContent="space-between">
           <Stack direction="row" alignItems="center">
             <LogoGranitPrimary1Icon />
             <Stack spacing={1} alignItems="flex-start" marginLeft="0" justifyContent="center" paddingLeft="17px">
               <Stack direction="row" spacing={1} alignItems="center">
                 <GpsIcon />
                 <Typography variant="body2" color="text.primary" fontWeight="500">
                   пр. Янки Купалы 22а, цокольный этаж
                 </Typography>
               </Stack>
               <Stack direction="row" spacing={1} alignItems="center">
                 <TelIcon />
                 <Typography variant="body2" color="text.primary" fontWeight="500">
                   +375 (29) 708-21-11
                 </Typography>
               </Stack>
               <Stack direction="row" spacing={1} alignItems="center">
                 <InstIcon />
                 <Typography variant="body2" color="text.primary" fontWeight="500">
                   granit.grodno
                 </Typography>
               </Stack>
             </Stack>
           </Stack>

           <Stack direction="row" spacing={1} alignItems="flex-start" paddingRight="14%">
             <Box paddingTop="2px">
               <ClocksIcon />
             </Box>
             <Stack textAlign="left">
               <Typography variant="subtitle2" fontWeight="600" fontSize="18px" color="text.primary" paddingBottom="4px">Режим работы</Typography>
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
     </TopHeaderBox>
     {/* Нижняя часть Header */}
    <BottomHeaderBox>
    <AppBar position="sticky" color="inherit" elevation={0}>
      <Box>
         <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} width="100%">
          {/* Левая часть: Логотип */}
          <Box display='flex' alignItems= 'center'>
            <LogoGranitPrimary2Icon />
            <TypographyTitle>
              Гранит памяти
            </TypographyTitle>
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
            <ButtonHeader><CatalogButton /></ButtonHeader>
            <Box display="flex" alignItems="center" paddingLeft="10px">
              <Stack direction="row" alignItems="center">
                <Badge color="secondary" badgeContent={0} overlap="circular">
                  <FavoriteShoppingIcon />
                </Badge>
                <Box display="flex" marginLeft="12px">
                  <MenuIcon />
                </Box>
              </Stack>
            </Box>
            
          </Stack>
         </Stack>
      </Box>
    </AppBar>
    </BottomHeaderBox>
    </Box>
  );
};

export default Header;