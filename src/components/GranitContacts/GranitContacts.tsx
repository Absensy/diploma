import ClockCircleIcon from '@/icons/ClockCircleIcon';
import MailCircleIcon from '@/icons/MailCircleIcon';
import MapCircleIcon from '@/icons/MapCircleIcon';
import PhoneCircleIcon from '@/icons/PhoneCircleIcon';
import { Box, Stack, Typography } from '@mui/material'
import Maps from '../Maps/Maps';
const GranitContacts = () => {
    return (
        <Box padding={{ xs: "40px 4%", md: "80px 5%" }}>
            <Typography fontSize={{ xs: "24px", md: "36px" }} fontWeight="700" textAlign="center" paddingBottom={{ xs: "40px", md: "80px" }}>Контакты</Typography>
            <Box
                display="grid"
                gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
                gap={{ xs: "30px", md: "60px" }}
                alignItems="start"
            >
                <Box>
                    <Stack flexDirection="row" paddingBottom="20px">
                        <MapCircleIcon />
                        <Box paddingLeft="16px">
                            <Typography fontSize={{ xs: "18px", md: "20px" }} fontWeight="600" paddingBottom="4px">Адрес</Typography>
                            <Typography fontSize={{ xs: "14px", md: "16px" }} fontWeight="400" color="text.secondary">пр.Янки Купалы 22а, цокольный этаж</Typography>
                        </Box>
                    </Stack>
                    <Stack flexDirection="row" paddingBottom="20px">
                        <PhoneCircleIcon />
                        <Box paddingLeft="16px">
                            <Typography fontSize={{ xs: "18px", md: "20px" }} fontWeight="600" paddingBottom="4px">Телефон</Typography>
                            <Typography fontSize={{ xs: "14px", md: "16px" }} fontWeight="400" color="text.secondary">+375(29)708-21-11</Typography>
                        </Box>
                    </Stack>
                    <Stack flexDirection="row" paddingBottom="20px">
                        <MailCircleIcon />
                        <Box paddingLeft="16px">
                            <Typography fontSize={{ xs: "18px", md: "20px" }} fontWeight="600" paddingBottom="4px">Email</Typography>
                            <Typography fontSize={{ xs: "14px", md: "16px" }} fontWeight="400" color="text.secondary">info@granite-memory.by</Typography>
                        </Box>
                    </Stack>
                    <Stack flexDirection="row" paddingBottom="20px">
                        <ClockCircleIcon />
                        <Box paddingLeft="16px">
                            <Typography fontSize={{ xs: "18px", md: "20px" }} fontWeight="600" paddingBottom="4px">Режим работы</Typography>
                            <Typography fontSize={{ xs: "14px", md: "16px" }} fontWeight="400" color="text.secondary">Пн-Пт: 9:00 - 18:00</Typography>
                            <Typography fontSize={{ xs: "14px", md: "16px" }} fontWeight="400" color="text.secondary">Сб-Вс: 10:00 - 16:00</Typography>
                        </Box>
                    </Stack>
                </Box>
                <Box width="100%" height={{ xs: "250px", md: "313px" }} border="5px solid" borderColor="common.black" borderRadius="8px" overflow="hidden">
                    <Maps />
                </Box>
            </Box>
        </Box>
    )
}

export default GranitContacts;