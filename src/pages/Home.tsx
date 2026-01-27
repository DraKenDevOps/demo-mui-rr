import CustomDrawer from "../components/CustomDrawer";
import PageContainer from "../components/PageContainer";

const Home = () => {
    return (
        <PageContainer title="Home" breadcrumbs={[{ title: "Home" }]}>
            <CustomDrawer />
        </PageContainer>
    );
};

export default Home;
