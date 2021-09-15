import './Login.css';
import {Room, Cancel} from "@material-ui/icons"
import { useRef, useState } from "react";
import axios from "axios";

export default function Login( {setShowLogin,myStorage,setCurrentUser}){

    const [error, setError] = useState(false);


    const usernameRef = useRef();
    const passwordRef = useRef();


    const handleSubmit = async(e) => {
        e.preventDefault();
        const user = {
            username:usernameRef.current.value,
            password:passwordRef.current.value,
        }

        try{
            const res = await axios.post("/users/login",user);
            myStorage.setItem("user",res.data.username)
            setCurrentUser(res.data.username)
            setError(false)
            setShowLogin(false)
        }
        catch(err){
            setError(true);
        }
    }

    return (


        <div className="loginContainer">
            <div className="logoLogin">
                <Room className="logoIcon"/>
                <span>Travel App</span>
            </div>
                <form onSubmit={handleSubmit}>
                    <input autoFocus type="text" placeholder="username" ref = {usernameRef}/>
                    <input type="password" min="6" placeholder="password" ref = {passwordRef}/>
                    <button className="loginBtn" type="submit">Login</button>
                    {error &&
                        <span className="error">Wrong username or password!</span>
                    }
                </form>

                <Cancel className="loginCancel" onClick={() => setShowLogin(false)}/>

            </div>

    );
}