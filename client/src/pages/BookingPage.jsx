import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns"
import axios from "../api/axios";


export default function BookingPage() {

    const [userBookings, setUserBookings] = useState(null)
    
    const { id } = useParams()
    


    useEffect(() => {
    
        if(id){
            const fetch = async () => {
                
                const { data } = await axios.get(`/api/booking/v1/bookings/${id}`)
                console.log(data)
                setUserBookings(data[0])
            }
            
            fetch()
        }


    }, [id])

    if(!userBookings){
        return ""
    }
    
    

    return (
        <>
            {
                userBookings && (

                <div className="mt-4 bg-gray-100 px-8 pt-8 rounded-2xl">
                    <h1 className="text-2xl">{userBookings.place.title}</h1>
                    <a className="flex gap-1 my-3 font-semibold underline" target="_blank" rel="noreferrer" href={'https://maps.google.com/?q=' + userBookings.place.address}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                        </svg>

                        {userBookings.place.address}
                    </a>

                    

                    <div className="relative">
                        <div className="grid gap-2 grid-cols-[2fr_1fr] rounded-3xl overflow-hidden">
                            <div className="flex overflow-hidden">
                                {
                                    userBookings.place.photos?.[0] && (
                                        <div>
                                            <img className="object-cover cursor-pointer w-full h-full" src={"http://localhost:4000/uploads/" + userBookings.place.photos?.[0]} alt="img"/>
                                        </div>
                                    )
                                }
                            </div>
                            <div className="grid">
                                {
                                    userBookings.place.photos?.[1] && (
                                        <img className="aspect-square cursor-pointer object-cover" src={"http://localhost:4000/uploads/" + userBookings.place.photos?.[1]} alt="img"/>
                                    )
                                }
                                <div className="overflow-hidden">
                                    {
                                        userBookings.place.photos?.[1] && (
                                            <img className="aspect-square cursor-pointer object-cover relative top-2" src={"http://localhost:4000/uploads/" + userBookings.place.photos?.[1]} alt="img"/>
                                        )
                                    }
                                </div>
                            </div>
                            {/* <button onClick={() => setShowAllPhotos(true)} className="flex gap-1 absolute bottom-2 right-2 py-2 px-4 bg-white rounded-2xl shadow shadow-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                </svg>

                                Show all photos
                            </button>  */}
                        </div>
                    </div>

                    
                    <div className="mt-8 mb-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
                        <div className="p-4 m-4 rounded-2xl">
                            <h2 className="text-xl">Your Booking Information</h2>
                            <div className="mt-2 ">
                                                
                                <div>
                                    {`From : ${format(new Date(userBookings.checkIn), 'yyyy-MM-dd')}`}  
                                </div>
                            
                                <div>
                                    {`To : ${format( new Date(userBookings.checkOut), 'yyyy-MM-dd')}`}
                                </div>
                                
                            </div>
                        </div>
                        
                    </div>
                </div>
            )}
            
        </>
    )
}