// components/Navbar.jsx
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex gap-4">
      <Link to="/">Home</Link>
      <Link to="/projetos">Projetos</Link>
      <Link to="/perfil">Perfil</Link>
      <Link to="/login">Login</Link>
    </nav>
  );
}
