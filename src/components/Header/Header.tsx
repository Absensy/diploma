'use client';

import * as React from 'react';
import { Box, Container, Typography, Stack } from '@mui/material';
import CatalogButton from '../GranitCatalogButton/GranitCatalogButton';
import { ButtonHeader, HeaderMenuButton } from './Header.Styles';
import LogoGranitPrimary2Icon from '@/icons/LogoGranitPrimary2';
import GpsIcon from '@/icons/GPS';
import TelIcon from '@/icons/Tel';
import InstIcon from '@/icons/Inst';
import GreenCheckIcon from '@/icons/GreenCheck';
import LogoGranitPrimary1Icon from '@/icons/LogoGranitPrimary1';
import ClocksIcon from '@/icons/Clocks';
import Link from 'next/link';
import { useContactContext } from '@/contexts/ContactContext';
import { useAboutCompanyContent } from '@/hooks/useContent';
import BurgerMenu from '../BurgerMenu/BurgerMenu';

// Default values to ensure consistent rendering between server and client
const DEFAULT_ADVANTAGES = [
  'Качество материалов',
  'Индивидуальный подход',
  'Гарантия и надёжность'
];

const DEFAULT_WORKING_HOURS = 'Пн-Пт: 9:00 - 18:00, Сб-Вс: 10:00 - 16:00';

const Header = () => {
  const { contactInfo } = useContactContext();
  const { data: aboutData } = useAboutCompanyContent();

  // Use fallback values to ensure consistent rendering between server and client
  // Always use the same structure regardless of loading state
  const address = contactInfo?.address || 'пр. Янки Купалы 22а, цокольный этаж';
  const phone = contactInfo?.phone || '+375 (29) 708-21-11';
  const instagram = contactInfo?.instagram || 'granit.grodno';
  
  // Ensure working hours always have the same format
  // Normalize the format to prevent hydration mismatches
  const workingHoursString = contactInfo?.working_hours || DEFAULT_WORKING_HOURS;
  const normalizedWorkingHours = workingHoursString.replace(/\s*,\s*/g, ', '); // Normalize comma spacing
  const workingHoursArray = normalizedWorkingHours.includes(', ') 
    ? normalizedWorkingHours.split(', ')
    : [normalizedWorkingHours];
  
  // Ensure advantages always have the same structure and length
  const advantages = Array.isArray(aboutData?.advantages) && aboutData.advantages.length > 0
    ? aboutData.advantages.slice(0, 3) // Always limit to 3 items
    : DEFAULT_ADVANTAGES;

  return (
    <Box>
      {/* Верхняя часть Header */}
      <Box
        sx={{
          background: (theme: any) => theme.palette.background.default,
          borderBottom: (theme: any) => `1px solid ${theme.palette.secondary.main}`,
          padding: '29px 5%',
          display: { xs: 'none', md: 'block' },
        }}
      >
        <Stack direction="row" justifyContent="space-between" flexWrap="wrap" gap="20px">
            <Stack direction="row" alignItems="center">
              <Link href="/"><LogoGranitPrimary1Icon /></Link>
              <Stack spacing={1} alignItems="flex-start" marginLeft="0" justifyContent="center" paddingLeft="17px">
                <Stack direction="row" spacing={1} alignItems="center">
                  <GpsIcon />
                  <Typography variant="body2" color="text.primary" fontWeight="500">
                    {address}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <TelIcon />
                  <Typography variant="body2" color="text.primary" fontWeight="500">
                    {phone}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <InstIcon />
                  <Typography variant="body2" color="text.primary" fontWeight="500">
                    {instagram}
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
                {workingHoursArray.map((hours: string, index: number) => (
                  <Typography key={index} variant="body2" color="text.secondary">
                    {hours}
                  </Typography>
                ))}
              </Stack>
            </Stack>

            <Box bgcolor="#9a9da4" borderRadius="21px">
              <Stack spacing={1} alignItems="flex-start" padding="10px 24px">
                {advantages.slice(0, 3).map((advantage: string, index: number) => (
                  <Stack key={index} direction="row" spacing={1} alignItems="center">
                    <GreenCheckIcon />
                    <Typography variant="body2" color="#FFFFFF">{advantage}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>
        </Stack>
      </Box>

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
          zIndex: 1300, // Увеличиваем z-index для Material-UI совместимости
          backgroundColor: 'white',
          boxShadow: '0 4px 6px 0 rgba(0, 0, 0, 0.08)',
          padding: { xs: '16px 4%', md: '10px 5%' },
          width: '100%',
          display: 'block',
          // Добавляем дополнительные свойства для лучшей работы sticky
          contain: 'layout',
          isolation: 'isolate'
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
          <Stack 
            direction="row" 
            gap={{ md: '15px', lg: '30px' }}
            sx={{ display: { xs: 'none', md: 'flex' } }}
          >
            <Link href="/catalog" style={{ textDecoration: 'none' }}>
              <HeaderMenuButton variant="text" color="inherit">Каталог</HeaderMenuButton>
            </Link>
            <Link href="/#about" style={{ textDecoration: 'none' }}>
              <HeaderMenuButton variant="text" color="inherit">О нас</HeaderMenuButton>
            </Link>
            <Link href="/#services" style={{ textDecoration: 'none' }}>
              <HeaderMenuButton variant="text" color="inherit">Услуги</HeaderMenuButton>
            </Link>
            <Link href="/#examples" style={{ textDecoration: 'none' }}>
              <HeaderMenuButton variant="text" color="inherit">Примеры работ</HeaderMenuButton>
            </Link>
          </Stack>

          {/* Правая часть: Кнопка и иконки */}
          <Stack 
            direction='row' 
            spacing='1' 
            alignItems='center'
            sx={{ gap: { xs: '8px', md: '4px' } }}
          >
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <ButtonHeader><CatalogButton /></ButtonHeader>
            </Box>
            <BurgerMenu />
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default Header;