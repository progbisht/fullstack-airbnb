import { createContext, useEffect, useState } from "react";
import axios from "./api/axios";

export const UserContext = createContext({});

export function UserContextProvider({children}){
    const [user, setUser] = useState('');
    const [ready, setReady] = useState(false)

    useEffect(() => {
        if(!user){
            const fetch = async() => {
                const {data} =  await axios.get('/api/user/v1/profile')
                console.log(data);
                setUser(data)
                setReady(true)
            }
            fetch()
        }

    },[user])
    
    return (
        <UserContext.Provider value={{user,setUser, ready}}>
            {children}
        </UserContext.Provider>
    )
}