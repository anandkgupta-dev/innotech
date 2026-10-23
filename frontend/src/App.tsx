import React, { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { Header } from './components/common/Header';
import { EmergencyAlert } from './components/common/EmergencyAlert';
import { HeroSection } from './components/landing/HeroSection';
import { Footer } from './components/common/Footer';
import { PatientIntakeModal } from './components/modals/PatientIntakeModal';
import { DoctorPortalModal } from './components/modals/DoctorPortalModal';
import { PatientIntakeFlow } from './components/intake/PatientIntakeFlow';

type ActiveView = 'landing' | 'intake';

const MainApp: React.FC = () => {
  const [activeView, setActiveView] = useState<ActiveView>('landing');
  const [patientModalOpen, setPatientModalOpen] = useState<boolean>(false);
  const [patientDemoMode, setPatientDemoMode] = useState<boolean>(false);
  const [doctorModalOpen, setDoctorModalOpen] = useState<boolean>(false);
  const [doctorSampleMode, setDoctorSampleMode] = useState<boolean>(false);

  const handleOpenPatientIntake = (demoMode: boolean) => {
    setPatientDemoMode(demoMode);
    setActiveView('intake');
  };

  const handleOpenDoctorPortal = (sampleMode: boolean) => {
    setDoctorSampleMode(sampleMode);
    setDoctorModalOpen(true);
  };

  // If activeView is 'intake', render the full patient intake kiosk flow
  if (activeView === 'intake') {
    return (
      <PatientIntakeFlow
        isDemoMode={patientDemoMode}
        onExit={() => setActiveView('landing')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased">
      {/* Top Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Conservative Emergency Alert */}
        <EmergencyAlert />

        {/* Primary Hospital Intake & Doctor Entry */}
        <HeroSection
          onOpenPatientIntake={handleOpenPatientIntake}
          onOpenDoctorPortal={handleOpenDoctorPortal}
        />
      </main>

      {/* Hospital Footer */}
      <Footer />

      {/* Modals & Dialogs */}
      <PatientIntakeModal
        isOpen={patientModalOpen}
        onClose={() => setPatientModalOpen(false)}
        isDemoMode={patientDemoMode}
        onStartIntake={(demo) => {
          setPatientDemoMode(demo);
          setActiveView('intake');
        }}
      />

      <DoctorPortalModal
        isOpen={doctorModalOpen}
        onClose={() => setDoctorModalOpen(false)}
        isSampleMode={doctorSampleMode}
      />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  );
}
