import MachineDemo from '../components/MachineDemo'
import { useEffect, useState } from 'react'
import { subscribeToRoom } from '../javascript/time_database_demo'

const Demo = () => {
    const [update, setUpdate] = useState(false)

    useEffect(() => {
        const updateChildren = () => {
            console.log('updating')
            setUpdate(!update)
        }
        subscribeToRoom(updateChildren)
    }, [update])

    return (
        <div className="flex flex-col gap-5 justify-center items-center w-full">
            <MachineDemo update={update} id={1} />
            <MachineDemo update={update} id={2} />
            {/* <Washer id={2} /> */}
        </div>
    )
}

export default Demo
