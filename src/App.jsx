import { BrowserRouter } from 'react-router-dom';
import Modal from 'react-modal';
import AppRoutes from './Routes';
import './App.css';
import { UserContextProvider } from './UserContext';
import { LanguageProvider } from "./LanguageContext";
import axios from './axiosConfig';
import { useEffect, useContext } from 'react'; // 추가
import { UserContext } from './UserContext'; // 추가
import { AuthRestore } from "./AuthRestore"; // 추가

Modal.setAppElement('#root');

function App() {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
  axios.defaults.withCredentials = true;

  return (
    <UserContextProvider>
      <AuthRestore />
      <LanguageProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </LanguageProvider>
    </UserContextProvider>
  );
}

export default App;
