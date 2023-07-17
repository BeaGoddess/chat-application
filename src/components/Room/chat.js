import React, { useState, useEffect, useContext, useRef } from "react";
import { SocketContext } from "../../utils/SocketContext";

import { socket } from "../../socket";
import { useNavigate } from 'react-router-dom';

function Room() {
    const navigate = useNavigate();

    const { name } = useContext(SocketContext);

    const [message, setMessage] = useState("")
    //const [room, setRoom] = useState([])

    // Example of listUsers[0] = { id: "socket.id", name: "User1" } - Não adiciona o próprio utilizador
    const [listUsers, setListUsers] = useState([])

    const [optionsUsers, setOptionsUsers] = useState([])

    /* Example of listRooms[0] = 
        { user: "Bea", 
          messages: [{user: "Rui", value: "Olá"} ,{user: "Bea", value: "Oi"}] },
          open: false,
          typing: false,
          notification: 0
        }
    */
    const [listRooms, setListRooms] = useState([])
    const messagesEndRef = useRef(null)


    const updateOptions = (e) => {
        let searchedVal = e.target.value.toLowerCase()
        let arr = []

        arr = optionsUsers.filter(data => {
            return data.toLowerCase().includes(searchedVal)
        })

        if (e.target.value.toLowerCase() === "") {
            setOptionsUsers(listUsers.filter((item) => item.name !== name).map((user) => { return user.name }));
        } else {
            setOptionsUsers(arr);
        }

    }


    useEffect(() => {

        const isSocketConfigured = socket.id !== undefined

        if (!isSocketConfigured || name === "") {
            navigate('/');
        }

        const receiveMessage = (send, message, receive) => {

            console.log(send, message, receive);

            if (receive === name) {
                listRooms.find((room) => room.user === send).messages.push({ user: send, value: message });

                if (listRooms.find((room) => room.user === send).open === false) listRooms.find((room) => room.user === send).notification++




                listRooms.find((room) => room.user === send).typing = false;
                setListRooms([...listRooms])

            }
        }

        const receiveUsers = (user, list, number) => {

            if (user.name !== name) {
                listUsers.push(user)
                setListUsers([...listUsers])

                optionsUsers.push(user.name)
                setOptionsUsers([...optionsUsers])

                listRooms.push({
                    user: user.name,
                    messages: [],
                    open: false,
                    typing: false,
                    notification: 0
                })
                setListRooms([...listRooms])

                console.log("Lista de Utilizadores", listUsers, number);
                console.log("Lista de Rooms", listRooms, number);


            } else {

                let arrayUser = list.filter((item) => item.name !== name)

                let arrayOptions = list.filter((item) => item.name !== name).map((user) => { return user.name })


                let arrayRooms = arrayUser.map((user) => {
                    return {
                        user: user.name,
                        messages: [],
                        open: false,
                        typing: false,
                        notification: 0
                    }

                })

                setOptionsUsers([...arrayOptions])
                setListUsers([...arrayUser])
                setListRooms([...arrayRooms])


                console.log("Lista de Utilizadores", arrayUser, number);
                console.log("Lista de Rooms", arrayRooms, number);
            }
        }

        const typing = (send, receive, value) => {

            if (receive === name) {
                listRooms.find((room) => room.user === send).typing = value
                setListRooms([...listRooms])
            }
        }


        const disconnectUser = (user) => {

            let rooms = listRooms.filter((room) => room.user !== user)
            let users = listUsers.filter((username) => username.name !== user)
            let options = optionsUsers.filter((username) => username !== user)

            console.log(rooms, users);

            setOptionsUsers([...options])
            setListUsers([...users])
            setListRooms([...rooms])
        }

        // Client Receive One Contact Disconnected
        socket.on('remove-user', disconnectUser)

        // Client Receive message 
        socket.on('receive-message', receiveMessage)

        // Client Receive One Contact
        socket.on('send-users', receiveUsers)

        // User is typing
        socket.on('typing', typing)




        return () => {
            socket.off('receive-message', receiveMessage)
            socket.off('send-users', receiveUsers)
            socket.off('typing', typing)
            socket.off('remove-user', disconnectUser)
        };


    }, [listUsers, listRooms]);




    const sendMessage = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();

            if (message === "") return

            listRooms.find((room) => room.open === true).messages.push({ user: name, value: message })
            setListRooms([...listRooms])
            setMessage("")

            socket.emit('send-message', name, message, listRooms.find((room) => room.open === true).user)
        }
    }

    const typingMessage = (event) => {
        setMessage(event.target.value)
        socket.emit('typing-message', name, listRooms.find((room) => room.open === true).user, event.target.value === "" ? false : true)
    }

    /*
    const joinRoom = () => {

        socket.emit('join-room', room, message => {
            listMessages.push(message)
            setListMessages([...listMessages])
        })
    }
    */

    const openRoom = (user) => {

        if (listRooms.find(room => room.open === true) === undefined) {
            listRooms.find(room => room.user === user).open = true
            listRooms.find(room => room.user === user).notification = 0
            setMessage("")
            setListRooms([...listRooms])
        } else {
            if (listRooms.find(room => room.open === true).user !== user) {
                listRooms.find(room => room.open === true).open = false
                listRooms.find(room => room.user === user).open = true
                listRooms.find(room => room.user === user).notification = 0
                setMessage("")
                setListRooms([...listRooms])
            }
        }

    }

    return (<>
        <div className="py-16 h-full">
            <div className="flex bg-blue-200 h-full  w-full p-4">

                <div className="bg-white rounded-l-lg overflow-hidden flex flex-col" style={{ maxWidth: "30%", minWidth: "200px" }}>
                    <div className="px-6 pt-6 pb-4  flex items-center ">
                        <div className="mr-3 bg-blue-300 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                            <i className="fa-solid fa-user" style={{ color: "#ffffff" }}></i>
                        </div>

                        <div className="text-lg font-medium line-clamp-*"> {name} </div>
                    </div>

                    <div className="px-2 relative mb-4">
                        <input className="  appearance-none border rounded-2xl w-full text-gray-700 leading-tight  bg-gray-100
                    focus:outline-none focus:shadow-outline pl-9 pr-3 py-2 text-xs" type="text" placeholder="Search..." onKeyUp={updateOptions} />
                        <i className="fa-solid fa-magnifying-glass absolute left-5 bottom-1/2 transform translate-y-1/2 text-gray-300"></i>
                    </div>

                    <div className="overflow-auto relative flex-grow w-full">
                        <div className="overflow-auto absolute w-full">
                            {optionsUsers.map((option, index) => {
                                let user = listUsers.find((username) => username.name === option)
                                return (
                                    <div key={user.id} className={`py-2 px-3  ${index === 0 ? "border-t border-b" : "border-b"} hover:bg-blue-50 cursor-pointer 
                                                                      ${listRooms.find((room) => room.open === true && room.user === user.name) !== undefined ? "bg-blue-100" : ""} border-blue-200`}
                                        onClick={(e) => { openRoom(user.name) }}>
                                        <div className="flex items-center">
                                            <div className="mr-3 bg-blue-300 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                                                <i className="fa-solid fa-user" style={{ color: "#ffffff" }}>
                                                </i></div>
                                            <div className={`${listRooms.find((room) => room.user === user.name).notification !== 0 ? "font-bold" : "font-medium"} text-sm `}> {user.name} </div>

                                            {listRooms.find((room) => room.user === user.name).notification !== 0 &&
                                                <div className="font-semibold mr-0 m-auto bg-blue-400 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-white"
                                                    style={{ fontSize: "11px" }}> {listRooms.find((room) => room.user === user.name).notification} </div>}
                                        </div>
                                    </div>

                                )
                            })}
                        </div>
                    </div>


                </div>

                <div className="bg-gray-100 flex-grow rounded-r-lg overflow-hidden flex flex-col ">

                    {listRooms.find((room) => room.open === true) !== undefined &&
                        <>
                            <div className="bg-blue-300 pt-6 px-4 pb-4 rounded-b-lg">
                                <div className="flex items-center">
                                    <div className="mr-3 bg-white w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <i className="fa-solid fa-user text-blue-300" ></i>
                                    </div>

                                    <div className="text-base font-medium"> {listRooms.find((room) => room.open === true).user} </div>
                                </div>
                            </div>

                            <div className="flex-grow overflow-auto h-full py-2 relative w-full">
                                <div className="overflow-auto h-full absolute top-0 w-full flex flex-col-reverse" >
                                    <div className="bottom-0" ref={messagesEndRef}>
                                        {listRooms.find((room) => room.open === true).messages.map(((message, index) => {
                                            const key = `${index}-${message}`;

                                            return (
                                                <React.Fragment key={key}>
                                                    {message.user === name ?
                                                        <div className="pb-2">
                                                            <div className="flex mx-4 my-1 justify-end w-auto">
                                                                <div className="bg-white py-2 px-4 rounded-lg w-auto">
                                                                    {message.value}
                                                                </div>
                                                            </div>
                                                            <div className="flex justify-end mx-5 text-xs"> You </div>
                                                        </div>
                                                        :
                                                        <div key={index} className="pb-2">
                                                            <div className="flex mx-4 my-1 justify-start">
                                                                <div className="bg-gradient-to-r from-blue-300 to-blue-100 py-2 px-4 rounded-lg ">
                                                                    {message.value}
                                                                </div>
                                                            </div>
                                                            <div className="flex justify-start mx-5 text-xs"> {message.user} </div>

                                                        </div>}
                                                </React.Fragment>
                                            )
                                        }))}
                                    </div>
                                </div>


                            </div>

                            <div className="bg-blue-300 px-2 pt-6 pb-1">
                                <div className="px-2 relative">
                                    <input className="appearance-none border rounded-2xl w-full text-gray-700 leading-tight  bg-gray-100
                                                      focus:outline-none focus:shadow-outline pl-4 pr-4 py-2 text-sm" type="text" placeholder="Insert Message..."
                                        onKeyDown={(e) => sendMessage(e)}
                                        value={message}
                                        onChange={(e) => typingMessage(e)} />
                                </div>
                                <div className={`text-xs px-2 py-1 font-medium text-white ${listRooms.find((room) => room.open === true).typing ? "visible" : "invisible"}`}>
                                    {listRooms.find((room) => room.open === true).user + " is typing..."}
                                </div>
                            </div>
                        </>

                    }

                </div>


                {/* 
            <div className="border border-blue-600 rounded-lg flex-grow overflow-y-auto bg-blue-50 h-full mt-2">
                {listMessages.map((content, index) => {
                    return (<>
                        <div className={index % 2 ? "py-1 px-2 text-sm" : "bg-blue-100 py-1 px-2 text-sm"}> {content} </div>
                    </>)
                })

                }
            </div>
            <div name="Form" className="flex flex-col my-4">
                <div className="flex mb-2">
                    <label for="message-input" className="block text-gray-800 font-semibold"> Message</label>
                    <input className="flex-grow hadow appearance-none border rounded w-full mx-2 text-gray-700 leading-tight 
                focus:outline-none focus:shadow-outline px-2" type="text" id="message-input" value={message} onChange={(e) => setMessage(e.target.value)} />
                    <button type="button" id="message-button"
                        className="bg-blue-100 border rounded border-blue-500 px-2 hover:bg-blue-200 
                    hover:text-blue-900 duration-300 text-sm font-medium" onClick={(e) => sendMessage()}> Send </button>
                </div>
                <div className="flex">
                    <label for="room-input" className="block text-gray-800 font-semibold">Room</label>
                    <input className="flex-grow hadow appearance-none border rounded w-full mx-2 text-gray-700 leading-tight 
                focus:outline-none focus:shadow-outline px-2" type="text" id="room-input" value={room} onChange={(e) => setRoom(e.target.value)} />
                    <button type="button" id="room-button"
                        className="bg-blue-100 border rounded border-blue-500 px-2 hover:bg-blue-200 
                    hover:text-blue-900 duration-300 text-sm font-medium" onClick={(e) => joinRoom()}> Join </button>
                </div>
            </div>
            */}
            </div >
        </div>
    </>
    );
}

export default Room;
