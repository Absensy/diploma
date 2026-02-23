"use client"
import { FormControl, FormControlLabel, FormGroup, InputAdornment, MenuItem, OutlinedInput, Select, Stack, TextField, Typography, Checkbox, Alert, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ClearIcon from "@mui/icons-material/Clear";
import { TypographyWrapStyles, FilterBox } from "./GranitCatalogFilter.Styles";
import { useFilterContext } from "@/contexts/FilterContext";
import { FilterSkeleton } from "../Skeleton/Skeleton";
import EmptyState from "../EmptyState/EmptyState";

const GranitCatalogFilter = () => {
    const { filterData, filters, loading, error, updateFilter, toggleCategory, toggleMaterial, resetFilters } = useFilterContext();

    if (loading) {
        return <FilterSkeleton />;
    }

    if (error) {
        return (
            <FilterBox width={320} height="70%" p="24px" borderRadius="8px" border="0.5px solid #E5E7EB">
                <Alert severity="error">{error}</Alert>
            </FilterBox>
        );
    }

    if (!filterData) {
        return null;
    }

    // Проверяем, есть ли активные фильтры
    const hasActiveFilters = 
        filters.search !== '' ||
        filters.sortBy !== 'price-asc' ||
        filters.selectedCategories.length > 0 ||
        filters.selectedMaterials.length > 0 ||
        filters.priceMin !== null ||
        filters.priceMax !== null;

    return (
        <FilterBox width={320} height="70%" p="24px" borderRadius="8px" border="0.5px solid #E5E7EB">
            <Stack spacing="32px">
                {/* Поисковая строка */}
                <TextField
                    size="small"
                    placeholder="Поиск памятников.."
                    value={filters.search}
                    onChange={(e) => updateFilter('search', e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon fontSize="small" />
                            </InputAdornment>
                        ),
                    }}
                />

                {/* Кнопка сброса фильтров */}
                {hasActiveFilters && (
                    <Button
                        variant="outlined"
                        startIcon={<ClearIcon />}
                        onClick={resetFilters}
                        fullWidth
                        sx={{
                            borderColor: '#d32f2f',
                            color: '#d32f2f',
                            '&:hover': {
                                borderColor: '#b71c1c',
                                backgroundColor: 'rgba(211, 47, 47, 0.04)',
                            },
                        }}
                    >
                        Сбросить фильтры
                    </Button>
                )}

                {/* Сортировка по */}
                <Stack spacing="16px">
                    <Typography fontWeight={600} fontSize="18px">Сортировать по</Typography>
                    <FormControl size="small">
                        <Select
                            value={filters.sortBy}
                            onChange={(e) => updateFilter('sortBy', e.target.value)}
                            IconComponent={ArrowDropDownIcon}
                        >
                            {filterData.sortOptions.map((option: { value: string; label: string }) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Stack>

                {/* Категории */}
                <Stack spacing={1}>
                    <Typography fontWeight={600} fontSize="18px">Категории</Typography>
                    {filterData.categories.length === 0 ? (
                        <EmptyState
                            message="Категории не найдены"
                            variant="minimal"
                            height={60}
                        />
                    ) : (
                        <FormGroup>
                            {filterData.categories.map((category: { id: number; name: string }) => (
                                <FormControlLabel
                                    key={category.id}
                                    control={
                                        <Checkbox
                                            size="small"
                                            checked={filters.selectedCategories.includes(category.id)}
                                            onChange={() => toggleCategory(category.id)}
                                        />
                                    }
                                    label={<TypographyWrapStyles>{category.name}</TypographyWrapStyles>}
                                />
                            ))}
                        </FormGroup>
                    )}
                </Stack>

                {/* Ценовой диапазон */}
                <Stack spacing={1}>
                    <Typography fontWeight={600} fontSize="18px">Ценовой диапазон</Typography>
                    <Stack direction="row" spacing={1}>
                        <OutlinedInput
                            size="small"
                            placeholder="Мин."
                            type="number"
                            value={filters.priceMin || ''}
                            onChange={(e) => updateFilter('priceMin', e.target.value ? Number(e.target.value) : null)}
                        />
                        <OutlinedInput
                            size="small"
                            placeholder="Макс."
                            type="number"
                            value={filters.priceMax || ''}
                            onChange={(e) => updateFilter('priceMax', e.target.value ? Number(e.target.value) : null)}
                        />
                    </Stack>
                </Stack>

                {/* Материал */}
                <Stack spacing={1}>
                    <Typography fontWeight={600} fontSize="18px">Материал</Typography>
                    {filterData.materials.length === 0 ? (
                        <EmptyState
                            message="Материалы не найдены"
                            variant="minimal"
                            height={60}
                        />
                    ) : (
                        <FormGroup>
                            {filterData.materials.map((material: string) => (
                                <FormControlLabel
                                    key={material}
                                    control={
                                        <Checkbox
                                            size="small"
                                            checked={filters.selectedMaterials.includes(material)}
                                            onChange={() => toggleMaterial(material)}
                                        />
                                    }
                                    label={<TypographyWrapStyles>{material}</TypographyWrapStyles>}
                                />
                            ))}
                        </FormGroup>
                    )}
                </Stack>

            </Stack>
        </FilterBox>
    )
}

export default GranitCatalogFilter;