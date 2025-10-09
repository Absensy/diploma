import {Box, Typography} from "@mui/material";
import data from "@/mocks/ExamplesOurWork.json";
import ExamplesOurWorkCard from "../ExamplesOurWorkCard/ExamplesOurWorkCard";

const GranitExamplesOurWork = () => {

    return (
        <Box paddingBottom="128px" bgcolor="background.paper">
            <Box textAlign="center" paddingTop="80px" paddingBottom="60px">
                <Typography component="h2" fontSize="36px" fontWeight="700">Примеры наших работ</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" padding="0px 80px">
            {data.examplesWork.map((c) => (
                <ExamplesOurWorkCard
                key={c.id}
                image={c.image}
                title={c.title}
                material={c.material}
                dimensions={c.dimensions}
                date={c.date}
                />
            ))}
            </Box>
        </Box>
    )
}

export default GranitExamplesOurWork;