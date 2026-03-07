
import './App.css'

import { Route, Routes } from "react-router-dom";
import Homepage from './pages/Homepage'
import Login from './pages/Login'
import Register from './pages/Register'
import { Editorpage } from './pages/Editorpage';
import ProfilePage from './pages/Profile';
function App() {


  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/editor" element={<Editorpage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>

    </>
  )
}

export default App
