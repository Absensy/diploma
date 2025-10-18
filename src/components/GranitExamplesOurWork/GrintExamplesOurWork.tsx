import { Box, Typography } from "@mui/material";
import data from "@/mocks/ExamplesOurWork.json";
import ExamplesOurWorkCard from "../ExamplesOurWorkCard/ExamplesOurWorkCard";

const GranitExamplesOurWork = () => {

    return (
        <Box paddingBottom={{ xs: "64px", md: "128px" }} bgcolor="background.paper">
            <Box textAlign="center" paddingTop={{ xs: "40px", md: "80px" }} paddingBottom={{ xs: "30px", md: "60px" }}>
                <Typography component="h2" fontSize={{ xs: "24px", md: "36px" }} fontWeight="700">Примеры наших работ</Typography>
            </Box>
            <Box
                display="grid"
                gridTemplateColumns={{
                    xs: "1fr",
                    md: "repeat(2, 1fr)",
                    lg: "repeat(3, 1fr)"
                }}
                gap={{ xs: "16px", sm: "20px", md: "24px" }}
                padding={{ xs: "0px 4%", md: "0px 5%" }}
                justifyContent="center"
            >
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