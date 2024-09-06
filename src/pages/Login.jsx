import { Button, Card, CardBody, Input, Link } from '@nextui-org/react'
import { useState } from 'react'
import { useAuth } from '../context/AuthProvider'
import { useNavigate } from 'react-router-dom'
import { IoMdEye } from 'react-icons/io'
import { IoMdEyeOff } from 'react-icons/io'
import { IoIosMail } from 'react-icons/io'
import { FaKey } from 'react-icons/fa6'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { login, user } = useAuth()
    const [inputColor, setInputColor] = useState('')
    const [isVisible, setIsVisible] = useState(false)

    const toggleVisibility = () => setIsVisible(!isVisible)

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
                        startContent={<IoIosMail className="text-2xl" />}
                        color={inputColor}
                        labelPlacement="outside"
                        variant="bordered"
                        onValueChange={handleEmailChange}
                    />
                    <Input
                        placeholder="********"
                        label="Password"
                        size="md"
                        startContent={<FaKey className="text-l" />}
                        color={inputColor}
                        labelPlacement="outside"
                        variant="bordered"
                        onValueChange={handlePasswordChange}
                        endContent={
                            <button
                                className="focus:outline-none"
                                type="button"
                                onClick={toggleVisibility}
                                aria-label="toggle password visibility"
                            >
                                {isVisible ? (
                                    <IoMdEyeOff className="text-2xl text-default-400 pointer-events-none" />
                                ) : (
                                    <IoMdEye className="text-2xl text-default-400 pointer-events-none" />
                                )}
                            </button>
                        }
                        type={isVisible ? 'text' : 'password'}
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
                        <Link href="/LoomisLaundry/#/register">Register</Link>
                    </div>
                    <div className="w-100 text-center mt-1">
                        Forgot Password?{' '}
                        <Link href="/LoomisLaundry/#/passwordreset">
                            Click Here
                        </Link>
                    </div>
                </div>
            </CardBody>
        </Card>
    )
}

export default Login
