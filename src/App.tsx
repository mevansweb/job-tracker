import { BrowserRouter, Routes, Route } from "react-router-dom";

import Assessments from "./pages/assessments";
import Layout from './components/layout'
import Home from './pages/home'
import Practice from './pages/practice'
import Search from './pages/search'
import Settings from './pages/settings'
import Tasks from './pages/tasks'
import './App.css'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/assessments" element={<Layout><Assessments /></Layout>} />
          <Route path="/practice" element={<Layout><Practice /></Layout>} />
          <Route path="/search" element={<Layout><Search /></Layout>} />
          <Route path="/settings" element={<Layout><Settings /></Layout>} />
          <Route path="/tasks" element={<Layout><Tasks /></Layout>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
