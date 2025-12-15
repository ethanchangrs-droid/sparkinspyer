import { Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/HomePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/tool/:slug" element={<HomePage />} />
    </Routes>
  );
}

export default App;

