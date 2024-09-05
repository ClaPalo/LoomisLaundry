import { useAuth } from '../context/AuthProvider'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

const AuthRoute = () => {
    const { user } = useAuth()
    const location = useLocation()

    return user ? (
        <Outlet />
    ) : (
        <Navigate
            to={'/#/LoomisLaundry/login'}
            replace
            state={{ path: location.pathname }}
        />
    )
}

export default AuthRoute
