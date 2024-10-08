import { Route, Routes } from 'react-router-dom'
import NavBar from './components/Navbar'
import AuthRoute from './components/AuthRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import useDarkMode from 'use-dark-mode'
import Demo from './pages/Demo'

window.global = globalThis

const App = () => {
    const darkMode = useDarkMode(false)

    return (
        <div>
            <NavBar />
            <div
                className="flex justify-center p-5"
                style={{ minHeight: '100vh' }}
            >
                <div className="w-full justify-center items-start flex">
                    <Routes>
                        <Route element={<AuthRoute />}>
                            <Route path="/" element={<Home />} />
                            <Route path="/home" element={<Home />} />
                        </Route>
                        <Route path="/login" element={<Login />} />
                        <Route path="/demo" element={<Demo />} />
                    </Routes>
                </div>
            </div>
        </div>
    )
}

export default App
