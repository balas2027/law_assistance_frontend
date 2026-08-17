import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import Input from '../../ui/Input';
import Button from '../../ui/Button';
import Icon from '../../ui/Icon';
import { ROLE_LIST } from '../../../types/user';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login({ email, password, user_type: userType });
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

      <div className="flex flex-col gap-1.5">
        <label className="font-label-caps text-label-caps text-on-surface" htmlFor="userType">
          Login As (Type)
        </label>
        <div className="relative">
          <select
            id="userType"
            className="w-full h-12 rounded-xl border border-surface-variant bg-surface-container-lowest px-4 pr-10 font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none shadow-sm cursor-pointer"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            required
          >
            <option value="" disabled>
              Choose your account type
            </option>
            {ROLE_LIST.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <Icon name="expand_more" size={24} className="absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant pointer-events-none" />
        </div>
      </div>

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
