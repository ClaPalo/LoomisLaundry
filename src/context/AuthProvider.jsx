import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { getUserName } from '../javascript/user_database'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

const login = (email, password) =>
    supabase.auth.signInWithPassword({ email, password })

const signOut = () => supabase.auth.signOut()

const passwordReset = (email) =>
    supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'http://localhost:5173/update-password',
    })

const updatePassword = (updatedPassword) =>
    supabase.auth.updateUser({ password: updatedPassword })

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(false)
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')

    useEffect(() => {
        setLoading(true)
        const getUser = async () => {
            const { data } = await supabase.auth.getUser()
            const { user: currentUser } = data
            setUser(currentUser ?? null)
            if (currentUser) {
                getUserName(currentUser.id).then((data) => {
                    setName(data[0].name)
                    setSurname(data[0].surname)
                })
            }
            setAuth(currentUser ? true : false)
            setLoading(false)
        }
        getUser()
        const { data } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (event == 'PASSWORD_RECOVERY') {
                    setAuth(false)
                } else if (event === 'SIGNED_IN') {
                    setUser(session.user)
                    getUserName(session.user.id).then((data) => {
                        setName(data[0].name)
                        setSurname(data[0].surname)
                    })
                    setAuth(true)
                } else if (event === 'SIGNED_OUT') {
                    setAuth(false)
                    setUser(null)
                    setName('')
                    setSurname('')
                }
            }
        )
        return () => {
            data.subscription.unsubscribe()
        }
    }, [])

    return (
        <AuthContext.Provider
            value={{
                auth,
                user,
                name,
                surname,
                login,
                signOut,
                passwordReset,
                updatePassword,
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
