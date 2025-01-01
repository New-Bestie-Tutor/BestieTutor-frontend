import { BrowserRouter } from 'react-router-dom';
import Modal from 'react-modal';
import AppRoutes from './Routes';
import './App.css';
import { UserContextProvider } from './UserContext';
import { LanguageProvider } from "./LanguageContext";
import axios from './axiosConfig';

Modal.setAppElement('#root');

function App() {
  axios.defaults.baseURL = "http://localhost:3000";
  axios.defaults.withCredentials = true;
  return (
    <UserContextProvider>
      <LanguageProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </LanguageProvider>
    </UserContextProvider>
  );
}

export default App

