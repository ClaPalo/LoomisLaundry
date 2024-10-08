import { Button, Navbar, NavbarContent, Link } from '@nextui-org/react'
import { useAuth } from '../context/AuthProvider'
import { ThemeSwitcher } from './ThemeSwitcher'

const NavBar = () => {
    const { auth, signOut } = useAuth()

    const handleLogout = async (e) => {
        e.preventDefault()
        try {
            const { error } = await signOut()
            console.log(error)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Navbar>
            <NavbarContent justify="start">
                <ThemeSwitcher />
            </NavbarContent>
            <NavbarContent justify="end">
                {!auth && (
                    <Button
                        as={Link}
                        color="primary"
                        variant="shadow"
                        href="/LoomisLaundry/#/login"
                    >
                        Login
                    </Button>
                )}
                {auth && (
                    <Button
                        onClick={handleLogout}
                        color="danger"
                        variant="shadow"
                    >
                        Logout
                    </Button>
                )}
            </NavbarContent>
        </Navbar>
    )
}

export default NavBar
