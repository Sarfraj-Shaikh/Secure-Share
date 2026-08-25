import { Routes, Route } from 'react-router-dom';
import { Home } from './components/pages/Home';
import { Register } from './components/pages/Register';
import { Login } from './components/pages/Login';
import { VerifyAccount } from './components/pages/VerifyAccount';
import { ForgotPassword } from './components/pages/ForgotPassword';
import { NotFound } from './components/pages/NotFound';
import { UnderMaintenance } from './components/pages/UnderMaintenance';
import { UserDashboard } from './components/pages/UserDashboard';

function App() {

  const maintaince = false;

  return (
    <>

      {maintaince
        ? (
          <>
            <UnderMaintenance />
          </>
        )
        : (
          <>
            <Routes>

              <Route path="*" element={<NotFound />} />

              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/verify" element={<VerifyAccount />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              <Route path="/user/dashboard" element={<UserDashboard />} />


            </Routes>
          </>
        )
      }
    </>
  )
}

export default App
