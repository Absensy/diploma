'use client'

import * as React from 'react';
import { Box, Typography, Grid, useTheme, useMediaQuery } from '@mui/material';
import Image from 'next/image';
import { BoxAboutCompany, TitleAboutCompany, LeftContent, RightContent, StackStats, BoxImage, ContentWrapper } from './GranitAboutCompany.styles';

const statistics = [
  { value: '10+', label: 'лет опыта' },
  { value: '2000+', label: 'памятников' },
  { value: '100%', label: 'гарантия' },
];

const GranitAboutCompany = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <BoxAboutCompany>
      <ContentWrapper>
        <LeftContent>
          {/* Название блока */}
          <Box>
            <TitleAboutCompany>
              О нашей компании
            </TitleAboutCompany>
          </Box>
          {/* Фотография на мобилке */}
          {isMobile && (
            <Box width="100%" display="flex" justifyContent="center">
              <BoxImage sx={{ width: '100%', maxWidth: "100%", height: 'auto', justifyContent: 'center', alignItems: 'center' }}>
                <Image src="/images/ded.png" alt="Мастер за работой по камню" width={700} height={484}
                  style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                />
              </BoxImage>
            </Box>
          )}
          {/* Информация */}
          <Box>
            <Typography variant="body1" fontSize={{ xs: "14px", md: "16px" }} paddingBottom="10px">
              Более 15 лет мы создаем памятники, которые хранят память о
              ваших близких. Наша мастерская оснащена современным
              оборудованием для обработки натурального камня.
            </Typography>
            <Typography variant="body1" fontSize={{ xs: "14px", md: "16px" }} paddingBottom={{ xs: "20px", md: "40px" }}>
              Мы работаем только с качественным гранитом и мрамором,
              предоставляем гарантию на все виды работ и осуществляем
              установку памятников на кладбищах Москвы и области.
            </Typography>
          </Box>
          {/* Статистика */}
          <Box>
            <StackStats direction="row" spacing={{ xs: 2, md: 3 }}>
              {statistics.map((stat) => (
                <Box key={stat.value}>
                  <Typography variant="h5" component="p" fontWeight="700" fontSize={{ xs: "24px", md: "30px" }} color="primary.main" textAlign={{ xs: "center", md: "left" }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" fontSize={{ xs: "14px", md: "16px" }} color="secondary" textAlign={{ xs: "center", md: "left" }}>
                    {stat.label}
                  </Typography>
                </Box>
              ))}
            </StackStats>
          </Box>
        </LeftContent>
        {/* Фотография на декстопе */}
        {!isMobile && (
          <RightContent>
            <BoxImage sx={{ width: '100%', maxWidth: '700px' }}>
              <Image src="/images/ded.png" alt="Мастер за работой по камню" width={700} height={384}
                style={{ width: '100%', objectFit: 'contain' }} />
            </BoxImage>
          </RightContent>
        )}
      </ContentWrapper>
    </BoxAboutCompany>
  );
};

export default GranitAboutCompany; 