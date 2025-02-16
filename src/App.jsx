import { Routes, Route } from 'react-router-dom'
import Admin from './routes/Admin';

function App() {
  return (
    <div>
      <Routes>
        <Route element={<Admin />} path='/*' />
      </Routes>
    </div>
  );
}

export default App;
