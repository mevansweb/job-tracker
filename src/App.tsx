import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from './pages/home'
import Tasks from './pages/tasks'
import ResumeHome from './pages/resume-builder/home'
import Search from './pages/search'
import Practice from './pages/practice'
import Settings from './pages/settings'
import Layout from './components/layout'
import TestPrep from "./pages/test-prep"
import Assessments from './pages/assessments'

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
          <Route path="/test-prep" element={<Layout><TestPrep /></Layout>} />
          <Route path="/resume" element={<Layout><ResumeHome /></Layout>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
