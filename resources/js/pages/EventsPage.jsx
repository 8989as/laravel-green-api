import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import Events from '../components/Events/Events';

const EventsPage = () => {
    return (
        <>
            <Navbar />
            <div className="container-fluid p-0">
                <Events />
            </div>
            <Footer />
        </>
    );
};
export default EventsPage;
