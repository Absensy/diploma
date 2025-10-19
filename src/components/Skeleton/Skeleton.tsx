import React from 'react';
import { Skeleton as MuiSkeleton, Box, Stack } from '@mui/material';

interface SkeletonProps {
    variant?: 'text' | 'rectangular' | 'circular';
    width?: number | string;
    height?: number | string;
    animation?: 'pulse' | 'wave' | false;
}

export const Skeleton: React.FC<SkeletonProps> = ({
    variant = 'rectangular',
    width,
    height,
    animation = 'wave'
}) => {
    return (
        <MuiSkeleton
            variant={variant}
            width={width}
            height={height}
            animation={animation}
            sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.06)',
                '&::after': {
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
                }
            }}
        />
    );
};

// Скелетон для карточки товара
export const ProductCardSkeleton: React.FC = () => {
    return (
        <Box
            sx={{
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid rgba(0,0,0,0.06)',
                height: '100%',
                minHeight: '400px',
                width: '100%',
                maxWidth: '320px',
            }}
        >
            {/* Изображение */}
            <Skeleton height="240px" />

            {/* Контент */}
            <Box sx={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                {/* Название */}
                <Skeleton height="24px" width="80%" sx={{ marginBottom: '8px' }} />

                {/* Описание */}
                <Skeleton height="16px" width="100%" sx={{ marginBottom: '8px' }} />
                <Skeleton height="16px" width="70%" sx={{ marginBottom: '16px' }} />

                {/* Цена */}
                <Skeleton height="20px" width="60px" sx={{ marginBottom: '16px' }} />

                {/* Кнопка */}
                <Skeleton height="36px" width="100px" />
            </Box>
        </Box>
    );
};

// Скелетон для карточки категории
export const CategoryCardSkeleton: React.FC = () => {
    return (
        <Box
            sx={{
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid rgba(0,0,0,0.06)',
                minHeight: '200px',
            }}
        >
            {/* Изображение */}
            <Skeleton height="150px" />

            {/* Контент */}
            <Box sx={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Skeleton height="24px" width="80%" sx={{ marginBottom: '8px' }} />
                <Skeleton height="16px" width="60%" />
            </Box>
        </Box>
    );
};

// Скелетон для карточки примеров работ
export const ExampleWorkCardSkeleton: React.FC = () => {
    return (
        <Box
            sx={{
                backgroundColor: '#fff',
                borderRadius: '16px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.08)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid rgba(0,0,0,0.06)',
                minHeight: '300px',
            }}
        >
            {/* Изображение */}
            <Skeleton height="200px" />

            {/* Контент */}
            <Box sx={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Skeleton height="20px" width="90%" sx={{ marginBottom: '8px' }} />
                <Skeleton height="16px" width="70%" />
            </Box>
        </Box>
    );
};

// Скелетон для контактной информации
export const ContactInfoSkeleton: React.FC = () => {
    return (
        <Stack spacing={2}>
            <Skeleton height="20px" width="200px" />
            <Skeleton height="16px" width="150px" />
            <Skeleton height="16px" width="180px" />
        </Stack>
    );
};

// Скелетон для фильтров
export const FilterSkeleton: React.FC = () => {
    return (
        <Box
            sx={{
                backgroundColor: '#fff',
                borderRadius: '8px',
                border: '0.5px solid #E5E7EB',
                padding: '24px',
                width: '320px',
                height: '70%',
                position: 'sticky',
                top: '20px',
                alignSelf: 'flex-start',
                maxHeight: 'calc(100vh - 80px)',
                overflowY: 'auto',
                marginLeft: '80px',
                marginBottom: '80px',
                '@media (max-width: 900px)': {
                    display: 'none',
                },
            }}
        >
            <Stack spacing="32px">
                {/* Поиск */}
                <Skeleton height="40px" width="100%" />

                {/* Сортировка */}
                <Stack spacing="16px">
                    <Skeleton height="18px" width="120px" />
                    <Skeleton height="40px" width="100%" />
                </Stack>

                {/* Категории */}
                <Stack spacing="16px">
                    <Skeleton height="18px" width="100px" />
                    <Stack spacing="8px">
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} height="20px" width="80%" />
                        ))}
                    </Stack>
                </Stack>

                {/* Ценовой диапазон */}
                <Stack spacing="16px">
                    <Skeleton height="18px" width="140px" />
                    <Stack direction="row" spacing="8px">
                        <Skeleton height="40px" width="50%" />
                        <Skeleton height="40px" width="50%" />
                    </Stack>
                </Stack>

                {/* Материалы */}
                <Stack spacing="16px">
                    <Skeleton height="18px" width="80px" />
                    <Stack spacing="8px">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} height="20px" width="70%" />
                        ))}
                    </Stack>
                </Stack>
            </Stack>
        </Box>
    );
};

export default Skeleton;
