import { useEffect, useState } from "react";
import AccountNav from "../AccountNav";
import { differenceInCalendarDays, format } from "date-fns"
import { Link } from "react-router-dom";
import axios from "../api/axios";

export default function BookingsPage() {
    const [bookingsData, setBookingsData] = useState([])

    useEffect(() => {
        const fetch = async () => {
            const { data } = await axios.get("/api/booking/v1/bookings")
            console.log(data)
            setBookingsData(data)
        }
        
        fetch()
    }, [])

    
    return (
        <div>
            <AccountNav/>
            <div>
                {
                    bookingsData.length > 0 && bookingsData.map((booking) => (
                        <Link to={'/account/bookings/'+ booking._id} key={booking._id}>
                            <div className="flex gap-4 bg-gray-200 rounded-2xl overflow-hidden">
                                {
                                    booking.place.photos?.[0] && (
                                        <div className="w-32 ">
                                            <img 
                                                className="aspect-square object-cover" 
                                                src={"http://localhost:4000/uploads/" + booking.place.photos?.[0]} 
                                                alt="img"/>
                                        </div>
                                    )
                                }
                                <div className="py-2 pr-2 grow">
                                    <h2 className="text-xl">{booking.place.title}</h2>
                                    <div className="mt-2 ">
                                        
                                            <div>
                                                {`From : ${format(new Date(booking.checkIn), 'yyyy-MM-dd')}`}  
                                            </div>
                                        
                                            <div>
                                                {`To : ${format( new Date(booking.checkOut), 'yyyy-MM-dd')}`}
                                            </div>
                                        
                                    </div>
                                    <div className="text-lg">
                                        {differenceInCalendarDays( new Date(booking.checkOut), new Date(booking.checkIn))} Nights | Price : {booking.price}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )
                )}
            </div>
        </div>
    )
}