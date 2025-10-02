import * as React from 'react';
import { Box, Typography, Stack, Grid } from '@mui/material';
import Image from 'next/image';

// Данные для отображения статистики
const statistics = [
  { value: '10+', label: 'лет опыта' },
  { value: '2000+', label: 'памятников' },
  { value: '100%', label: 'гарантия' },
];

const AboutCompany = () => {
  return (
    <Box bgcolor="#f4f4f4" py={8}>
        {/* Левая колонка: Текст и Статистика */}
        <Box display="flex" padding="0px 96px" justifyContent="space-between">
          <Box width={700} height={400} paddingRight="80px">
            <Typography variant="h4" component="h2" fontWeight="700" fontSize="36px" color="primary.main" paddingBottom="60px">
              О нашей компании
            </Typography>
            <Typography variant="body1" fontSize="18px" paddingBottom="10px">
              Более 15 лет мы создаем памятники, которые хранят память о
              ваших близких. Наша мастерская оснащена современным
              оборудованием для обработки натурального камня.
            </Typography>
            <Typography variant="body1" paddingBottom="40px">
              Мы работаем только с качественным гранитом и мрамором,
              предоставляем гарантию на все виды работ и осуществляем
              установку памятников на кладбищах Москвы и области.
            </Typography>
            <Stack direction="row" spacing={3}>
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
            </Stack>
          </Box>
        {/* Правая колонка: Изображение */}
          <Box borderRadius={2} width="600px" height="384px">
            <Image src="/images/ded.png" alt="Мастер за работой по камню" width={700} height={384}
              style={{ width: '100%'}}
            />
          </Box>
        </Box>
    </Box>
  );
};

export default AboutCompany;