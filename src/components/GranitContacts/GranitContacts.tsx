import ClockCircleIcon from '@/icons/ClockCircleIcon';
import MailCircleIcon from '@/icons/MailCircleIcon';
import MapCircleIcon from '@/icons/MapCircleIcon';
import PhoneCircleIcon from '@/icons/PhoneCircleIcon';
import { Box, Stack, Typography } from '@mui/material'
import Maps from '../Maps/Maps';
const GranitContacts = () => {
    return (
        <Box padding={{ xs: "40px 4%", md: "80px 5%" }}>
            <Typography fontSize="36px" fontWeight="700" textAlign="center" paddingBottom="80px">Контакты</Typography>
            <Box display="flex" justifyContent="space-between" flexDirection={{ xs: "column", lg: "row" }}>
                <Box paddingRight={{ xs: "0px", lg: "80px" }} paddingBottom={{ xs: "40px", lg: "0px" }}>
                    <Stack flexDirection="row" alignItems="center" paddingBottom="20px">
                        <Box width="49px" height="49px" display="flex" alignItems="center" justifyContent="center">
                            <MapCircleIcon size={49} />
                        </Box>
                        <Box paddingLeft="16px">
                            <Typography fontSize="20px" fontWeight="600" paddingBottom="4px">Адрес</Typography>
                            <Typography fontSize="16px" fontWeight="400" color="text.secondary">пр.Янки Купалы 22а, цокольный этаж</Typography>
                        </Box>
                    </Stack>
                    <Stack flexDirection="row" alignItems="center" paddingBottom="20px">
                        <Box width="49px" height="49px" display="flex" alignItems="center" justifyContent="center">
                            <PhoneCircleIcon size={49} />
                        </Box>
                        <Box paddingLeft="16px">
                            <Typography fontSize="20px" fontWeight="600" paddingBottom="4px">Телефон</Typography>
                            <Typography fontSize="16px" fontWeight="400" color="text.secondary">+375(29)708-21-11</Typography>
                        </Box>
                    </Stack>
                    <Stack flexDirection="row" alignItems="center" paddingBottom="20px">
                        <Box width="49px" height="49px" display="flex" alignItems="center" justifyContent="center">
                            <MailCircleIcon size={49} />
                        </Box>
                        <Box paddingLeft="16px">
                            <Typography fontSize="20px" fontWeight="600" paddingBottom="4px">Email</Typography>
                            <Typography fontSize="16px" fontWeight="400" color="text.secondary">info@granite-memory.by</Typography>
                        </Box>
                    </Stack>
                    <Stack flexDirection="row" alignItems="center" paddingBottom="20px">
                        <Box width="49px" height="49px" display="flex" alignItems="center" justifyContent="center">
                            <ClockCircleIcon size={49} />
                        </Box>
                        <Box paddingLeft="16px">
                            <Typography fontSize="20px" fontWeight="600" paddingBottom="4px">Режим работы</Typography>
                            <Typography fontSize="16px" fontWeight="400" color="text.secondary">Пн-Пт: 9:00 - 18:00</Typography>
                            <Typography fontSize="16px" fontWeight="400" color="text.secondary">Сб-Вс: 10:00 - 16:00</Typography>
                        </Box>
                    </Stack>
                </Box>
                <Box width="100%" height="313px" border="5px solid" borderColor="common.black" borderRadius="8px" overflow="hidden">
                    <Maps />
                </Box>
            </Box>
        </Box>
    )
}

export default GranitContacts;