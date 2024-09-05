import { Button, Card, CardBody, Input, Link } from '@nextui-org/react'
import { useState } from 'react'
import { useAuth } from '../context/AuthProvider'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { login, user } = useAuth()
    const [inputColor, setInputColor] = useState('')

    const handleEmailChange = (e) => {
        setEmail(e)
        setInputColor('')
        setErrorMsg('')
    }

    const handlePasswordChange = (e) => {
        setPassword(e)
        setInputColor('')
        setErrorMsg('')
    }

    const handleSubmit = async () => {
        try {
            setErrorMsg('')
            setLoading(true)
            if (password === '' || email === '') {
                setErrorMsg('Please fill in the fields')
                setInputColor('danger')
                setLoading(false)
                return
            }
            const {
                data: { user, session },
                error,
            } = await login(email, password)
            if (error) setErrorMsg(error.message)
            if (user && session) navigate('/')
        } catch (error) {
            setErrorMsg('Email or Password Incorrect')
        }
        setLoading(false)
    }
    return (
        <Card>
            <CardBody className="p-5">
                <div className="flex flex-col gap-4">
                    <Input
                        placeholder="johndoe@gmail.com"
                        autofocus
                        type="email"
                        label="Email"
                        size="md"
                        color={inputColor}
                        labelPlacement="outside"
                        variant="bordered"
                        onValueChange={handleEmailChange}
                    />
                    <Input
                        placeholder="********"
                        type="password"
                        label="Password"
                        size="md"
                        color={inputColor}
                        labelPlacement="outside"
                        variant="bordered"
                        onValueChange={handlePasswordChange}
                    />
                    {errorMsg && (
                        <div className="w-100 text-center mt-2 text-danger">
                            {errorMsg}
                        </div>
                    )}
                    {!loading && (
                        <Button
                            variant="shadow"
                            color="primary"
                            onClick={handleSubmit}
                        >
                            Login
                        </Button>
                    )}
                    {loading && (
                        <Button
                            variant="shadow"
                            color="primary"
                            onClick={handleSubmit}
                            isLoading
                        >
                            Login
                        </Button>
                    )}
                    <div className="w-100 text-center mt-2">
                        New User?{' '}
                        <Link href="/LoomisLaundry/register">Register</Link>
                    </div>
                    <div className="w-100 text-center mt-1">
                        Forgot Password?{' '}
                        <Link href="/LoomisLaundry/passwordreset">
                            Click Here
                        </Link>
                    </div>
                </div>
            </CardBody>
        </Card>
    )
}

export default Login
