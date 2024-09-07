import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { Card, CardBody, Input, Button, Link } from '@nextui-org/react'
import { IoMdEye } from 'react-icons/io'
import { IoMdEyeOff } from 'react-icons/io'

const Register = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [msg, setMsg] = useState('')
    const [loading, setLoading] = useState(false)
    const [inputColor, setInputColor] = useState('')
    const [isVisible, setIsVisible] = useState(false)

    const toggleVisibility = () => setIsVisible(!isVisible)

    const register = (email, password, name, surname) =>
        supabase.auth.signUp({
            email,
            password,
            options: {
                data: { name: name, surname: surname },
                emailRedirectTo: 'https://www.paloscia.com/LoomisLaundry',
            },
        })

    const handleNameChange = (e) => {
        setName(e)
        setErrorMsg('')
        setInputColor('')
    }

    const handleSurnameChange = (e) => {
        setSurname(e)
        setErrorMsg('')
        setInputColor('')
    }

    const handleEmailChange = (e) => {
        setEmail(e)
        setErrorMsg('')
        setInputColor('')
    }

    const handlePasswordChange = (e) => {
        setPassword(e)
        setErrorMsg('')
        setInputColor('')
    }

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e)
        setErrorMsg('')
        setInputColor('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (password === '' || email === '' || confirmPassword === '') {
            setErrorMsg('Please fill all the fields')
            setInputColor('danger')
            return
        }
        if (password !== confirmPassword) {
            setErrorMsg("Passwords don't match")
            setInputColor('danger')
            return
        }
        try {
            setErrorMsg('')
            setLoading(true)
            const { data, error } = await register(
                email,
                password,
                name,
                surname
            )
            if (!error && data) {
                setMsg(
                    'Registration Successful. Check your email to confirm your account'
                )
            }
        } catch (error) {
            setErrorMsg('Error in Creating Account. Ask Claudio for help.')
        }
        setLoading(false)
    }

    return (
        <Card
            className="w-full md:w-1/2 lg:w-1/4"
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        >
            <CardBody className="p-5">
                <div className="flex flex-col gap-4">
                    <Input
                        placeholder="John"
                        autoFocus
                        isRequired
                        type="text"
                        label="Name"
                        size="md"
                        labelPlacement="outside"
                        variant="bordered"
                        color={inputColor}
                        onValueChange={handleNameChange}
                    />
                    <Input
                        placeholder="Doe"
                        isRequired
                        type="text"
                        label="Surname"
                        size="md"
                        labelPlacement="outside"
                        variant="bordered"
                        color={inputColor}
                        onValueChange={handleSurnameChange}
                    />
                    <Input
                        placeholder="johndoe@gmail.com"
                        isRequired
                        type="email"
                        label="Email"
                        size="md"
                        labelPlacement="outside"
                        variant="bordered"
                        color={inputColor}
                        onValueChange={handleEmailChange}
                    />
                    <Input
                        placeholder="********"
                        isRequired
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
                        label="Password"
                        size="md"
                        labelPlacement="outside"
                        variant="bordered"
                        color={inputColor}
                        onValueChange={handlePasswordChange}
                    />
                    <Input
                        placeholder="********"
                        isRequired
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
                        label="Confirm Password"
                        size="md"
                        labelPlacement="outside"
                        variant="bordered"
                        color={inputColor}
                        onValueChange={handleConfirmPasswordChange}
                    />
                    {errorMsg && (
                        <div className="w-100 text-center mt-2 text-danger">
                            {errorMsg}
                        </div>
                    )}
                    {msg && (
                        <div className="w-100 text-center mt-2 text-success">
                            {msg}
                        </div>
                    )}
                    {loading && (
                        <Button
                            variant="shadow"
                            color="primary"
                            onClick={handleSubmit}
                            isLoading
                        >
                            Register
                        </Button>
                    )}
                    {!loading && (
                        <Button
                            variant="shadow"
                            color="primary"
                            onClick={handleSubmit}
                        >
                            Register
                        </Button>
                    )}
                    <div className="w-100 text-center mt-2">
                        Already registered?{' '}
                        <Link href="/LoomisLaundry/#/login">Login</Link>
                    </div>
                </div>
            </CardBody>
        </Card>
    )
}

export default Register
