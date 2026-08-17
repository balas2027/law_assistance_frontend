import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import Button from '../../ui/Button';
import Icon from '../../ui/Icon';
import { SIGNUP_ROLES } from '../../../types/user';

export default function SignupForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    terms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const { signup, loading, error } = useAuth();
  const navigate = useNavigate();

  const setField = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const setChecked = (e) => setForm((f) => ({ ...f, terms: e.target.checked }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await signup({ ...form });
      const defaultPath = user?.user_type === 'admin' ? '/admin/dashboard' : '/academy/path/course_fr';
      navigate(defaultPath, { replace: true });
    } catch {
      // error surfaced via store
    }
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1">
        <label className="font-label-caps text-label-caps text-on-surface" htmlFor="fullName">
          Full Name
        </label>
        <input
          className="w-full h-12 rounded-xl border border-surface-variant bg-surface-container-lowest px-4 font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-outline-variant shadow-sm"
          id="fullName"
          placeholder="e.g. Aditi Sharma"
          type="text"
          value={form.name}
          onChange={setField('name')}
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="font-label-caps text-label-caps text-on-surface" htmlFor="email">
          Email
        </label>
        <input
          className="w-full h-12 rounded-xl border border-surface-variant bg-surface-container-lowest px-4 font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-outline-variant shadow-sm"
          id="email"
          placeholder="Enter your email"
          type="email"
          value={form.email}
          onChange={setField('email')}
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="font-label-caps text-label-caps text-on-surface" htmlFor="password">
          Password
        </label>
        <div className="relative">
          <input
            className="w-full h-12 rounded-xl border border-surface-variant bg-surface-container-lowest px-4 pr-12 font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-outline-variant shadow-sm"
            id="password"
            placeholder="Create a strong password"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={setField('password')}
            required
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant hover:text-on-surface-variant transition-colors"
            onClick={() => setShowPassword((v) => !v)}
            aria-label="Toggle password visibility"
          >
            <Icon name={showPassword ? 'visibility' : 'visibility_off'} size={20} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="font-label-caps text-label-caps text-on-surface" htmlFor="role">
          Select Role
        </label>
        <div className="relative">
          <select
            className="w-full h-12 rounded-xl border border-surface-variant bg-surface-container-lowest px-4 pr-10 font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none shadow-sm cursor-pointer"
            id="role"
            value={form.role}
            onChange={setField('role')}
            required
          >
            <option value="" disabled>
              Choose your primary domain
            </option>
            {SIGNUP_ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
          <Icon name="expand_more" size={24} className="absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant pointer-events-none" />
        </div>
      </div>

      <div className="mt-2 flex items-start gap-3">
        <div className="flex items-center h-6">
          <input
            className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary bg-surface-container-lowest cursor-pointer"
            id="terms"
            type="checkbox"
            checked={form.terms}
            onChange={setChecked}
            required
          />
        </div>
        <label className="font-body-md text-[14px] leading-[20px] text-on-surface-variant" htmlFor="terms">
          I agree to the <a className="text-primary underline hover:text-secondary-container transition-colors cursor-pointer">Terms of Service</a> and{' '}
          <a className="text-primary underline hover:text-secondary-container transition-colors cursor-pointer">Privacy Policy</a>.
        </label>
      </div>

      {error && <p className="text-xs text-error">{error}</p>}

      <Button type="submit" variant="secondary" className="w-full h-12 mt-4" disabled={loading}>
        {loading ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  );
}
