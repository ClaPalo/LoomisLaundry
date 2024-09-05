import { Button, Navbar, NavbarContent, Link } from '@nextui-org/react'
import { useAuth } from '../context/AuthProvider'

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
            <NavbarContent justify="end">
                {!auth && (
                    <Button
                        as={Link}
                        color="primary"
                        variant="shadow"
                        href="/#/LoomisLaundry/login"
                    >
                        Login
                    </Button>
                )}
                {!auth && (
                    <Button
                        as={Link}
                        variant="ghost"
                        href="/#/LoomisLaundry/register"
                    >
                        Register
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
