import { Link } from "react-router-dom"
import AccountNav from "../AccountNav"
import { useEffect, useState } from "react"
import axios from "axios"


export default function PlacePage(){

    const [places, setPlaces] = useState([])

    useEffect(() => {

        const fetch = async() => {
            const { data } = await axios.get('/api/place/v1/user-places')
            setPlaces(data)
        }

        fetch()
    }, [])
   
    return(
        <div>

            <AccountNav/>
            
           
            <div className="text-center">
                <Link to={'/account/places/new'} className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add new place
                </Link>
            </div>

            <div className="mt-4">
                {
                    places.length > 0 && (
                        places.map((place) => (
                            <div key={place._id}>
                                <Link to={`/account/places/${place._id}`} className="flex gap-2 cursor-pointer border p-4 rounded-2xl bg-gray-100">
                                    <div className="flex w-32 h-32 grow shrink-0">
                                        {
                                            place.photos.length > 0 && (
                                                <img className="object-cover rounded-2xl" src={'http://localhost:4000/uploads/' + place.photos[0]} alt="img"/>
                                            )
                                        }

                                    </div>
                                    <div className="grow-0 shrink">
                                        <h2 className="text-xl">{place.title}</h2>
                                        <p className="text-sm mt-2">{`${place.description.slice(0,250)}...`}</p>
                                    </div>
                                </Link>
                            </div>
                        ))
                    )
                }
            </div>
               
            
        </div>
    )
}
