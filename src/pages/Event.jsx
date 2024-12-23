import { Link } from 'react-router-dom';
import Footer from "../components/Footer"
import Header from "../components/Header"
import IMAGES from "../images/images";
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../UserContext';
import axios from 'axios'; 
import '../App.css'

export default function Event() {
  const { userInfo } = useContext(UserContext);
  const [user, setUser] = useState({});


  return (
    <div className="Home">
        <Header />
        <div className="mypage-container">
            event
        </div>
        <Footer />
    </div>
  );
}
