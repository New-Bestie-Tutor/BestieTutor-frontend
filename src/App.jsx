import axios from "axios";
import { BrowserRouter } from 'react-router-dom';
import Modal from 'react-modal';
import AppRoutes from './Routes';

Modal.setAppElement('#root');

function App() {
  axios.defaults.baseURL = 'http://localhost:3000';
  axios.defaults.withCredentials = true;
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App