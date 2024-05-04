import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import axios from "../api/axios"
// import axios from "axios";

export default function LoginPage() {
    
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [redirect, setRedirect] = useState(false)

    const {setUser} = useContext(UserContext)

    async function handleSubmit(e){
        e.preventDefault()

        try{
            const {data} = await axios.post('/api/auth/v1/login',{
                email,
                password
            })
            
            setUser(data)
            alert("Logged in successfully.")
            setRedirect(true)
        }
        catch(err){
            alert("Logged in failed")
        }

    }

    if(redirect){
        return <Navigate to={'/'}/>
    }

    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
                <h1 className="text-4xl text-center mb-4">Login</h1>
                <form className="max-w-md mx-auto " onSubmit={handleSubmit}>
                    
                    <input 
                        type="email" 
                        placeholder="youremail@gmail.com"
                        value={email}
                        onChange={e=>setEmail(e.target.value)} 
                    />
                    
                    <input 
                        type="password" 
                        placeholder="yourpassword" 
                        value={password}
                        onChange={e=>setPassword(e.target.value)}
                    />
                    
                    <button className="primary">Login</button>

                    <div className="text-center py-2 text-gray-500">
                        Don't have an account. <Link to={'/register'} className=" underline text-black">Register</Link> now.
                    </div>

                </form>
            </div>
        </div>
    )
}