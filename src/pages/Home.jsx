import { useNavigate } from 'react-router-dom';
import Footer from "../components/Footer"
import Header from "../components/Header"
import '../App.css'

export default function Home() {
  return (
    <div className="Home">
        <Header />
        홈화면
        <Footer />
    </div>
  );
}
