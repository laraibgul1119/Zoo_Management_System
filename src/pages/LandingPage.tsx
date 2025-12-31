import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Map, Users, Package, ArrowRight, Heart, Star } from 'lucide-react';
import { AnimalShape } from '../components/AnimalShape';
import { FeatureCard } from '../components/FeatureCard';
import { Modal } from '../components/ui/Modal';

export function LandingPage() {
  const navigate = useNavigate();

  // State for managing modals
  const [showDemoModal, setShowDemoModal] = useState(false);

  // Button handlers
  const handleLogin = () => {
    navigate('/login');
  };

  const handleStartTrial = () => {
    navigate('/register');
  };

  const handleWatchDemo = () => {
    setShowDemoModal(true);
  };

  const handleGetStarted = () => {
    navigate('/register');
  };

  const closeModal = () => {
    setShowDemoModal(false);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      {/* Navigation */}
      <nav className="border-b-4 border-black py-6 px-4 md:px-8 bg-white relative z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-black overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <img src="/logo.png" alt="Zootopia Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase">
              Zootopia
            </span>
          </div>
          <div className="hidden md:flex gap-8 font-bold text-lg">
            <button onClick={() => navigate('/events')} className="hover:text-[#2563EB] transition-colors bg-transparent border-none cursor-pointer">
              Events
            </button>
            <button onClick={() => navigate('/tickets')} className="hover:text-[#2563EB] transition-colors bg-transparent border-none cursor-pointer">
              Tickets
            </button>
            <button onClick={() => scrollToSection('benefits')} className="hover:text-[#2563EB] transition-colors bg-transparent border-none cursor-pointer">
              About
            </button>
          </div>
          <button onClick={handleLogin} className="bg-[#2563EB] text-white px-6 py-2 font-bold border-2 border-black hover:bg-[#1d4ed8] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]">
            Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative bg-[#FBBF24] pt-20 pb-32 px-4 overflow-hidden border-b-4 border-black">
        {/* Decorative Background Elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-[#F97316] rounded-full opacity-50 border-4 border-black" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-[#2563EB] transform rotate-12 border-4 border-black" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-[#10B981] rounded-full border-4 border-black" />

        <AnimalShape type="giraffe" className="absolute -bottom-10 left-10 w-64 h-64 text-[#F97316] opacity-80 rotate-6" />
        <AnimalShape type="elephant" className="absolute top-20 -right-10 w-80 h-80 text-[#2563EB] opacity-20 -rotate-12" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-block bg-white border-2 border-black px-4 py-1 mb-6 transform -rotate-2">
            <span className="font-black text-[#F97316] uppercase tracking-wider">
              The #1 Zoo Management Platform
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-black mb-8 leading-tight tracking-tight">
            MANAGE YOUR <br />
            <span className="text-white text-stroke-3 text-shadow-black">
              WILD KINGDOM
            </span>
          </h1>

          <p className="text-xl md:text-2xl font-bold text-black mb-12 max-w-2xl mx-auto leading-relaxed">
            Everything you need to run a modern zoo. Track animals, schedule
            staff, and delight visitors in one bold platform.
          </p>

          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <button onClick={handleStartTrial} className="bg-[#2563EB] text-white text-xl px-10 py-4 font-black border-4 border-black hover:bg-[#1d4ed8] transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]">
              START FREE TRIAL
            </button>
            <button onClick={handleWatchDemo} className="bg-[#10B981] text-black text-xl px-10 py-4 font-black border-4 border-black hover:bg-[#059669] transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]">
              WATCH DEMO
            </button>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-black mb-4 uppercase">
              Wild Features
            </h2>
            <div className="w-24 h-4 bg-[#F97316] mx-auto border-2 border-black"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              title="Animal Tracking"
              description="Monitor health, feeding schedules, and habitat conditions in real-time."
              icon={Map}
              color="#2563EB"
              iconColor="#FFFFFF"
            />
            <FeatureCard
              title="Staff Scheduling"
              description="Organize shifts for zookeepers, vets, and maintenance crews efficiently."
              icon={Users}
              color="#10B981"
              iconColor="#000000"
            />
            <FeatureCard
              title="Inventory"
              description="Keep track of food, medicine, and equipment supplies automatically."
              icon={Package}
              color="#F97316"
              iconColor="#FFFFFF"
            />
            <FeatureCard
              title="Visitor Events"
              description="Schedule shows, feedings, and tours to maximize visitor engagement."
              icon={Calendar}
              color="#FBBF24"
              iconColor="#000000"
            />
          </div>
        </div>

        {/* Decorative shapes */}
        <div className="absolute top-1/2 left-0 w-16 h-16 bg-[#FBBF24] border-4 border-black transform -translate-x-1/2 rotate-45"></div>
        <div className="absolute bottom-20 right-0 w-24 h-24 bg-[#2563EB] rounded-full border-4 border-black transform translate-x-1/2"></div>
      </section>

      {/* Benefits Section - Split Layout */}
      <section id="benefits" className="flex flex-col md:flex-row border-t-4 border-black">
        <div className="flex-1 bg-[#2563EB] p-12 md:p-20 flex flex-col justify-center relative overflow-hidden border-b-4 md:border-b-0 md:border-r-4 border-black">
          <AnimalShape type="penguin" className="absolute bottom-0 right-0 w-48 h-48 text-white opacity-20" />
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white border-4 border-black flex items-center justify-center mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Heart className="w-8 h-8 text-[#2563EB]" />
            </div>
            <h3 className="text-4xl font-black text-white mb-6 uppercase">
              Happy Animals
            </h3>
            <p className="text-xl font-bold text-white leading-relaxed opacity-90">
              Our advanced welfare monitoring ensures every inhabitant gets the
              precise care they need. From diet tracking to enrichment
              schedules, we've got it covered.
            </p>
          </div>
        </div>

        <div className="flex-1 bg-[#10B981] p-12 md:p-20 flex flex-col justify-center relative overflow-hidden">
          <AnimalShape type="lion" className="absolute top-10 right-10 w-40 h-40 text-black opacity-10" />
          <div className="relative z-10">
            <div className="w-16 h-16 bg-black border-4 border-white flex items-center justify-center mb-8 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
              <Star className="w-8 h-8 text-[#10B981]" />
            </div>
            <h3 className="text-4xl font-black text-black mb-6 uppercase">
              Thriving Business
            </h3>
            <p className="text-xl font-bold text-black leading-relaxed opacity-90">
              Optimize operations and reduce waste. Our analytics dashboard
              gives you the insights needed to grow your conservation efforts
              and bottom line.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 bg-white border-b-4 border-black">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="text-7xl font-black text-[#F97316] mb-2">
                500+
              </div>
              <div className="text-xl font-bold uppercase tracking-widest">
                Zoos Trust Us
              </div>
            </div>
            <div>
              <div className="text-7xl font-black text-[#2563EB] mb-2">1M+</div>
              <div className="text-xl font-bold uppercase tracking-widest">
                Animals Managed
              </div>
            </div>
            <div>
              <div className="text-7xl font-black text-[#10B981] mb-2">
                24/7
              </div>
              <div className="text-xl font-bold uppercase tracking-widest">
                Support Team
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-4 bg-[#F97316] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(#000 2px, transparent 2px)',
          backgroundSize: '30px 30px'
        }}></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-10 uppercase leading-none text-shadow-black">
            Ready to Tame the Chaos?
          </h2>
          <button onClick={handleGetStarted} className="bg-white text-black text-2xl px-12 py-6 font-black border-4 border-black hover:bg-gray-100 transition-all shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] active:shadow-none active:translate-x-[6px] active:translate-y-[6px] flex items-center gap-4 mx-auto">
            GET STARTED NOW <ArrowRight className="w-8 h-8" />
          </button>
        </div>

        {/* Decorative animals */}
        <AnimalShape type="elephant" className="absolute bottom-0 left-0 w-48 h-48 text-black opacity-20 transform translate-y-1/4" />
        <AnimalShape type="giraffe" className="absolute top-0 right-0 w-40 h-40 text-white opacity-20 transform -translate-y-1/4" />
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-black overflow-hidden shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]">
              <img src="/logo.png" alt="Zootopia Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase">
              Zootopia
            </span>
          </div>

          <div className="flex gap-8 font-bold text-gray-400">
            <button onClick={() => alert('Privacy Policy - Coming Soon!')} className="hover:text-white transition-colors bg-transparent border-none cursor-pointer">
              Privacy
            </button>
            <button onClick={() => alert('Terms of Service - Coming Soon!')} className="hover:text-white transition-colors bg-transparent border-none cursor-pointer">
              Terms
            </button>
            <button onClick={() => alert('Contact: support@zootopia.com')} className="hover:text-white transition-colors bg-transparent border-none cursor-pointer">
              Contact
            </button>
          </div>

          <div className="text-gray-500 font-medium">
            © 2024 Zootopia Systems. All rights reserved.
          </div>
        </div>
      </footer>

      <Modal
        isOpen={showDemoModal}
        onClose={closeModal}
        title="Watch Demo"
      >
        <div className="aspect-video bg-gray-200 border-2 border-black flex items-center justify-center mb-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-[#2563EB] rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-black">
              <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"></div>
            </div>
            <p className="font-bold text-gray-600">Demo Video Coming Soon!</p>
            <p className="text-sm text-gray-500 mt-2">See Zootopia in action with our comprehensive platform tour.</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => alert('Demo video would play here. Features: Animal tracking, staff management, visitor analytics, and more!')}
            className="flex-1 bg-[#10B981] text-black py-3 font-black border-2 border-black hover:bg-[#059669] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
          >
            PLAY DEMO
          </button>
          <button
            onClick={() => navigate('/register')}
            className="flex-1 bg-[#2563EB] text-white py-3 font-black border-2 border-black hover:bg-[#1d4ed8] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
          >
            START TRIAL
          </button>
        </div>
      </Modal>
    </div>
  );
}