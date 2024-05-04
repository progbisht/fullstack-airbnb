import { useEffect, useState } from "react"
import AccountNav from "../AccountNav"
import { Navigate, useParams } from "react-router-dom"
import axios from "../api/axios"

export default function NewPlaceForm(){

    const { id } = useParams()

    const [title, setTitle] = useState('')
    const [address, setAddress] = useState('')
    const [addedPhotos, setAddedPhtots] = useState([])
    const [photoLink, setPhotoLink] = useState('')
    const [description, setDescription] = useState('')
    const [perks, setPerks] = useState([])
    const [extraInfo, setExtraInfo] = useState('')
    const [checkIn, setCheckIn] = useState('')
    const [checkOut, setCheckOut] = useState('')
    const [maxGuests, setMaxGuests] = useState(1)
    const [price, setPrice] = useState(0)
    const [redirect, setRedirect] = useState(false)

    useEffect(() => {
        if(id){
            const fetch = async() => {
                const {data} = await axios.get(`/api/place/v1/places/${id}`)
                setTitle(data.title)
                setAddress(data.address)
                setAddedPhtots(data.photos)
                setDescription(data.description)
                setPerks(data.perks)
                setExtraInfo(data.extraInfo)
                setCheckIn(data.checkIn)
                setCheckOut(data.checkOut)
                setMaxGuests(data.maxGuests)
                setPrice(data.price)
            }
    
            fetch()
        }

    }, [id])

    async function handleAddPhotoByLink(e){
        e.preventDefault()

        const {data: imageName} = await axios.post('/api/place/v1/upload-by-link',{
            link: photoLink
        })
        setAddedPhtots(prev => (
            [...prev, imageName]
        ))

        setPhotoLink('')
    }

    async function handleUploadPhotos(e) {
        const files = e.target.files;
        const data = new FormData()

        for(let i=0; i<files.length; i++){
            data.append('photos', files[i])
        }

        const {data: fileName} = await axios.post('/api/place/v1/upload', data, {
            headers: 'Content-Type: multipart/form-data'
        })

        setAddedPhtots(prev => (
            [...prev, ...fileName]
        ))

    }

    function handleCheckbox(e){
        const { checked, name } = e.target

        if(checked){
            setPerks([...perks, name])
        }
        else{
            setPerks([...perks.filter(selectedNames => selectedNames !== name)])
        }
    }

    async function savePlace(e) {
        e.preventDefault()
        const placeData = {
            title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price
        }

        if(id){
            const response = await axios.put('/api/place/v1/places', { id, ...placeData })
            if(response.status === 200){
                setRedirect(true)
            }
        }
        else{
            const response = await axios.post('/api/place/v1/places', placeData)
            if(response.status === 200){
                setRedirect(true)
            }
        }
        
        
    }

    if(redirect){
        return <Navigate to={'/account/places'} />
    }

    function handleRemovePhoto(e, fileName){
        e.preventDefault()
        setAddedPhtots([...addedPhotos.filter(photo => photo !== fileName)])
    }

    function handleMainPhoto(e, fileName){
        e.preventDefault()
        setAddedPhtots([fileName, ...addedPhotos.filter(photo => photo !== fileName)])
    }

    return (
        <div className="">
            <AccountNav/>
            <form onSubmit={savePlace}>

                <label htmlFor="title" className="text-2xl mt-4">Title</label>
                <p className="text-gray-500 text-sm">Title for your place. It should be short and concise.</p>
                <input 
                    type="text" 
                    id="title" 
                    placeholder="Title: My Apartment"
                    value={title}
                    onChange={e=>setTitle(e.target.value)}
                />

                <label htmlFor="address" className="text-2xl mt-4">Address</label>
                <p className="text-gray-500 text-sm">Address of your place</p>
                <input 
                    type="text" 
                    id="address" 
                    placeholder="Address to this place"
                    value={address}
                    onChange={e=>setAddress(e.target.value)}
                />

                <label htmlFor="photos" className="text-2xl mt-4">Photos</label>
                <p className="text-gray-500 text-sm">Pictures of your place</p>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        id="photos" 
                        placeholder="Add link here"
                        value={photoLink}
                        onChange={e=>setPhotoLink(e.target.value)}
                    />

                    <button 
                        className="bg-primary text-white py-2 px-4 rounded-full"
                        onClick={handleAddPhotoByLink}
                    >
                        Add&nbsp;Photo
                    </button>
                </div>

                <div className="mt-2 mb-2 gap-2 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    { 
                        addedPhotos.length > 0 && addedPhotos.map((link) => (
                                <div key={link} className="h-64 flex relative">
                                    <img className="rounded-2xl w-full object-cover" src={"http://localhost:4000/uploads/" + link} alt={link}/>
                                    <button onClick={(e) =>handleRemovePhoto(e, link)} className="absolute cursor-pointer bottom-1 right-1 p-2 text-white bg-black bg-opacity-50 border rounded-xl">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>

                                    </button>
                                    <button onClick={(e) =>handleMainPhoto(e, link)} className="absolute cursor-pointer bottom-1 left-1 p-2 text-white bg-black bg-opacity-50 border rounded-xl">
                                        {
                                            link === addedPhotos[0] && (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                                                </svg>

                                            )
                                        }

                                        {
                                            link !== addedPhotos[0] && (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                                </svg>
                                            )
                                        }


                                    </button>
                                </div>
                            )
                        )
                    }
                    <label className="h-64 cursor-pointer flex justify-center items-center border bg-transparent rounded-2xl p-4 text-2xl text-gray-500">
                        <input
                            type="file"
                            className="hidden"
                            onChange={handleUploadPhotos}
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                        </svg>
                    </label>
                        
                </div>

                <label htmlFor="description" className="text-2xl mt-4">Description</label>
                <p className="text-gray-500 text-sm">Description of your place</p>
                <textarea 
                    id="description"
                    value={description}
                    onChange={e=>setDescription(e.target.value)}
                />

                <label htmlFor="perks" className="text-2xl mt-4">Perks</label>
                <p className="text-gray-500 text-sm">Select your perks for your place</p>
                <div className="grid gap-1 mt-2 mb-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer">
                        <input 
                            type="checkbox"
                            checked={perks.includes("wifi") } 
                            name="wifi"
                            onChange={handleCheckbox}    
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 0 1 1.06 0Z" />
                        </svg>
                        <span>Wi-Fi</span>
                    </label>

                    <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer">
                        <input 
                            type="checkbox"
                            checked={perks.includes("parking") } 
                            name="parking"
                            onChange={handleCheckbox}    
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                        </svg>
                        <span>Free parking spot</span>
                    </label>

                    <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer">
                        <input 
                            type="checkbox"
                            checked={perks.includes("tv") } 
                            name="tv"
                            onChange={handleCheckbox}    
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125Z" />
                        </svg>

                        <span>TV</span>
                    </label>

                    <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer">
                        <input 
                            type="checkbox"
                            checked={perks.includes("pets") } 
                            name="pets"
                            onChange={handleCheckbox}    
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z" clipRule="evenodd" />
                            <path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" />
                        </svg>

                        <span>Pets</span>
                    </label>
                </div>

                <label htmlFor="extraInfo" className="text-2xl mt-4">Extra info</label>
                <p className="text-gray-500 text-sm">House Rules etc.</p>
                <textarea 
                    id="extraInfo"
                    value={extraInfo}
                    onChange={e=>setExtraInfo(e.target.value)}
                />

                <label htmlFor="checkTime" className="text-2xl mt-4">Check-In & Check-Out</label>
                <p className="text-gray-500 text-sm">Add check-in and check-out times, remember to have some time window for cleaning the room between guests.</p>
                <div className="grid sm:grid-cols-3 gap-1">
                    <div>
                        <label className="mt-2 -mb-1 text-gray-500">Check-in time</label>
                        <input 
                            type="text" 
                            placeholder="14:00"
                            value={checkIn}
                            onChange={e=>setCheckIn(e.target.value)}
                        />
                        
                    </div>
                    <div>
                        <label className="mt-2 -mb-1 text-gray-500">Check-out time</label>
                        <input 
                            type="text" 
                            placeholder="11:00"
                            value={checkOut}
                            onChange={e=>setCheckOut(e.target.value)}    
                        />
                        
                    </div>
                    <div>
                        <label className="mt-2 -mb-1 text-gray-500">Max guests</label>
                        <input 
                            type="number"
                            value={maxGuests}
                            onChange={e=>setMaxGuests(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="mt-2 -mb-1 text-gray-500">Price per night</label>
                        <input 
                            type="number"
                            value={price}
                            onChange={e=>setPrice(e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <button className="primary text-white my-4">Save</button>
                </div>

            </form>
        </div>
    )
}