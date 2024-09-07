import { Route, Routes } from 'react-router-dom'
import NavBar from './components/Navbar'
import AuthRoute from './components/AuthRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import PasswordReset from './pages/PasswordReset'
import Register from './pages/Register'
import UpdatePassword from './pages/UpdatePassword'
import useDarkMode from 'use-dark-mode'

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
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route
                            path="/passwordreset"
                            element={<PasswordReset />}
                        />
                        <Route
                            path="/update-password"
                            element={<UpdatePassword />}
                        />
                    </Routes>
                </div>
            </div>
        </div>
    )
}

export default App
