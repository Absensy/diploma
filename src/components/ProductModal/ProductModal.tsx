import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    Box,
    IconButton,
    Chip,
    Divider,
    Stack,
    Button,
    Card,
    CardContent
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import InstagramIcon from '@mui/icons-material/Instagram';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Image from 'next/image';
import { Product } from '@/lib/db';
import { useContactContext } from '@/contexts/ContactContext';

interface ProductModalProps {
    open: boolean;
    onClose: () => void;
    product: Product | null;
}

const ProductModal: React.FC<ProductModalProps> = ({ open, onClose, product }) => {
    const { contactInfo } = useContactContext();

    if (!product) return null;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'BYN',
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    maxHeight: '90vh'
                }
            }}
        >
            <DialogTitle sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                pb: 1
            }}>
                <Typography variant="h5" fontWeight="700">
                    {product.name}
                </Typography>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                <Stack spacing={3}>
                    {/* Изображение товара */}
                    <Box sx={{
                        width: '100%',
                        height: 300,
                        position: 'relative',
                        borderRadius: 2,
                        overflow: 'hidden',
                        backgroundColor: 'grey.100'
                    }}>
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            style={{
                                objectFit: 'cover',
                            }}
                            priority
                        />
                    </Box>

                    {/* Цена и скидка */}
                    <Box>
                        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                            {product.discount && (
                                <Chip
                                    label={`-${product.discount}%`}
                                    color="error"
                                    size="small"
                                    sx={{ fontWeight: 600 }}
                                />
                            )}
                            <Typography
                                variant="h4"
                                fontWeight="700"
                                color={product.discount ? "error.main" : "text.primary"}
                            >
                                {product.discounted_price ? formatPrice(product.discounted_price) : formatPrice(product.price)}
                            </Typography>
                            {product.discount && (
                                <Typography
                                    variant="h6"
                                    sx={{
                                        textDecoration: 'line-through',
                                        color: 'text.secondary'
                                    }}
                                >
                                    {formatPrice(product.price)}
                                </Typography>
                            )}
                        </Stack>
                    </Box>

                    <Divider />

                    {/* Краткое описание */}
                    <Box>
                        <Typography variant="h6" fontWeight="600" gutterBottom>
                            Описание
                        </Typography>
                        <Typography variant="body1" color="text.secondary" lineHeight={1.6}>
                            {product.short_description}
                        </Typography>
                    </Box>

                    {/* Полное описание */}
                    <Box>
                        <Typography variant="h6" fontWeight="600" gutterBottom>
                            Подробное описание
                        </Typography>
                        <Typography variant="body1" color="text.secondary" lineHeight={1.6}>
                            {product.full_description}
                        </Typography>
                    </Box>

                    {/* Материалы */}
                    <Box>
                        <Typography variant="h6" fontWeight="600" gutterBottom>
                            Материалы
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {product.materials}
                        </Typography>
                    </Box>

                    {/* Сроки изготовления */}
                    <Box>
                        <Typography variant="h6" fontWeight="600" gutterBottom>
                            Сроки изготовления
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {product.production_time}
                        </Typography>
                    </Box>

                    <Divider />

                    {/* CTA секция с контактами */}
                    <Card sx={{
                        backgroundColor: 'primary.main',
                        color: 'white',
                        borderRadius: 2
                    }}>
                        <CardContent>
                            <Stack spacing={2}>
                                <Typography variant="h6" fontWeight="700" textAlign="center">
                                    Для заказа или подробностей свяжитесь с нами
                                </Typography>

                                {contactInfo && (
                                    <Stack spacing={1.5}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <PhoneIcon fontSize="small" />
                                            <Typography variant="body1">
                                                {contactInfo.phone}
                                            </Typography>
                                        </Stack>

                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <EmailIcon fontSize="small" />
                                            <Typography variant="body1">
                                                {contactInfo.email}
                                            </Typography>
                                        </Stack>

                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <LocationOnIcon fontSize="small" />
                                            <Typography variant="body1">
                                                {contactInfo.address}
                                            </Typography>
                                        </Stack>

                                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                            {contactInfo.working_hours}
                                        </Typography>
                                    </Stack>
                                )}

                                <Box textAlign="center" mt={2}>
                                    <Stack
                                        direction={{ xs: 'column', sm: 'row' }}
                                        spacing={1.875} // 15px gap
                                        justifyContent="center"
                                        alignItems="center"
                                        sx={{ gap: '15px' }}
                                    >
                                        {/* Кнопка телефона */}
                                        <Button
                                            variant="contained"
                                            size="large"
                                            startIcon={<PhoneIcon sx={{ color: 'black' }} />}
                                            sx={{
                                                px: 4,
                                                py: 1.5,
                                                fontWeight: 600,
                                                textTransform: 'none',
                                                borderRadius: 2,
                                                minWidth: 'auto',
                                                backgroundColor: 'white',
                                                color: 'black',
                                                '&:hover': {
                                                    backgroundColor: 'grey.100',
                                                }
                                            }}
                                            onClick={() => {
                                                if (contactInfo?.phone) {
                                                    window.open(`tel:${contactInfo.phone}`, '_self');
                                                }
                                            }}
                                        >
                                            Позвонить
                                        </Button>

                                        {/* Кнопка email */}
                                        <Button
                                            variant="contained"
                                            size="large"
                                            startIcon={<EmailIcon sx={{ color: 'black' }} />}
                                            sx={{
                                                px: 4,
                                                py: 1.5,
                                                fontWeight: 600,
                                                textTransform: 'none',
                                                borderRadius: 2,
                                                minWidth: 'auto',
                                                backgroundColor: 'white',
                                                color: 'black',
                                                '&:hover': {
                                                    backgroundColor: 'grey.100',
                                                }
                                            }}
                                            onClick={() => {
                                                if (contactInfo?.email) {
                                                    window.open(`mailto:${contactInfo.email}`, '_self');
                                                }
                                            }}
                                        >
                                            Написать
                                        </Button>

                                        {/* Кнопка Instagram */}
                                        {contactInfo?.instagram && (
                                            <Button
                                                variant="contained"
                                                size="large"
                                                startIcon={<InstagramIcon sx={{ color: 'black' }} />}
                                                sx={{
                                                    px: 4,
                                                    py: 1.5,
                                                    fontWeight: 600,
                                                    textTransform: 'none',
                                                    borderRadius: 2,
                                                    minWidth: 'auto',
                                                    backgroundColor: 'white',
                                                    color: 'black',
                                                    '&:hover': {
                                                        backgroundColor: 'grey.100',
                                                    }
                                                }}
                                                onClick={() => {
                                                    window.open(contactInfo.instagram, '_blank');
                                                }}
                                            >
                                                Instagram
                                            </Button>
                                        )}
                                    </Stack>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Stack>
            </DialogContent>

        </Dialog>
    );
};

export default ProductModal;
