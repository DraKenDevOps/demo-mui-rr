// import CustomDrawer from "../components/CustomDrawer";
import PageContainer from "../components/PageContainer";

const Home = () => {
    return (
        <PageContainer title="Home" breadcrumbs={[{ title: "Home" }]}>
            {/* <CustomDrawer /> */}
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </PageContainer>
    );
};

export default Home;
