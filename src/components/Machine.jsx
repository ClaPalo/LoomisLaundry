import { useEffect } from 'react'
import { useState } from 'react'
import { useTimer } from 'react-timer-hook'
import { useAuth } from '../context/AuthProvider'
import { getUserName } from '../javascript/user_database'
import { resetWasherState } from '../javascript/time_database'
import {
    emptyLoad,
    finishLoad,
    getLoadData,
    prepareNewTimer,
    setTimeAndStart,
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
import { CardBody, CardFooter, CardHeader } from 'react-bootstrap'
import { useDisclosure } from '@nextui-org/react'

const Machine = ({ update, id }) => {
    const { user } = useAuth()
    const [washerState, setWasherState] = useState('') // States are WORKING, FINISHED, EMPTY, LOADED
    const [time, setTime] = useState(0)
    const [ownerName, setOwnerName] = useState('')
    const [initialValue, setInitialValue] = useState(7200)
    const [sliderModified, setSliderModified] = useState(false)
    const [sliderValue, setSliderValue] = useState(3600)

    const { isOpen, onOpen, onOpenChange } = useDisclosure()

    const modes = {
        1: {
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
        },
        2: {
            '15 min': 900,
            '30 min': 1800,
            '60 min': 3600,
            '90 min': 5400,
        },
    }

    const { totalSeconds, seconds, minutes, hours, resume, restart } = useTimer(
        {
            expiryTimestamp: new Date(),
            autoStart: false,
            onExpire: () => {
                setWasherState('FINISHED'), sendEmailNotification(user.email) // Trigger email notification when timer expires
            },
        }
    )

    const sendEmailNotification = (email) => {}

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
                setTimer(0)
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
        fetchData()
    }, [update, restart])

    // Called by Start New button
    const handleStartNew = (seconds) => {
        setTimer(seconds) //Replace with time selected
        setInitialValue(seconds)
        prepareNewTimer(id, user.id, seconds)
        setOwnerName(user.name)
        setWasherState('LOADED')
    }

    // Called by Start button
    const handleStart = () => {
        if (totalSeconds > 0) {
            resume()
            console.log('Initial: ', initialValue)
            let t = new Date()
            t.setSeconds(t.getSeconds() + time)
            setTimeAndStart(id, t.getTime() / 1000, user.id)
            setWasherState('WORKING')
        }
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

    const handleReset = () => {
        resetWasherState(id)
    }

    const pad = (n) => (n < 10 ? '0' + n : n)

    return (
        <>
            <Card className="dark:bg-neutral-900/80 md:w-1/2 lg:w-1/4 w-full h-full bg-slate-200/70">
                <CardHeader>
                    <h2 className="font-bold text-2xl mt-4 text-blue-600">
                        {id === 1 ? 'Washing Machine' : 'Dryer'}
                    </h2>
                    <p className="mb-2 text-blue-500">{washerState}</p>
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
                                    value: 'text-3xl font-semibold',
                                    track: 'stroke-gray-200/70 dark:stroke-white/20',
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
                                <Button
                                    onClick={handleEmpty}
                                    variant="flat"
                                    color="primary"
                                >
                                    Empty
                                </Button>
                                <Button
                                    onClick={onOpen}
                                    variant="flat"
                                    color="primary"
                                >
                                    Start New Load
                                </Button>
                            </div>
                        )}
                        {washerState === 'EMPTY' && (
                            <div className="flex flex-row justify-between gap-3 m-4">
                                <Button
                                    onClick={onOpen}
                                    variant="flat"
                                    color="primary"
                                >
                                    Start New Load
                                </Button>
                            </div>
                        )}
                        {washerState === 'LOADED' && (
                            <>
                                <div className="flex flex-row justify-between gap-3 m-4">
                                    <Button
                                        onClick={handleStart}
                                        variant="flat"
                                        color="primary"
                                    >
                                        Start
                                    </Button>
                                    <Button
                                        onClick={handleEmpty}
                                        variant="flat"
                                        color="primary"
                                    >
                                        Empty
                                    </Button>
                                    <Button
                                        onClick={onOpen}
                                        variant="flat"
                                        color="primary"
                                    >
                                        Change timer
                                    </Button>
                                </div>
                            </>
                        )}
                        {washerState === 'WORKING' && (
                            <div className="flex flex-row justify-between gap-3 m-4">
                                <Button
                                    onClick={handleFinish}
                                    variant="flat"
                                    color="primary"
                                >
                                    Finish
                                </Button>
                            </div>
                        )}
                        {washerState === 'ERROR' && (
                            <div className="flex flex-row justify-between gap-3 m-4">
                                <Button
                                    onClick={handleReset}
                                    variant="flat"
                                    color="primary"
                                >
                                    Reset
                                </Button>
                            </div>
                        )}
                    </div>
                </CardBody>
                <Divider />
                <CardFooter className="m-2">
                    {washerState !== 'EMPTY' && <p>Loaded by {ownerName}</p>}
                </CardFooter>
            </Card>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                backdrop="blur"
                className=""
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalBody>
                                <div className="grid grid-cols-2 gap-2 mt-10">
                                    {Object.keys(modes[id]).map((mode) => (
                                        <Button
                                            onClick={() => {
                                                setSliderModified(false)
                                                handleStartNew(modes[id][mode])
                                                onClose()
                                            }}
                                            key={mode}
                                            variant="flat"
                                            color="primary"
                                        >
                                            {mode}
                                        </Button>
                                    ))}
                                    <Button
                                        onClick={() => {
                                            setSliderModified(false)
                                            handleStartNew(3600)
                                            onClose()
                                        }}
                                        variant="flat"
                                        color="primary"
                                        className="col-span-2"
                                    >
                                        NORMAL
                                    </Button>
                                    <Divider className="col-span-2 m-2" />
                                    <Slider
                                        className="col-span-2"
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
                                            color: '#006FEE',
                                        }}
                                    />
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="success"
                                    variant="shadow"
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

export default Machine
