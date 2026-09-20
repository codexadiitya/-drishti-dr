import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppStateProvider } from './context/AppStateContext';
import { Layout } from './components/layout/Layout';
import { Login } from './pages/Login';
import { Overview } from './pages/Overview';
import { NewScreening } from './pages/NewScreening';
import { DoctorDashboard } from './pages/DoctorDashboard';
import { DoctorReview } from './pages/DoctorReview';
import { PatientResults } from './pages/PatientResults';
import { PatientPortal } from './pages/PatientPortal';
import { Referral } from './pages/Referral';
import { Explainability } from './pages/Explainability';
import { Reports } from './pages/Reports';
import { Reminders } from './pages/Reminders';
import { Simulation } from './pages/Simulation';
import { Validation } from './pages/Validation';
import { ScreeningQueue } from './pages/ScreeningQueue';
import { Settings } from './pages/Settings';

export default function App() {
  return (
    <AppStateProvider>
      <BrowserRouter>
        <Routes>
          {/* Standalone Login */}
          <Route path="/login" element={<Login />} />

          {/* App shell */}
          <Route element={<Layout />}>
            {/* Health Worker routes */}
            <Route path="/" element={<Overview />} />
            <Route path="/screening/new" element={<NewScreening />} />
            <Route path="/queue" element={<ScreeningQueue />} />

            {/* Doctor routes */}
            <Route path="/doctor" element={<DoctorDashboard />} />
            <Route path="/doctor/review/:id" element={<DoctorReview />} />

            {/* Patient routes */}
            <Route path="/patients/:id" element={<PatientResults />} />
            <Route path="/patient-portal" element={<PatientPortal />} />

            {/* Clinical Evidence, Referral, Reports & Simulation */}
            <Route path="/referral/:id" element={<Referral />} />
            <Route path="/explainability" element={<Explainability />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/reminders" element={<Reminders />} />
            <Route path="/simulation" element={<Simulation />} />
            <Route path="/validation" element={<Validation />} />
            <Route path="/settings" element={<Settings />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppStateProvider>
  );
}
