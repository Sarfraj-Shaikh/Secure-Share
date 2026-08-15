import { Routes, Route } from 'react-router-dom';
import { Home } from './components/pages/Home';
import { Register } from './components/pages/Register';

function App() {

  return (
    <>

      <Routes>
        
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />

      </Routes>

    </>
  )
}

export default App
