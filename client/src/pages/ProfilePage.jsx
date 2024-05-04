import { useContext, useState } from "react"
import { UserContext } from "../UserContext"
import { Navigate, useParams } from "react-router-dom"
import axios from 'axios'
import PlacesPage from "./PlacesPage"
import AccountNav from "../AccountNav"

export default function ProfilePage(){
    const { ready , user, setUser } = useContext(UserContext)

    const [redirect, setRedirect] = useState(false)

    let {subpage} = useParams()
    if(subpage === undefined){
        subpage = 'profile'
    }

    if(redirect){
        return <Navigate to={'/'} />
    }
    
    if(!ready){
        return "Loading.."
    }
    
    if(ready && !user){
        return <Navigate to={'/login'} />
    }

    async function handleLogout(){
        await axios.post('/api/auth/v1/logout')
        setRedirect(true)
        setUser('')
    }
    
    return (
        <div>
            
            <AccountNav/>
            
            {
                subpage === 'profile' && (
                    <div className="text-center max-w-lg mx-auto">
                        Logged in as {user.name} ({user.email})
                        <button className="primary max-w-sm mt-2" onClick={handleLogout}>Logout</button>
                    </div>

                ) 
            }

            {
                subpage === 'places' && (
                    <PlacesPage />
                )
            }

        </div>
    )
}