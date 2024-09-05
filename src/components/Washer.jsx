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
import {
    Button,
    Card,
    CircularProgress,
    Divider,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    Slider,
} from '@nextui-org/react'
import { CardBody, CardFooter, CardHeader, ModalHeader } from 'react-bootstrap'
import { useDisclosure } from '@nextui-org/react'

const Washer = ({ id }) => {
    const { user } = useAuth()
    const [washerState, setWasherState] = useState('') // States are WORKING, FINISHED, EMPTY, LOADED
    const [time, setTime] = useState(0)
    const [ownerName, setOwnerName] = useState('')
    const [initialValue, setInitialValue] = useState(7200)
    const [sliderModified, setSliderModified] = useState(false)
    const [sliderValue, setSliderValue] = useState(3600)

    const { isOpen, onOpen, onOpenChange } = useDisclosure()

    const washerModes = {
        NORMAL: 3600,
        ACTIVEWEAR: 2700,
        DELICATES: 3000,
        'BULKY ITEMS': 3300,
        TOWELS: 3900,
        'DRAIN & SPIN': 600,
        'QUICK WASH': 1800,
        COLORS: 2700,
        WHITES: 3900,
        'HEAVY DUTY': 4500,
        JEANS: 3600,
    }

    const dryerModes = {
        '15 min': 900,
        '30 min': 1800,
        '60 min': 3600,
        '90 min': 5400,
    }

    const { totalSeconds, seconds, minutes, hours, resume, restart } = useTimer(
        {
            expiryTimestamp: new Date(),
            autoStart: false,
            onExpire: () => setWasherState('FINISHED'),
        }
    )

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

            setInitialValue(data['initial_value'])
        }

        async function fetchData() {
            let data = await getLoadData(id)
            handleStateChange(data)
        }
        subscribeToRoom(id, handleStateChange)
        fetchData()
    }, [restart, id])

    // Called by Start New button
    const handleStartNew = (seconds) => {
        setTimer(seconds) //Replace with time selected
        setInitialValue(seconds)
        prepareNewTimer(id, user.id, seconds)
        setWasherState('LOADED')
    }

    // Called by Start button
    const handleStart = () => {
        resume()
        console.log('Initial: ', initialValue)
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

    const pad = (n) => (n < 10 ? '0' + n : n)

    return (
        <>
            <Card>
                <CardHeader>
                    {id === 1 ? (
                        <h2 className="font-bold text-2xl mt-4">
                            Washing machine
                        </h2>
                    ) : (
                        <h2 className="font-bold text-2xl mt-4">Dryer</h2>
                    )}
                    <p className="mb-2">{washerState}</p>
                </CardHeader>
                <CardBody>
                    <div className="flex flex-col justify-center items-center mt-2">
                        {washerState !== 'FINISHED' && (
                            <CircularProgress
                                value={totalSeconds}
                                valueLabel={`${pad(hours)}:${pad(
                                    minutes
                                )}:${pad(seconds)}`}
                                maxValue={initialValue}
                                size="large"
                                showValueLabel={
                                    washerState === 'EMPTY' ? false : true
                                }
                                classNames={{
                                    svg: 'w-36 h-36 drop-shadow-md',
                                    value: 'text-3xl font-semibold text-white',
                                }}
                                aria-label="Washer"
                            ></CircularProgress>
                        )}
                        {washerState === 'FINISHED' && (
                            <CircularProgress
                                isIndeterminate={true}
                                color="success"
                                size="large"
                                classNames={{
                                    svg: 'w-36 h-36 drop-shadow-md',
                                    value: 'text-3xl font-semibold text-white',
                                }}
                                aria-label="Washer"
                            ></CircularProgress>
                        )}

                        {washerState === 'FINISHED' && (
                            <div className="flex flex-row justify-between gap-3 m-4">
                                <Button onClick={handleEmpty}>Empty</Button>
                                <Button onClick={onOpen}>Start New Load</Button>
                            </div>
                        )}
                        {washerState === 'EMPTY' && (
                            <div className="flex flex-row justify-between gap-3 m-4">
                                <Button onClick={onOpen}>Start New Load</Button>
                            </div>
                        )}
                        {washerState === 'LOADED' && (
                            <>
                                <div className="flex flex-row justify-between gap-3 m-4">
                                    <Button onClick={handleStart}>Start</Button>
                                    <Button onClick={handleEmpty}>Empty</Button>
                                    <Button onClick={onOpen}>
                                        Change timer
                                    </Button>
                                </div>
                            </>
                        )}
                        {washerState === 'WORKING' && (
                            <div className="flex flex-row justify-between gap-3 m-4">
                                <Button onClick={handleFinish}>Finish</Button>
                            </div>
                        )}
                    </div>
                </CardBody>
                <Divider />
                <CardFooter className="m-2">
                    {washerState !== 'EMPTY' && <p>Loaded by {ownerName}</p>}
                </CardFooter>
            </Card>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalBody>
                                <div className="grid grid-cols-2 gap-2 mt-10">
                                    {id === 1 ? (
                                        Object.keys(washerModes).map((mode) => (
                                            <Button
                                                onClick={() => {
                                                    setSliderModified(false)
                                                    handleStartNew(
                                                        washerModes[mode]
                                                    )
                                                    onClose()
                                                }}
                                                key={mode}
                                            >
                                                {mode}
                                            </Button>
                                        ))
                                    ) : (
                                        <>
                                            {Object.keys(dryerModes).map(
                                                (mode) => (
                                                    <Button
                                                        onClick={() => {
                                                            setSliderModified(
                                                                false
                                                            )
                                                            handleStartNew(
                                                                dryerModes[mode]
                                                            )
                                                            onClose()
                                                        }}
                                                        key={mode}
                                                    >
                                                        {mode}
                                                    </Button>
                                                )
                                            )}
                                            <Button
                                                className="col-span-2"
                                                onClick={() => {
                                                    setSliderModified(false)
                                                    handleStartNew(5400)
                                                    onClose()
                                                }}
                                            >
                                                Default
                                            </Button>
                                        </>
                                    )}

                                    <Slider
                                        className="col-span-2 mt-4"
                                        label="Custom time"
                                        minValue={0}
                                        maxValue={7200}
                                        step={300}
                                        value={sliderValue}
                                        getValue={(value) => {
                                            return `${pad(
                                                Math.floor(value / 3600)
                                            )}:${pad(
                                                (value % 3600) / 60
                                            )}:${pad(value % 60)}`
                                        }}
                                        onChange={(value) => {
                                            setSliderModified(true)
                                            setSliderValue(value)
                                        }}
                                        size="lg"
                                        style={{
                                            color: '#000',
                                        }}
                                    />
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="primary"
                                    variant="ghost"
                                    onPress={() => {
                                        if (sliderModified) {
                                            handleStartNew(sliderValue)
                                        }
                                        onClose()
                                    }}
                                >
                                    Set timer
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}

export default Washer
