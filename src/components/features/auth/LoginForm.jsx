import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import Input from '../../ui/Input';
import Button from '../../ui/Button';
import Icon from '../../ui/Icon';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login({ email, password });
      const from = location.state?.from?.pathname;
      const defaultPath = user?.user_type === 'admin' ? '/admin/dashboard' : '/chat';
      navigate(from || defaultPath, { replace: true });
    } catch {
      // error surfaced via store
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        id="email"
        type="email"
        label="Email Address"
        icon="mail"
        placeholder="user@institution.edu"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        id="password"
        type="password"
        label="Password"
        icon="lock"
        placeholder="••••••••"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p className="text-xs text-error">{error}</p>}

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-primary-container border-[#E7E5DE] rounded focus:ring-primary-container bg-surface-container-lowest"
          />
          <label htmlFor="remember-me" className="ml-2 block font-body-md text-[14px] text-on-surface-variant">
            Remember me
          </label>
        </div>
        <div className="text-sm">
          <a className="font-body-md text-[14px] font-medium text-primary-container hover:text-primary transition-colors cursor-pointer">
            Forgot Password?
          </a>
        </div>
      </div>

      <div>
        <Button
          type="submit"
          variant="saffron"
          className="w-full py-3"
          disabled={loading}
          icon={loading ? <span className="chakra-loader w-4 h-4" /> : null}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>
      </div>

      <p className="text-center font-body-md text-[14px] text-on-surface-variant">
        Don&apos;t have an account?{' '}
        <Link to="/signup" className="font-medium text-primary-container hover:text-primary transition-colors">
          Create one
        </Link>
      </p>
      <div className="flex items-center gap-1 text-outline justify-center">
        <Icon name="verified_user" size={16} />
        <span className="font-citation text-citation uppercase tracking-widest text-[11px]">Grounded in Indian Law</span>
      </div>
    </form>
  );
}
