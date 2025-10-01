'use client'

import React from 'react';
import { 
  Container, 
  Box, 
  Typography 
} from '@mui/material';

interface AboutCompanyProps {
  craftsmanImage?: string;
}

export const AboutCompany: React.FC<AboutCompanyProps> = ({ 
  craftsmanImage = '@/images/ded.png'
}) => {
  const stats = [
    { number: '15+', label: 'лет опыта' },
    { number: '2000+', label: 'памятников' },
    { number: '100%', label: 'гарантия' },
  ];

  return (
    <Container maxWidth={false} disableGutters sx={{ backgroundColor: 'background.default' }}>
      <Container maxWidth="lg">
        <Box display="flex" alignItems="center" gap={8} flexWrap="wrap" flexDirection="row">
          {/* Текстовая секция */}
          <Box flex="1" minWidth="300px" maxWidth="500px">
            <Typography variant="h2" component="h2" fontSize="48" fontWeight= "bold" color="text.primary" lineHeight="1.2">
              О нашей компании
            </Typography>
            
            <Typography variant="body1" component="p" mb={2}>
            Более 15 лет мы создаем памятники, которые хранят память о ваших близких. Наша мастерская оснащена современным оборудованием для обработки натурального камня
            </Typography>
            
            <Typography variant="body1" component="p" mb={4}>
             Мы работаем только с качественным гранитом и мрамором, предоставляем гарантию на все виды работ и осуществляем установку памятников на кладбищах Москвы и области.
            </Typography>

            {/* Статистика */}
            <Box display="flex" gap={5} flexDirection={{ xs: 'column', sm: 'row' }} mt={4}>
              {stats.map((stat, index) => (
                <Box key={index} display="flex" flexDirection="column">
                  <Typography fontSize="32px" fontWeight="bold" color="text.primary" lineHeight={1}>{stat.number}</Typography>
                  <Typography fontSize="14px" color="text.secondary" mt={0.5}>{stat.label}</Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Секция с изображением */}
          <Box flex="1" minWidth="300px" maxWidth="500px">
            <Box borderRadius="12px" overflow="hidden" boxShadow="0 4px 20px rgba(0, 0, 0, 0.1)" maxWidth="500px" mx="auto">
              <Box component="img" src={craftsmanImage} alt="Мастер за работой в каменной мастерской" loading="lazy" width="100%" height="auto" display="block" />
            </Box>
          </Box>
        </Box>
      </Container>
    </Container>
  );
};