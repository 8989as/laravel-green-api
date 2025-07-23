import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import Events from '../components/Events/Events';
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import { useTranslation } from "react-i18next";

const EventsPage = () => {

    const { t } = useTranslation();

    return (
        <>
            <Navbar />
            <Breadcrumb items={[
                { label: t('home'), url: '/' },
                { label: t('event'), active: true }
            ]} />
            <div className="container">
                <Events />
            </div>
            <Footer />
        </>
    );
};
export default EventsPage;
