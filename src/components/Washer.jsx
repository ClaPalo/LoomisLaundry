import { useEffect } from 'react'
import { useState } from 'react'
import Timer from './Timer'
import { useTimer } from 'react-timer-hook'
import { useAuth } from '../context/AuthProvider'
import { getUserName } from '../javascript/user_database'
import {
    emptyLoad,
    finishLoad,
    getLoadData,
    prepareNewTimer,
    setTimeAndStart,
    subscribeToRoom,
} from '../javascript/time_database'

const Washer = ({ id }) => {
    const { user } = useAuth()
    const [washerState, setWasherState] = useState('') // States are WORKING, FINISHED, EMPTY, LOADED
    const [time, setTime] = useState(0)
    const [ownerName, setOwnerName] = useState('')

    const { seconds, minutes, hours, resume, restart } = useTimer({
        expiryTimestamp: new Date(),
        autoStart: false,
        onExpire: () => setWasherState('FINISHED'),
    })

    // Set timer and update time state
    const setTimer = (seconds) => {
        const t = new Date()
        t.setSeconds(t.getSeconds() + seconds)
        setTime(seconds)
        restart(t, false)
    }

    useEffect(() => {
        const setTimerAndStart = (seconds) => {
            const t = new Date()
            t.setSeconds(t.getSeconds() + seconds)
            setTime(t)
            restart(t)
        }

        const handleStateChange = (data) => {
            console.log('Change detected')
            const currentTime = new Date().getTime() / 1000
            const end_time = data['end_time']
            const running = data['running']
            const empty = data['empty']
            console.log(currentTime, data['end_time'])
            if (end_time > currentTime && running && !empty) {
                const time_left = end_time - currentTime
                console.log('Setting timer to ', time_left)
                setTimerAndStart(time_left)
                console.log('Setting state to WORKING')
                setWasherState('WORKING')
            } else if (end_time <= currentTime && running && !empty) {
                console.log('Setting state to FINISHED')
                setWasherState('FINISHED')
            } else if (end_time <= currentTime && empty) {
                console.log('Setting state to EMPTY')
                setWasherState('EMPTY')
            } else if (!running && !empty) {
                console.log('Setting state to LOADED')
                setWasherState('LOADED')
            } else {
                console.log('Error in state')
                setWasherState('ERROR')
                console.log(data)
            }

			getUserName(data['owner']).then((res) => {
				setOwnerName(res[0].name)
			})
        }

        async function fetchData() {
            let data = await getLoadData(id)
            handleStateChange(data)
        }
        subscribeToRoom(id, handleStateChange)
        fetchData()
    }, [restart, id])

    // Called by Start New button
    const handleStartNew = () => {
        // Open popup to select time
        setTimer(10) //Replace with time selected
        prepareNewTimer(id, user.id)
        setWasherState('LOADED')
    }

    // Called by Start button
    const handleStart = () => {
        resume()
        let t = new Date()
        t.setSeconds(t.getSeconds() + time)
        setTimeAndStart(id, t.getTime() / 1000, user.id)
        setWasherState('WORKING')
    }

    // Called by Finish button
    const handleFinish = () => {
        finishLoad(id)
        setTimer(0)
        setWasherState('FINISHED')
    }

    // Called by Empty button
    const handleEmpty = () => {
        emptyLoad(id)
        setWasherState('EMPTY')
    }

    return (
        <>
            {id === 1 ? <h1>Washing machine</h1> : <h1>Dryer</h1>}
            <p>{washerState}</p>
            <Timer hours={hours} minutes={minutes} seconds={seconds} />
            {washerState === 'FINISHED' && (
                <>
                    <button onClick={handleEmpty}>Empty</button>
                    <button onClick={handleStartNew}>Start New Load</button>
                    <p>
                        Loaded by {ownerName}
                    </p>
                </>
            )}
            {washerState === 'EMPTY' && (
                <button onClick={handleStartNew}>Start New Load</button>
            )}
            {washerState === 'LOADED' && (
                <>
                    <button onClick={handleStart}>Start</button>
                    <button onClick={handleEmpty}>Empty</button>
                    <button onClick={handleStartNew}>Change timer</button>
                    <p>
                        Loaded by {ownerName}
                    </p>
                </>
            )}
            {washerState === 'WORKING' && (
                <>
                    <button onClick={handleFinish}>Finish</button>
                    <p>
                        Loaded by {ownerName}
                    </p>
                </>
            )}
        </>
    )
}

export default Washer
