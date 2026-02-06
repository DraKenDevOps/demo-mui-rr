import { useState } from "react";
// import CustomDrawer from "../components/CustomDrawer";
import PageContainer from "../components/PageContainer";
import { SnowflakeID } from "../utils/SnowFlakeId";

const Home = () => {
    const [uuid, setUuid] = useState("");
    const [snowflakeId, setSnowflakeId] = useState("");
    const [parseResult, setParseResult] = useState<ReturnType<SnowflakeID["parse"]> | null>(null);
    const [generatedSnowflakes, setGeneratedSnowflakes] = useState<string[]>([]);

    const snowflake = new SnowflakeID(1, 1);
    const handleConvert = () => {
        try {
            const converted = snowflake.uuidToSnowflake(uuid);
            setSnowflakeId(converted);
            const parsed = snowflake.parse(converted);
            setParseResult(parsed);
        } catch (err) {
            console.error(err);
            setSnowflakeId("");
            setParseResult(null);
        }
    };

    const handleGenerate = () => {
        try {
            const id = snowflake.generate();
            setGeneratedSnowflakes((prev) => [id, ...prev].slice(0, 10));
            const parsed = snowflake.parse(id);
            setParseResult(parsed);
        } catch (err) {
            console.error(err);
        }
    };

    const handleParse = (id: string) => {
        try {
            const parsed = snowflake.parse(id);
            setParseResult(parsed);
        } catch (err) {
            console.error(err);
        }
    };
    return (
        <PageContainer title="Home" breadcrumbs={[]}>
            {/* <CustomDrawer /> */}
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </PageContainer>
    );
};

export default Home;
