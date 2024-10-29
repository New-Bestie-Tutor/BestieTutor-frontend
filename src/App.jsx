import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './Routes';
import './App.css';
import { UserContextProvider } from './UserContext';


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
