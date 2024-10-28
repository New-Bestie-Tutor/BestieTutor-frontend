import { BrowserRouter } from 'react-router-dom';
import Modal from 'react-modal';
import AppRoutes from './Routes';

Modal.setAppElement('#root');

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App
