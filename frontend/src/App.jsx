// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState, createContext, useContext } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

import Login from './pages/Login';
import Home from './pages/Home';
import Projetos from './pages/Projetos';
import Perfil from './pages/Perfil';
import Register from './pages/Registrer'; 
import MeusInteresses from './pages/MeuInteresses';

export const AuthContext = createContext();

const ProtectedRoute = ({ children}) => {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/" />;

  return children;
};

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      axios.get('/api/auth/me')
        .then(res => setUser(res.data))
        .catch(() => setUser(null));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/home/interesses" element={<ProtectedRoute><MeusInteresses /></ProtectedRoute>} />
          <Route path="/home/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
          <Route path="/home/projetos" element={<ProtectedRoute onlyVerified><Projetos /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
