import ClockCircleIcon from '@/icons/ClockCircleIcon';
import MailCircleIcon from '@/icons/MailCircleIcon';
import MapCircleIcon from '@/icons/MapCircleIcon';
import PhoneCircleIcon from '@/icons/PhoneCircleIcon';
import { Box, Stack, Typography } from '@mui/material'
import Maps from '../Maps/Maps';
const GranitContacts = () => {
    return (
        <Box padding="80px">
            <Typography fontSize="36px" fontWeight="700" textAlign="center" paddingBottom="80px">Контакты</Typography>
            <Box display="flex" justifyContent="space-between">
                <Box paddingRight="80px">
                    <Stack flexDirection="row" paddingBottom="20px">
                        <MapCircleIcon />
                        <Box paddingLeft="16px">
                            <Typography fontSize="20px" fontWeight="600" paddingBottom="4px">Адрес</Typography>
                            <Typography fontSize="16px" fontWeight="400" color="text.secondary">пр.Янки Купалы 22а, цокольный этаж</Typography>
                        </Box>
                    </Stack>
                    <Stack flexDirection="row" paddingBottom="20px">
                        <PhoneCircleIcon />
                        <Box paddingLeft="16px">
                            <Typography fontSize="20px" fontWeight="600" paddingBottom="4px">Телефон</Typography>
                            <Typography fontSize="16px" fontWeight="400"  color="text.secondary">+375(29)708-21-11</Typography>
                        </Box>
                    </Stack>
                    <Stack flexDirection="row" paddingBottom="20px">
                        <MailCircleIcon />
                        <Box paddingLeft="16px">
                            <Typography fontSize="20px" fontWeight="600" paddingBottom="4px">Email</Typography>
                            <Typography fontSize="16px" fontWeight="400" color="text.secondary">info@granite-memory.by</Typography>
                        </Box>
                    </Stack>
                    <Stack flexDirection="row" paddingBottom="20px">
                        <ClockCircleIcon />
                        <Box paddingLeft="16px">
                            <Typography fontSize="20px" fontWeight="600" paddingBottom="4px">Режим работы</Typography>
                            <Typography fontSize="16px" fontWeight="400" color="text.secondary">Пн-Пт: 9:00 - 18:00</Typography>
                            <Typography fontSize="16px" fontWeight="400" color="text.secondary">Сб-Вс: 10:00 - 16:00</Typography>
                        </Box>
                    </Stack>
                </Box>
                <Box width="605px" height="313px" border="5px solid" borderColor="common.black" borderRadius="8px" overflow="hidden">
                    <Maps />
                </Box>
            </Box>
        </Box>
    )
}

export default GranitContacts;