import React, { useEffect } from 'react'
import{BrowserRouter,Routes,Route} from 'react-router-dom'
import NavBar from './components/NavBar'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import SettingPage from './pages/SettingPage'
import SingUpPage from './pages/SingUpPage'
import { useAuthStore } from './store/useAuthStore'
import { useThemeStore } from './store/useThemeStore'
import {Loader} from 'lucide-react'
import { Navigate } from 'react-router-dom'
function App() {
  const {authUser,checkAuth,ischeckingAuth}=useAuthStore();
  const {theme}=useThemeStore();

  useEffect(()=>{
    checkAuth();
  },[checkAuth]);

  if(ischeckingAuth && !authUser) return (
    <div className='flex items-center justify-center h-screen'>
      <Loader className='size-10 animate-spin'/>
    </div>
  )

  return (
    <div  data-theme={theme}>
      <BrowserRouter>
      <NavBar/>
      <Routes>
        <Route path="/" element ={authUser ?<HomePage/> : <Navigate to="/login"/>}/>
        <Route path="/signup" element ={!authUser ?<SingUpPage/> : <Navigate to="/"/>}/>
        <Route path="/settings" element ={<SettingPage/>}/>
        <Route path="/profile" element ={authUser ?<ProfilePage/> : <Navigate to="/login"/>}/>
        <Route path="/login" element ={!authUser ?<LoginPage/> : <Navigate to="/"/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
