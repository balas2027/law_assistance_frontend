import { Link } from 'react-router-dom';
import Icon from '../ui/Icon';
import { FOOTER_COMPANY, FOOTER_LEGAL_TOPICS, FOOTER_PRODUCT } from '../../lib/constants';

function FooterColumn({ title, links }) {
  return (
    <div>
      <h4 className="font-label-caps text-label-caps text-primary uppercase tracking-wider mb-4">{title}</h4>
      <ul className="space-y-3 font-body-md text-sm text-on-surface-variant">
        {links.map((link) => (
          <li key={link}>
            <a className="hover:text-primary transition-colors cursor-pointer">{link}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-white border-t border-surface-variant pt-16 pb-8">
      <div className="max-w-[1200px] mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="font-h2 text-h2 font-black text-primary tracking-tight mb-4 block">
              NyayaAI
            </Link>
            <p className="font-body-md text-sm text-on-surface-variant max-w-xs mb-6">
              Democratizing legal knowledge across India through secure, accessible, and accurate AI technology.
            </p>
            <div className="flex gap-4">
              <a className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-variant transition-colors border border-surface-variant cursor-pointer">
                <Icon name="share" size={16} />
              </a>
              <a className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-variant transition-colors border border-surface-variant cursor-pointer">
                <Icon name="mail" size={16} />
              </a>
            </div>
          </div>
          <FooterColumn title="Product" links={FOOTER_PRODUCT} />
          <FooterColumn title="Legal Topics" links={FOOTER_LEGAL_TOPICS} />
          <FooterColumn title="Company" links={FOOTER_COMPANY} />
        </div>

        <div className="border-t border-surface-variant pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body-md text-xs text-on-surface-variant">© 2024 NyayaAI. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <Icon name="gavel" size={16} className="text-on-surface-variant" />
            <p className="font-body-md text-xs text-on-surface-variant">
              Disclaimer: NyayaAI provides legal information, not formal legal advice. Consult a qualified advocate for specific legal issues.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
