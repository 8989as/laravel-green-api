import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Events from '../components/Events/Events';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import { useTranslation } from 'react-i18next';

const EventsPage = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    return (
        <>
            <Navbar />
            <div className="container-fluid p-0">
                <Breadcrumb items={[
                    { label: t('home'), url: '/' },
                    { label: t('event'), url: '/events', active: true }
                ]} />
                <Events />
            </div>
            <Footer />
        </>
    );
};
export default EventsPage;
