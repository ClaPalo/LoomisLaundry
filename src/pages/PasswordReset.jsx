import { useState } from 'react'
import { useAuth } from '../context/AuthProvider'
import { Card, CardBody, Input, Button, Link } from '@nextui-org/react'

const PasswordReset = () => {
    const { passwordReset } = useAuth()
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [msg, setMsg] = useState('')

    const handleEmailChange = (e) => {
        setEmail(e)
        setMsg('')
    }

    const handleSubmit = async (e) => {
        try {
            setLoading(true)
            if (email !== '') {
                const { data, error } = await passwordReset(email)
                console.log(error)
                console.log(data)
                setMsg('Password reset has been sent to your email')
            } else {
                setMsg('Please enter your email')
            }
        } catch (e) {
            console.log(e)
        }
        setLoading(false)
    }

    return (
        <>
            <Card>
                <CardBody>
                    <h2 className="text-center mb-4">Login</h2>
                    <div className="flex flex-col gap-4">
                        <Input
                            placeholder="johndoe@gmail.com"
                            autofocus
                            type="email"
                            label="Email"
                            size="md"
                            labelPlacement="outside"
                            variant="bordered"
                            onValueChange={handleEmailChange}
                        />

                        {msg && (
                            <div className="w-100 text-center mt-2">{msg}</div>
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
                        {!loading && (
                            <Button
                                variant="shadow"
                                color="primary"
                                onClick={handleSubmit}
                            >
                                Login
                            </Button>
                        )}
                        <div className="w-100 text-center mt-2">
                            Back to Login?{' '}
                            <Link href="/LoomisLaundry/#/LoomisLaundry/login">
                                Login
                            </Link>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </>
    )
}

export default PasswordReset
