import { DISCLAIMER_TEXT } from '../../lib/constants';

export default function DisclaimerBanner({ text = DISCLAIMER_TEXT, className = '' }) {
  return (
    <p className={`font-label-caps text-[11px] text-on-surface-variant/70 text-center mt-3 tracking-wide ${className}`}>
      {text}
    </p>
  );
}
