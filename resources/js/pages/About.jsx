import About from "../components/About/About";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import { useTranslation } from "react-i18next";
const AboutUs = () => {
    const { t } = useTranslation();
    return (
        <>
            <Navbar />
            <Breadcrumb items={[
                { label: t('home'), url: '/' },
                { label: t('about'), active: true }
            ]} />
            <div className="container">
                <About />
            </div>
            <Footer />
        </>

    );
}

export default AboutUs;