import { useNavigate } from 'react-router-dom';
import Footer from "../components/Footer"
import Header from "../components/Header"
import IMAGES from "../images/images";
import '../App.css'

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="Home">
        <Header />
        <div className="welcome-container">
          <h2 className="welcome-txt">Welcome, Bestie!</h2>
          <img src={IMAGES.bettu} alt="bettu" className="welcome-image" />
        </div>
        <Footer />
    </div>
  );
}
