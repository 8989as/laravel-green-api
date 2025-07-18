import About from "../components/About/About";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
const AboutUs = () => {
    return (
        <>
            <Navbar />
            <div className="container">
                <About />
            </div>
            <Footer />
        </>

    );
}

export default AboutUs;