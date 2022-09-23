import { useEffect, useState } from 'react'
import io from 'socket.io-client'

import './App.scss'

const socket = io.connect('https://oleshko-chat-app.herokuapp.com/')

export default function App() {
    const [name, setName] = useState('')
    const [room, setRoom] = useState('')
    const [isLogged, setLogged] = useState(false)
    
    const handleName = e => setName(e.target.value)
    const handleRoom = e => setRoom(e.target.value)

    const joinRoom = () => {
        if (name === '' || room === '' || isNaN(room)) return
        
        socket.emit('join_room', room)
        setLogged(true)
    }

    if (isLogged) return <Chat socket={socket} name={name} room={room} />

    return (
        <div className="app">
            <div className="container mt-5">
                <h1 className="mb-4">Online Chat</h1>

                <label className="text-secondary">Name</label>
                <input className="form-control w-50 mt-1" type="text" placeholder="John" onChange={handleName} />

                <label className="text-secondary mt-3">Room</label>
                <input className="form-control w-50" type="text" placeholder="Room ID" onChange={handleRoom} />

                <button className="btn btn-primary mt-4" onClick={joinRoom} >Join Room</button>
            </div>
        </div>
    )
}

export function Chat({ socket, name, room }) {
    const [currentMessage, setCurrentMessage] = useState('')
    const [messageList, setMessageList] = useState([])

    const handleMessage = e => setCurrentMessage(e.target.value)

    const sendMessage = async () => {
        if (currentMessage === '') return

        const messageData = {
            room: room,
            author: name,
            message: currentMessage,
            time: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })
        }
        await socket.emit('send_message', messageData)
        setMessageList(prev => [...prev, messageData])
    }

    useEffect(() => {
        socket.on('recieve_message', data => {
            setMessageList(prev => [...prev, data])
        })
    }, [socket])

    return (
        <div className="chat">
            <div className="container mt-5">
                <h1 className="mb-4">Online Chat (Room {room})</h1>

                <label className="text-secondary mt-3">Message</label>
                <input className="form-control w-50" type="text" placeholder="Some message" onChange={handleMessage} />

                <button className="btn btn-primary mt-4" onClick={sendMessage} >Send Message</button>

                <hr className="my-5" />

                <div className="messages d-flex flex-column w-50">
                    {messageList.map((item, index) => {
                        const isAuthor = name === item.author

                        return (
                            <div
                                key={index}
                                className={`d-flex w-100
                                    ${isAuthor ? 'flex-row-reverse' : 'flex-row'}
                                `}
                            >
                                <p
                                    className={`btn
                                        ${isAuthor ? 'btn-primary' : 'btn-success'}
                                    `}
                                >
                                    {item.message}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
} 