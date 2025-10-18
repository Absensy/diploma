import { Box, Divider, FormControl, FormControlLabel, FormGroup, InputAdornment, MenuItem, OutlinedInput, Select, Stack, TextField, Typography, Checkbox } from "@mui/material";
import FilterButton from "../GranitFilterButton/GranitFilterButton";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import data from '@/mocks/CatalogFilter.json';
import {TypographyWrapStyles, FilterBox} from "./GranitCatalogFilter.Styles";

const GranitCatalogFilter = () => {

    return (
        <FilterBox width={320} height="70%" p="24px" borderRadius="8px" border="0.5px solid #E5E7EB" marginLeft="80px">
            
            <Stack spacing="32px">
                {/* Поисковая строка */}
                <TextField 
                    size="small" 
                    placeholder="Поиск памятников.." 
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon fontSize="small" />
                            </InputAdornment>
                        ),
                    }}
                />
                {/* Сортировка по */}
                <Stack spacing="16px">
                    <Typography fontWeight={600} fontSize="18px">Сортировать по</Typography>
                    <FormControl size="small">
                        <Select defaultValue="popular" IconComponent={ArrowDropDownIcon}
                        >
                            {data.SortBy.map((value) => (
                            <MenuItem value={value.value}>{value.label}</MenuItem>
                        ))}
                            {/* <MenuItem value="popular">Популярные</MenuItem>
                            <MenuItem value="price-asc">Цена: по возрастанию</MenuItem>
                            <MenuItem value="price-desc">Цена: по убыванию</MenuItem>
                            <MenuItem value="new">Новинки</MenuItem> */}
                        </Select>
                    </FormControl>
                </Stack>
                
                {/* Категории */}
                <Stack spacing={1}>
                    <Typography fontWeight={600} fontSize="18px">Категории</Typography>
                    <FormGroup>
                        {data.categoryOptions.map((label) => (
                            <FormControlLabel key={label}
                                control={ <Checkbox size="small"/>}
                                label={<TypographyWrapStyles>{label}</TypographyWrapStyles>}
                            />
                        ))}
                    </FormGroup>
                </Stack>
                
                {/* Ценовой диапазон */}
                <Stack spacing={1}>
                    <Typography fontWeight={600} fontSize="18px">Ценовой диапазон</Typography>
                    <Stack direction="row" spacing={1}>
                        <OutlinedInput size="small"  placeholder="Мин."  />
                        <OutlinedInput size="small" placeholder="Макс."  />
                    </Stack>
                </Stack>
                
                {/* Материал */}
                <Stack spacing={1}>
                    <Typography fontWeight={600} fontSize="18px">Материал</Typography>
                    <FormGroup>
                        {data.materialOptions.map((label) => (
                            <FormControlLabel key={label}
                                control={<Checkbox size="small" />}
                                label={<TypographyWrapStyles>{label}</TypographyWrapStyles>}
                            />
                        ))}
                    </FormGroup>
                </Stack>
                {/* Кнопка */}
                <Box pt={1}>
                    <FilterButton />
                </Box>
            </Stack>
        </FilterBox>
    )
}

export default GranitCatalogFilter;