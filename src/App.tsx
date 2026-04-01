import { BrowserRouter, Route, Routes } from 'react-router-dom'

import './App.css'
import Layout from './components/layout'
import Assessments from './pages/assessments'
import Home from './pages/home'
import Practice from './pages/practice'
import ResumeHome from './pages/resume-builder/home'
import Search from './pages/search'
import Settings from './pages/settings'
import Tasks from './pages/tasks'
import TestPrep from './pages/test-prep'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route
            path="/assessments"
            element={
              <Layout>
                <Assessments />
              </Layout>
            }
          />
          <Route
            path="/practice"
            element={
              <Layout>
                <Practice />
              </Layout>
            }
          />
          <Route
            path="/search"
            element={
              <Layout>
                <Search />
              </Layout>
            }
          />
          <Route
            path="/settings"
            element={
              <Layout>
                <Settings />
              </Layout>
            }
          />
          <Route
            path="/tasks"
            element={
              <Layout>
                <Tasks />
              </Layout>
            }
          />
          <Route
            path="/test-prep"
            element={
              <Layout>
                <TestPrep />
              </Layout>
            }
          />
          <Route
            path="/resume"
            element={
              <Layout>
                <ResumeHome />
              </Layout>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
