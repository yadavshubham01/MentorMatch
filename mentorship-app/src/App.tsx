import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { Signup } from './pages/Signup'
import { Signin } from './pages/Signin'
import './App.css'
import Profile from './pages/Profile'
import Dashboard from './pages/Dashboard'
import EditProfile from './pages/EditProfile'
import BrowseUsers from './pages/Browers'
import { Notification } from './pages/Notification'

function App() {

  return (
    <>
     <BrowserRouter>
       <Routes>
        <Route path='/' element={<Signup/>}></Route>
        <Route path='/signin' element={<Signin/>}></Route>
        <Route path='/profile' element={<Profile/>}></Route>
        <Route path='/dashboard' element={<Dashboard/>}></Route>
        <Route path='/edit-profile' element={<EditProfile/>}></Route>
        <Route path='/browser' element={<BrowseUsers/>}></Route>
        <Route path='/notification' element={<Notification/>}></Route>
       </Routes>     
     </BrowserRouter>
    </>
  )
}

export default App
