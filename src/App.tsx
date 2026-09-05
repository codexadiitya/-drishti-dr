import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Login } from './pages/Login';
import { Overview } from './pages/Overview';
import { NewScreening } from './pages/NewScreening';
import { ScreeningQueue } from './pages/ScreeningQueue';
import { PatientResults } from './pages/PatientResults';
import { Explainability } from './pages/Explainability';
import { Reports } from './pages/Reports';
import { Reminders } from './pages/Reminders';
import { Simulation } from './pages/Simulation';
import { Settings } from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Standalone — no sidebar/header */}
        <Route path="/login" element={<Login />} />

        {/* App shell */}
        <Route element={<Layout />}>
          <Route path="/" element={<Overview />} />
          <Route path="/screening/new" element={<NewScreening />} />
          <Route path="/queue" element={<ScreeningQueue />} />
          <Route path="/patients/:id" element={<PatientResults />} />
          <Route path="/explainability" element={<Explainability />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/simulation" element={<Simulation />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
