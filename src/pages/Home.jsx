import React from 'react'
import { useState } from 'react'
import { useAuth } from '../context/AuthProvider'
import Timer from '../components/Timer'
import { Button } from 'react-bootstrap'
import Washer from '../components/Washer'

const Home = () => {
    const { user } = useAuth()
    const defaultTime = new Date()
    defaultTime.setSeconds(defaultTime.getSeconds() + 600)
    const [time, setTime] = useState(defaultTime)

    const handleReset = () => {
        console.log("Changing time")
        const t = new Date()
        t.setSeconds(t.getSeconds() + 600)
        setTime(t)
    }
    return (
        <>
            <Washer />
            {/* <Timer expiryTimestamp={time} handleReset={handleReset} /> */}
        </>
    )
}

export default Home
