'use client'

import * as React from 'react';
import { Box, Typography, Grid, useTheme, useMediaQuery } from '@mui/material';
import Image from 'next/image';
import { GridAboutCompany, TitleAboutCompany, GridLeftCol, StackStats, BoxImage } from './GranitAboutCompany.styles';

const statistics = [
  { value: '10+', label: 'лет опыта' },
  { value: '2000+', label: 'памятников' },
  { value: '100%', label: 'гарантия' },
];

const GranitAboutCompany = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <GridAboutCompany container>
      <GridLeftCol size="grow">
        {/* Название блока */}
        <Grid>
          <TitleAboutCompany >
            О нашей компании
          </TitleAboutCompany>
        </Grid>
        {/* Фотография на мобилке */}
        {isMobile && (
          <Grid>
            <BoxImage sx={{ width: '100%', maxWidth: "700px ", height: 'auto' }}>
              <Image src="/images/ded.png" alt="Мастер за работой по камню" width={700} height={484}
                style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
              />
            </BoxImage>
          </Grid>
        )}
        {/* Информация */}
        <Grid>
          <Typography variant="body1" fontSize="16px" paddingBottom="10px">
            Более 15 лет мы создаем памятники, которые хранят память о
            ваших близких. Наша мастерская оснащена современным
            оборудованием для обработки натурального камня.
          </Typography>
          <Typography variant="body1" fontSize="16px" paddingBottom="40px">
            Мы работаем только с качественным гранитом и мрамором,
            предоставляем гарантию на все виды работ и осуществляем
            установку памятников на кладбищах Москвы и области.
          </Typography>
        </Grid>
        {/* Статистика */}
        <Grid>
          <StackStats direction="row" spacing={3}>
            {statistics.map((stat) => (
              <Box key={stat.value}>
                <Typography variant="h5" component="p" fontWeight="700" fontSize="30px" color="primary.main" textAlign="center">
                  {stat.value}
                </Typography>
                <Typography variant="body2" fontSize="16px" color="secondary" textAlign="center">
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </StackStats>
        </Grid>
      </GridLeftCol>
      {/* Фотография на декстопе */}
      {!isMobile && (
        <Grid width="600px" height="384px" justifyContent="right">
          <Box borderRadius={2}>
            <Image src="/images/ded.png" alt="Мастер за работой по камню" width={700} height={384}
              style={{ width: '100%' }} />
          </Box>
        </Grid>
      )}
    </GridAboutCompany>
  );
};

export default GranitAboutCompany; 