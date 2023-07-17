import React, { useState, useEffect, useContext } from "react";
import { connectUser } from "./setUser";

import { SocketContext } from "../../utils/SocketContext";

import { useNavigate } from "react-router-dom";
import { socket } from "../../socket";


function Profile() {
    const navigate = useNavigate();

    const [load, setLoad] = useState(false)

    const { setUsername } = useContext(SocketContext);

    //const username = useContext(SocketContext).name;

    const [name, setName] = useState("")

    const enterName = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            sendName()
        }
    }

    const sendName = (e) => {

        if (name !== "") {
            // Set Name for User
            setUsername(name)

            // Connect User on Socket
            connectUser(name)

            // Navigate to path /room
            navigate('/room')
        }

    }

    useEffect(() => {


        if (socket.id !== undefined) {
            socket.emit("disconnect-user")
            setUsername('')
        }
        setLoad(true)


    }, []);

    return (<>
        {load &&
            <div className="bg-blue-200 w-full my-16 p-4 flex flex-grow justify-center items-center">

                <div className="bg-white flex rounded-2xl p-8 flex-col  justify-center" style={{
                    width: "32rem",
                    height: "20rem"
                }}>

                    <label className="block text-gray-800 font-semibold text-3xl text-center pb-7 h-auto"> Chat Application </label>

                    <input className="appearance-none border border-gray-200 rounded-md w-full  text-gray-700 leading-tight text-sm  
                focus:outline-none focus:shadow-outline px-2 py-1 text-center" type="text" value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => enterName(e)}
                        placeholder="Insert Username" />

                    <button type="button" onClick={(e) => { sendName(); }}
                        className="bg-blue-100 border rounded border-blue-500 px-2 py-1 hover:bg-blue-200 w-full mt-4
                hover:text-blue-900 duration-300 text-sm font-semibold" > Join </button>
                </div>
            </div>}
    </>)
}

export default Profile;
