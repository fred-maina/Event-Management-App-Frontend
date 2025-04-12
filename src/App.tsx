import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/pages/LandingPage';
import LoginPage from './components/pages/LoginPage';
import SignupPage from './components/pages/SignupPage';
import ForgotPasswordPage from './components/pages/ForgotPasswordPage'; // Import the new page
import VerifyAccount from './components/pages/VerifyAccount';
import EventsList from './components/ui/EventsList';
import EventCreationWizard from './components/ui/EventCreationWizard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify" element={<VerifyAccount/>} />
        <Route path="/dashboard" element={<EventsList/>} />
        <Route path="/create-event" element={<EventCreationWizard/>}/>
        <Route path="/forgot-password" element={<ForgotPasswordPage />} /> {/* New route */}
      </Routes>
    </Router>
  );
}

export default App;
