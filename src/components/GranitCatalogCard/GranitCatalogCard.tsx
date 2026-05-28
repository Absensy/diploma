'use client';

import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import { CatalogCardProps, CategoryCard, DiscountBadge, PriceContainer, OldPrice, CardActions, PopularBadge, NewBadge } from "./GranitCatalogCard.Styles"
import DetailsButton from "../GranitDetailsButton/GranitDetailsButton"
import Image from "next/image";
import ProductModal from "../ProductModal/ProductModal";
import ImageViewerModal from "../ImageViewerModal/ImageViewerModal";
import { useState } from "react";
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useImageBackgroundColor } from "@/hooks/useImageBackgroundColor";
import { useCart } from "@/contexts/CartContext";

export const GranitCatalogCard: React.FC<CatalogCardProps> = ({ name, price, oldPrice, image, discount, subtext, is_new, is_popular, product }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [imageViewerOpen, setImageViewerOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [imageError, setImageError] = useState(false);
    const isWhiteBackground = useImageBackgroundColor(image);
    const { addItem, removeAllByProductId, isInCart } = useCart();

    const inCart = product ? isInCart(product.id) : false;

    const handleDetailsClick = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleImageClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setImageViewerOpen(true);
    };

    const handleCloseImageViewer = () => {
        setImageViewerOpen(false);
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!product) return;
        if (inCart) {
            removeAllByProductId(product.id);
        } else {
            addItem({
                id: product.id,
                name: product.name,
                image: product.image,
                price: product.price,
                discounted_price: product.discounted_price,
                requires_personalization: product.requires_personalization,
            });
        }
    };

    return (
        <>
            <CategoryCard>
                <Box
                    height="200px"
                    position="relative"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    overflow="hidden"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onClick={handleImageClick}
                    sx={{
                        cursor: 'pointer',
                        backgroundColor: (isWhiteBackground === false) ? 'transparent' : 'white'
                    }}
                >
                    {/* Размытый фон - показывается только если фон НЕ белый */}
                    {isWhiteBackground === false && !imageError && image && (
                        <Box
                            position="absolute"
                            top={0}
                            left={0}
                            right={0}
                            bottom={0}
                            sx={{
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    zIndex: 1,
                                }
                            }}
                        >
                            <Image
                                src={image}
                                alt={`${name} background`}
                                fill
                                sizes="100%"
                                style={{ objectFit: 'cover', filter: 'blur(25px)', transform: 'scale(1.2)' }}
                                onError={() => setImageError(true)}
                            />
                        </Box>
                    )}
                    {/* Основное изображение */}
                    {!imageError && image ? (
                        <Box
                            position="absolute"
                            top={0}
                            left={0}
                            right={0}
                            bottom={0}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            sx={{ zIndex: 2 }}
                        >
                            <Box position="relative" width="100%" height="100%">
                                <Image
                                    src={image}
                                    alt={name}
                                    fill
                                    sizes="100%"
                                    style={{ objectFit: 'contain' }}
                                    onError={() => setImageError(true)}
                                />
                            </Box>
                        </Box>
                    ) : (
                        <Box
                            position="absolute"
                            top={0}
                            left={0}
                            right={0}
                            bottom={0}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            sx={{ zIndex: 2, backgroundColor: '#f5f5f5' }}
                        >
                            <Typography variant="body2" color="text.secondary">
                                Изображение недоступно
                            </Typography>
                        </Box>
                    )}
                    {/* Оверлей с лупой при наведении */}
                    <Box
                        position="absolute"
                        top={0}
                        left={0}
                        right={0}
                        bottom={0}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        sx={{
                            backgroundColor: 'rgba(0, 0, 0, 0.4)',
                            opacity: isHovered ? 1 : 0,
                            transition: 'opacity 0.3s ease',
                            zIndex: 3,
                        }}
                    >
                        <ZoomInIcon sx={{ fontSize: 60, color: 'white' }} />
                    </Box>
                    {/* Бейджи */}
                    {discount ? <DiscountBadge>-{discount}%</DiscountBadge> : null}
                    {is_popular && <PopularBadge>Популярное</PopularBadge>}
                    {is_new && (
                        <NewBadge sx={{ top: is_popular ? 40 : 8 }}>Новинка</NewBadge>
                    )}
                </Box>
                <Box padding="20px" display="flex" flexDirection="column" flex={1} justifyContent="space-between">
                    <Typography variant="h3" fontSize="20px" fontWeight="700" color="text.primary" marginBottom="8px">
                        {name}
                    </Typography>
                    <Typography fontSize="14px" color="text.secondary" lineHeight="1.4">
                        {subtext}
                    </Typography>
                    <PriceContainer>
                        {oldPrice && <OldPrice>{oldPrice} BYN</OldPrice>}
                        <Typography fontSize="20px" fontWeight="700" color={oldPrice ? "#ff5252" : "text.primary"} >
                            {price} BYN
                        </Typography>
                    </PriceContainer>
                    <CardActions>
                        <DetailsButton onClick={handleDetailsClick} />
                        {product && (
                            <Tooltip title={inCart ? 'Убрать из корзины' : 'В корзину'}>
                                <IconButton
                                    onClick={handleAddToCart}
                                    sx={{
                                        color: inCart ? '#e53935' : '#333',
                                        border: '1px solid',
                                        borderColor: inCart ? '#e53935' : 'rgba(0,0,0,0.2)',
                                        borderRadius: '8px',
                                        padding: '8px',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            backgroundColor: inCart ? 'rgba(229,57,53,0.08)' : 'rgba(0,0,0,0.06)',
                                            borderColor: inCart ? '#e53935' : '#333',
                                        },
                                    }}
                                >
                                    {inCart
                                        ? <FavoriteIcon fontSize="small" />
                                        : <FavoriteBorderIcon fontSize="small" />
                                    }
                                </IconButton>
                            </Tooltip>
                        )}
                    </CardActions>
                </Box>
            </CategoryCard>

            {product && (
                <ProductModal
                    open={modalOpen}
                    onClose={handleCloseModal}
                    product={product}
                />
            )}

            <ImageViewerModal
                open={imageViewerOpen}
                onClose={handleCloseImageViewer}
                imageSrc={image}
                imageAlt={name}
                useWhiteBackground={isWhiteBackground !== false}
            />
        </>
    );
};
