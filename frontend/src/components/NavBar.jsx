// components/Navbar.jsx
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex gap-4">
      <Link to="/home">Home</Link>
      <Link to="/home/projetos">Projetos</Link>
      <Link to="/home/perfil">Perfil</Link>
      <Link to="/">Login</Link>
    </nav>
  );
}
