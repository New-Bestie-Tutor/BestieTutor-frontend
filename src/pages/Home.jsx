import { useNavigate } from 'react-router-dom';
import Footer from "../components/Footer"
import Header from "../components/Header"
import '../App.css'

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="Home">
        <Header />
        홈화면
        <button onClick={() => navigate('/topic')}>주제선택하기</button>
        <Footer />
    </div>
  );
}
