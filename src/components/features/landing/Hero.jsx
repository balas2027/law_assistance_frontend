import { Link } from 'react-router-dom';
import Icon from '../../ui/Icon';
import ChatPreviewCard from './ChatPreviewCard';
import TrainedOnBadges from './TrainedOnBadges';
import { TRAINED_ON } from '../../../lib/constants';

export default function Hero() {
  return (
    <section className="relative pt-20 pb-24 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-full mb-6 border border-primary/10">
            <span className="w-2 h-2 rounded-full bg-saffron animate-pulse" />
            <span className="font-label-caps text-label-caps text-primary tracking-wider uppercase">
              AI-POWERED · GROUNDED IN INDIAN LAW
            </span>
          </div>
          <h1 className="font-h1-mobile text-h1-mobile md:font-h1 md:text-h1 text-primary mb-6 text-balance">
            Understand the Law.
            <br />
            Know Your Rights.
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-lg">
            Navigate complex Indian legal concepts, draft documents, and learn your constitutional rights with an AI assistant trained strictly on verified Indian jurisprudence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link
              to="/chat"
              className="bg-saffron text-white px-8 py-3.5 rounded-full font-body-md text-body-md font-medium hover:bg-orange-500 transition-colors shadow-level-1 flex items-center justify-center gap-2"
            >
              Ask NyayaAI
              <Icon name="arrow_forward" size={22} />
            </Link>
            <Link
              to="/academy/path/course_fr"
              className="bg-transparent text-primary border-2 border-primary px-8 py-3.5 rounded-full font-body-md text-body-md font-medium hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
            >
              Start Learning
              <Icon name="school" size={22} />
            </Link>
          </div>
          <TrainedOnBadges items={TRAINED_ON} />
        </div>

        <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-auto lg:h-[600px] flex items-center justify-center">
          <div className="arc-bg" />
          <div className="mockup-container w-full max-w-md">
            <ChatPreviewCard />
          </div>
        </div>
      </div>
    </section>
  );
}
