import { Link } from 'react-router-dom';
import Icon from '../ui/Icon';
import { NAV_LINKS } from '../../lib/constants';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-surface-variant transition-all duration-300">
      <div className="max-w-[1200px] mx-auto px-margin-mobile md:px-margin-desktop h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-h2 text-h2 font-black text-primary tracking-tight">NyayaAI</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.id}
              to={link.to}
              className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors font-medium"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-1 cursor-pointer group">
            <span className="font-body-md text-body-md text-on-surface-variant group-hover:text-primary transition-colors">EN</span>
            <Icon name="expand_more" size={16} className="text-on-surface-variant group-hover:text-primary transition-colors" />
          </div>
          <Link to="/login" className="font-body-md text-body-md text-primary font-medium hover:opacity-80 transition-opacity">
            Sign In
          </Link>
          <Link
            to="/signup"
            className="bg-saffron text-white px-6 py-2.5 rounded-full font-label-caps text-label-caps uppercase tracking-wider hover:bg-orange-500 transition-colors shadow-level-1"
          >
            Get Started
          </Link>
        </div>

        <button className="md:hidden text-primary" aria-label="Open menu">
          <Icon name="menu" size={24} />
        </button>
      </div>
    </header>
  );
}
