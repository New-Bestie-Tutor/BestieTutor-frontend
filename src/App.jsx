import axios from "axios";
import axios from "axios";
import { BrowserRouter } from 'react-router-dom';
import Modal from 'react-modal';
import AppRoutes from './Routes';
import './App.css';
import { UserContextProvider } from './UserContext';

Modal.setAppElement('#root');

function App() {
  axios.defaults.baseURL = 'http://localhost:3000';
  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = 'http://localhost:3000';
  axios.defaults.withCredentials = true;
  return (
    <UserContextProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </UserContextProvider>
  );
}

export default App

