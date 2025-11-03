import React from 'react';
import { Modal, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Image from 'next/image';

interface ImageViewerModalProps {
    open: boolean;
    onClose: () => void;
    imageSrc: string;
    imageAlt: string;
    useWhiteBackground?: boolean; // true для товаров, false для примеров работ
}

const ImageViewerModal: React.FC<ImageViewerModalProps> = ({ open, onClose, imageSrc, imageAlt, useWhiteBackground = false }) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
            }}
            onClick={onClose}
        >
            <Box
                sx={{
                    position: 'relative',
                    maxWidth: '90vw',
                    maxHeight: '90vh',
                    width: 'auto',
                    height: 'auto',
                    outline: 'none',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <IconButton
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        top: -50,
                        right: 0,
                        color: 'white',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        },
                        zIndex: 2,
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <Box
                    sx={{
                        position: 'relative',
                        width: '80vw',
                        height: '80vh',
                        backgroundColor: useWhiteBackground ? 'white' : 'rgba(0, 0, 0, 0.9)',
                        borderRadius: 1,
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {!useWhiteBackground && (
                        /* Размытый фон для примеров работ */
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                    zIndex: 1,
                                }
                            }}
                        >
                            <Image
                                src={imageSrc}
                                alt={`${imageAlt} background`}
                                fill
                                style={{
                                    objectFit: 'cover',
                                    filter: 'blur(30px)',
                                    transform: 'scale(1.2)',
                                }}
                            />
                        </Box>
                    )}
                    {/* Основное изображение */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 2,
                        }}
                    >
                        <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                            <Image
                                src={imageSrc}
                                alt={imageAlt}
                                fill
                                style={{
                                    objectFit: 'contain',
                                }}
                                quality={100}
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};

export default ImageViewerModal;
