import Washer from '../components/Washer'

const Home = () => {
    return (
        <div className="flex flex-col gap-5">
            <Washer id={1} />
            <Washer id={2} />
        </div>
    )
}

export default Home
