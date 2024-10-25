import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { CalculatorPage } from './pages/CalculatorPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/calculator/:id" element={<CalculatorPage />} />
      </Routes>
    </Layout>
  );
}

export default App;