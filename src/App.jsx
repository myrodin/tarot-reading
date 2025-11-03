import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Reading from './pages/Reading';

function App() {
  return (
    <Router basename="/tarot-reading">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reading/:type" element={<Reading />} />
      </Routes>
    </Router>
  );
}

export default App;
