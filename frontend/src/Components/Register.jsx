import './Register.css';
import {Room, Cancel} from "@material-ui/icons"
import { useRef, useState } from "react";
import axios from "axios";

export default function Register( {setShowRegister}){

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);


    const usernameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();


    const handleSubmit = async(e) => {
        e.preventDefault();
        const newUser = {
            username:usernameRef.current.value,
            email:emailRef.current.value,
            password:passwordRef.current.value,
        }

        try{
            await axios.post("/users/register",newUser);
            setError(false);
            setSuccess(true);
        }
        catch(err){
            setError(true);
        }
    }

    return (


        <div className="registerContainer">
            <div className="logoRegister">
                <Room className="logoIcon"/>
                <span>Travel App</span>
            </div>
                <form onSubmit={handleSubmit}>
                    <input autoFocus type="text" placeholder="username" ref = {usernameRef}/>
                    <input type="email" placeholder="email" ref = {emailRef}/>
                    <input type="password" min="6" placeholder="password" ref = {passwordRef}/>
                    <button className="registerBtn" type="submit">Register</button>
                    {success &&
                        <span className="success">Successful register!</span>
                    }
                    {error &&
                        <span className="error">Error registering!</span>
                    }
                </form>

                <Cancel className="registerCancel" onClick={() => setShowRegister(false)}/>

            </div>

    );
}