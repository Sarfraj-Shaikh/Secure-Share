import { Routes, Route } from 'react-router-dom';
import { Home } from './components/pages/Home';
import { Register } from './components/pages/Register';
import { Login } from './components/pages/Login';
import { VerifyAccount } from './components/pages/VerifyAccount';
import { ForgotPassword } from './components/pages/ForgotPassword';

function App() {

  return (
    <>

      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<VerifyAccount />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

      </Routes>

    </>
  )
}

export default App
