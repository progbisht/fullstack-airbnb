import { useContext, useEffect, useState } from "react"
import { differenceInCalendarDays } from "date-fns"
import axios from "axios"
import { Navigate } from "react-router-dom"
import { UserContext } from "./UserContext"

export default function BookingWidget({place}) {
    const [checkIn, setCheckIn] = useState("")
    const [checkOut, setCheckOut] = useState("")
    const [maxGuests, setMaxGuests] = useState(1)
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [redirect, setRedirect] = useState("")
    const user = useContext(UserContext)
 
    useEffect(() => {
        if(user){
            setName(user.name)
        }
    },[user])

    let numberOfNights = 0
    
    if(checkIn && checkOut){
        numberOfNights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn))
    }

    const handleBookThisPlace = async (e) => {
        e.preventDefault()

        try{
            const response = await axios.post('/api/booking/v1/bookings',{
                place: place._id,
                checkIn,
                checkOut,
                maxGuests,
                name,
                phone,
                price: (numberOfNights * place.price)
            })
            console.log(response);
            setRedirect(`/account/bookings/${response.data._id}`)
        }
        catch(err){
            console.log(err);
        }
    }

    if(redirect){
        return (
            <Navigate to={redirect}/>
        )
    }

    return (
        <div className="bg-white shadow p-4 rounded-2xl">
            <div className="text-2xl text-center">
                Price: {place.price}
            </div>

            <div className="border rounded-2xl mt-4">
                <div className="flex">
                    <div className="py-3 px-4 ">
                        <label>Check In : </label>
                        <input 
                            type="date"
                            value={checkIn}
                            onChange={(e)=>setCheckIn(e.target.value)}
                        />
                    </div>
                    <div className="py-3 px-4">
                        <label>Check Out : </label>
                        <input 
                            type="date"
                            value={checkOut}
                            onChange={(e)=>setCheckOut(e.target.value)}
                        />
                    </div>
                    
                </div>
                <div className="py-3 px-4 border-t">
                    <label>Number of guests : </label>
                    <input
                        type="number" 
                        value={maxGuests}
                        onChange={(e)=>setMaxGuests(e.target.value)}
                    />
                </div>
                { 
                    numberOfNights > 0 && (
                        <div>

                            <div className="py-3 px-4 border-t">
                                <label>Your full name : </label>
                                <input
                                    type="text" 
                                    value={name}
                                    onChange={(e)=>setName(e.target.value)}
                                />
                            </div>
                            
                            <div className="py-3 px-4 border-t">
                                <label>Your phone number : </label>
                                <input
                                    type="tel" 
                                    value={phone}
                                    onChange={(e)=>setPhone(e.target.value)}
                                />
                            </div>
                        </div>
                )}
            </div>
            <button onClick={handleBookThisPlace} className="primary mt-4">
                Book Now &nbsp;
                { 
                    numberOfNights > 0 && (
                        <span>
                            {numberOfNights * place.price}
                        </span>
                )}
            </button>

        </div>
    )
}