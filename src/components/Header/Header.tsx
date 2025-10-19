'use client';

import * as React from 'react';
import { Box, Container, Typography, Stack, CircularProgress } from '@mui/material';
import CatalogButton from '../GranitCatalogButton/GranitCatalogButton';
import { ButtonHeader, HeaderMenuButton, TopHeaderBox, BottomHeaderBox, TypographyTitle } from './Header.Styles';
import LogoGranitPrimary2Icon from '@/icons/LogoGranitPrimary2';
import GpsIcon from '@/icons/GPS';
import TelIcon from '@/icons/Tel';
import InstIcon from '@/icons/Inst';
import GreenCheckIcon from '@/icons/GreenCheck';
import LogoGranitPrimary1Icon from '@/icons/LogoGranitPrimary1';
import ClocksIcon from '@/icons/Clocks';
import Link from 'next/link';
import { useContactContext } from '@/contexts/ContactContext';
import BurgerMenu from '../BurgerMenu/BurgerMenu';
import { Skeleton } from '../Skeleton/Skeleton';

const Header = () => {
  const { contactInfo, loading } = useContactContext();

  if (loading) {
    return (
      <Box>
        {/* Верхняя часть Header - скелетон */}
        <Box sx={{ padding: '29px 80px', display: { xs: 'none', md: 'block' } }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" gap="20px">
            <Box display="flex" alignItems="center" gap="20px">
              <Skeleton width="120px" height="40px" />
              <Box>
                <Box sx={{ marginBottom: '8px' }}>
                  <Skeleton width="200px" height="20px" />
                </Box>
                <Box sx={{ marginBottom: '8px' }}>
                  <Skeleton width="150px" height="20px" />
                </Box>
                <Skeleton width="180px" height="20px" />
              </Box>
            </Box>
            <Box>
              <Skeleton width="200px" height="60px" />
            </Box>
          </Box>
        </Box>

        {/* Разделитель */}
        <Box sx={{ borderTop: '1px solid #E5E7EB', backgroundColor: '#F8F9FA', height: '1px' }} />

        {/* Нижняя часть Header - скелетон */}
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            backgroundColor: 'white',
            boxShadow: '0 4px 6px 0 rgba(0, 0, 0, 0.08)',
            padding: { xs: '16px 4%', md: '10px 80px' },
            width: '100%',
            display: 'block'
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap="10px">
              <Skeleton width="40px" height="40px" />
              <Skeleton width="150px" height="24px" />
            </Box>
            <Box display="flex" alignItems="center" gap="20px">
              <Skeleton width="200px" height="20px" />
              <Skeleton width="40px" height="40px" />
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      {/* Верхняя часть Header */}
      <TopHeaderBox>
        <Container maxWidth={false} disableGutters >
          <Stack direction="row" justifyContent="space-between" flexWrap="wrap" gap="20px">
            <Stack direction="row" alignItems="center">
              <Link href="/"><LogoGranitPrimary1Icon /></Link>
              <Stack spacing={1} alignItems="flex-start" marginLeft="0" justifyContent="center" paddingLeft="17px">
                <Stack direction="row" spacing={1} alignItems="center">
                  <GpsIcon />
                  <Typography variant="body2" color="text.primary" fontWeight="500">
                    {contactInfo?.address || 'пр. Янки Купалы 22а, цокольный этаж'}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <TelIcon />
                  <Typography variant="body2" color="text.primary" fontWeight="500">
                    {contactInfo?.phone || '+375 (29) 708-21-11'}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <InstIcon />
                  <Typography variant="body2" color="text.primary" fontWeight="500">
                    {contactInfo?.instagram || 'granit.grodno'}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="flex-start" paddingRight="14%" paddingTop="5px">
              <Box paddingTop="2px">
                <ClocksIcon />
              </Box>
              <Stack textAlign="left">
                <Typography variant="subtitle2" fontWeight="600" fontSize="18px" color="text.primary" paddingBottom="4px">Режим работы</Typography>
                {contactInfo?.working_hours ? (
                  contactInfo.working_hours.split(', ').map((hours: string, index: number) => (
                    <Typography key={index} variant="body2" color="text.secondary">
                      {hours}
                    </Typography>
                  ))
                ) : (
                  <>
                    <Typography variant="body2" color="text.secondary">Пн-Пт: 9:00 - 18:00</Typography>
                    <Typography variant="body2" color="text.secondary">Сб-Вс: 10:00 - 16:00</Typography>
                  </>
                )}
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

      {/* Разделитель */}
      <Box sx={{
        borderTop: '1px solid #E5E7EB',
        backgroundColor: '#F8F9FA',
        height: '1px'
      }} />

      {/* Нижняя часть Header */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          backgroundColor: 'white',
          boxShadow: '0 4px 6px 0 rgba(0, 0, 0, 0.08)',
          padding: { xs: '16px 4%', md: '10px 80px' },
          width: '100%',
          display: 'block'
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} width="100%">
          {/* Левая часть: Логотип */}
          <Box display='flex' alignItems='center'>
            <Link href="/"><LogoGranitPrimary2Icon /></Link>
            <Link href="/" style={{ textDecoration: 'none' }}><Typography variant="h6" component="div" fontWeight="700" fontSize={{ md: '18px', lg: '24px' }} paddingLeft='10px' color="text.primary"  >
              Гранит памяти
            </Typography>
            </Link>
          </Box>

          {/* Центральная часть: Меню */}
          <Stack direction="row" gap={{ md: '15px', lg: '30px' }}>
            <HeaderMenuButton variant="text" color="inherit" href="/catalog">Каталог</HeaderMenuButton>
            <HeaderMenuButton variant="text" color="inherit">О нас</HeaderMenuButton>
            <HeaderMenuButton variant="text" color="inherit">Услуги</HeaderMenuButton>
            <HeaderMenuButton variant="text" color="inherit">Примеры работ</HeaderMenuButton>
          </Stack>

          {/* Правая часть: Кнопка и иконки */}
          <Stack direction='row' spacing='1' alignItems='center'>
            <ButtonHeader><CatalogButton /></ButtonHeader>
            <BurgerMenu />
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default Header;