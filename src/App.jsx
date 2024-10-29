import { BrowserRouter } from 'react-router-dom';
import Modal from 'react-modal';
import AppRoutes from './Routes';
import './App.css';
import { UserContextProvider } from './UserContext';

Modal.setAppElement('#root');

function App() {
  return (
    <UserContextProvider>
      <Router>
        <AppRoutes />
      </Router>
    </UserContextProvider>
  );
}

export default App
