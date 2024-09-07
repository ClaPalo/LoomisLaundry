import React, { useRef, useState } from 'react'
import { useAuth } from '../context/AuthProvider'
import { useNavigate } from 'react-router-dom'
import { Card, Button, CardBody, Input } from '@nextui-org/react'

const UpdatePassword = () => {
    const { updatePassword } = useAuth()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handlePasswordChange = (e) => {
        setPassword(e)
        setErrorMsg('')
    }

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e)
        setErrorMsg('')
    }

    const handleSubmit = async (e) => {
        if (password === '' || confirmPassword === '') {
            setErrorMsg('Please fill all the fields')
            return
        }
        if (password !== confirmPassword) {
            setErrorMsg("Passwords doesn't match. Try again")
            return
        }
        try {
            setErrorMsg('')
            setLoading(true)
            const { data, error } = await updatePassword(password)
            if (!error) {
                navigate('/')
            }
        } catch (error) {
            setErrorMsg('Error in Updating Password. Please try again')
        }
        setLoading(false)
    }

    return (
        <>
            <Card
                className="w-full md:w-1/2 lg:w-1/4 dark:bg-neutral-900/80 bg-white/60"
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            >
                <CardBody>
                    <h2 className="text-center mb-4">Update Password</h2>
                    <div className="flex flex-col gap-4">
                        <Input
                            placeholder="********"
                            isRequired
                            type="password"
                            label="Password"
                            size="md"
                            labelPlacement="outside"
                            variant="bordered"
                            onValueChange={handlePasswordChange}
                        />
                        <Input
                            placeholder="********"
                            isRequired
                            type="password"
                            label="Confirm Password"
                            size="md"
                            labelPlacement="outside"
                            variant="bordered"
                            onValueChange={handleConfirmPasswordChange}
                        />
                        {errorMsg && (
                            <div className="w-100 text-center mt-2 text-danger">
                                {errorMsg}
                            </div>
                        )}
                        {loading && (
                            <Button
                                variant="shadow"
                                color="primary"
                                onClick={handleSubmit}
                                isLoading
                            >
                                Update
                            </Button>
                        )}
                        {!loading && (
                            <Button
                                variant="shadow"
                                color="primary"
                                onClick={handleSubmit}
                            >
                                Update
                            </Button>
                        )}
                    </div>
                </CardBody>
            </Card>
        </>
    )
}

export default UpdatePassword
