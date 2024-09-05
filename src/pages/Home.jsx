import Dryer from '../components/Dryer'
import Washer from '../components/Washer'
import { useEffect, useState } from 'react'
import { subscribeToRoom } from '../javascript/time_database'

const Home = () => {
    const [update, setUpdate] = useState(false)

    useEffect(() => {
        const updateChildren = () => {
            console.log('updating')
            setUpdate(!update)
        }
        subscribeToRoom(updateChildren)
    }, [update])

    return (
        <div className="flex flex-col gap-5">
            <Washer update={update} />
            <Dryer update={update} />
            {/* <Washer id={2} /> */}
        </div>
    )
}

export default Home
