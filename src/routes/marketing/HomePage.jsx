import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Hero from '../../components/features/landing/Hero';
import FeatureGrid from '../../components/features/landing/FeatureGrid';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface font-body-md antialiased">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <FeatureGrid />
      </main>
      <Footer />
    </div>
  );
}
