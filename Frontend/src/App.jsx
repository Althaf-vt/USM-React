import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import HomePage from './pages/HomePage';
import UserLogin from './pages/UserLogin';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import UserProfilePage from './pages/UserProfilePage';
import AdminProfilePage from './pages/AdminProfilePage';
import AdminHomePage from './pages/AdminHome';
import AuthWatcher from './components/AuthWatcher';

const App = () => {
  return (
    <Router>
      <AuthWatcher>
      <Navbar/>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/login' element={<UserLogin/>}/>
        <Route path='/register' element={<RegisterPage/>}/>
        <Route path='/admin/login' element={<AdminLogin/>}/>
        <Route path='/admin/home' element={<AdminHomePage/>}/> 

        <Route path='/admin/profile' element={
          <ProtectedRoute adminOnly={true}>
            <AdminProfilePage/>
          </ProtectedRoute>
        }/>

        <Route path='/profile' element={
            <ProtectedRoute>
              <UserProfilePage/>
            </ProtectedRoute>
          }
        />



        <Route 
          path='/admin/dashboard'
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard/>
            </ProtectedRoute>
          }
        />
      </Routes>
      </AuthWatcher>
    </Router>
  )
}

export default App