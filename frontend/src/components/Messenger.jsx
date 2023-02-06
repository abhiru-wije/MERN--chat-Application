/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { FaEdit, FaEllipsisH, FaSignOutAlt, FaSistrix } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import useSound from 'use-sound';
import notificationSound from '../audio/notification.mp3';
import sendingSound from '../audio/sending.mp3';
import { userLogout } from '../store/actions/authAction';
import { getFriends, getMessage, ImageMessageSend, messageSend, seenMessage, updateMessage } from '../store/actions/messengerAction';
import Friends from './Friends';
import RightSide from './RightSide';

const Messenger = () => {

    const [notificationSPlay] = useSound(notificationSound);
    const [sendingSPlay] = useSound(sendingSound);

    const scrollRef = useRef();
    const socket = useRef();

    const {friends, message, messageSendSuccess, message_get_success} = useSelector(state => state.messenger);
    const {myInfo} = useSelector(state => state.auth);

    const [currentFriend, setCurrentFriend] = useState('');
    const [newMessage, setNewMessage] = useState('');

    const [activeUser, setActiveUser] = useState([]);
    const [socketMessage, setSocketMesssage] = useState('');
    const [typingMessage, setTypingMessage] = useState('');
    
    useEffect(() => {
        socket.current = io('ws://localhost:8000');
        socket.current.on('getMessage', (data) => {
            setSocketMesssage(data);
        })

        socket.current.on('typingMessageGet', (data) => {
            setTypingMessage(data)
        })

        socket.current.on('msgSeenResponse', msg => {
            dispatch({
                type: 'SEEN_MESSAGE',
                payload: {
                    msgInfo: msg
                }
            })
        })

        socket.current.on('msgDeliveredResponse', msg => {
            dispatch({
                type: 'DELIVERED_MESSAGE',
                payload: {
                    msgInfo: msg
                }
            })
        })

        socket.current.on('seenSuccess', data => {
            dispatch({
                type: 'SEEN_ALL',
                payload: data
            })
        })

    }, []);

    useEffect(() => {
        if(socketMessage && currentFriend){
            if(socketMessage.senderId === currentFriend._id && socketMessage.receiverId === myInfo.id){
                dispatch({
                    type: 'SOCKET_MESSAGE',
                    payload: {
                        message: socketMessage
                    }
                })
                dispatch(seenMessage(socketMessage));
                socket.current.emit('messageSeen', socketMessage)
                dispatch({
                    type: 'UPDATE_FRIEND_MESSAGE',
                    payload: {
                    msgInfo: socketMessage,
                    status: 'seen'
                    }
                })
            }
        }
        setSocketMesssage('')
    }, [socketMessage]);

    useEffect(() => {
        socket.current.emit('addUser', myInfo.id, myInfo)
    }, []);

    useEffect(() => {
        socket.current.on('getUser', (users) => {
            const filterUser = users.filter(u => u.userId !== myInfo.id)
            setActiveUser(filterUser)
        })
    }, []);

    useEffect(() => {
        if(socketMessage && socketMessage.senderId !== currentFriend._id && socketMessage.receiverId === myInfo.id){
            notificationSPlay();
            toast.success(`${socketMessage.senderName} Send a New Message`)
            dispatch(updateMessage(socketMessage))
            socket.current.emit('deliveredMessage', socketMessage)
                dispatch({
                    type: 'UPDATE_FRIEND_MESSAGE',
                    payload: {
                    msgInfo: socketMessage,
                    status: 'delivered'
                    }
                })
        }
    }, [socketMessage]);


    const inputHandle = (e) => {
        setNewMessage(e.target.value);

        socket.current.emit('typingMessage', {
            senderId: myInfo.id,
            receiverId: currentFriend._id,
            msg : e.target.value
        })
    }
    
    const sendMessage = (e) => {
        e.preventDefault();
        sendingSPlay();
        const data = {
            senderName: myInfo.userName,
            receiverId: currentFriend._id,
            message: newMessage ? newMessage : '❤'
        }

        
        socket.current.emit('typingMessage', {
            senderId: myInfo.id,
            receiverId: currentFriend._id,
            msg : ''
        })

        dispatch(messageSend(data))
        setNewMessage('')
    }

    useEffect(() => {
        if(messageSendSuccess){
            socket.current.emit('sendMessage', message[message.length -1]);
            dispatch({
                type: 'UPDATE_FRIEND_MESSAGE',
                payload: {
                    msgInfo: message[message.length -1]
                }
            })
            dispatch({
                type: 'MESSAGE_SEND_SUCCESS_CLEAR',
            })

        }
    }, [messageSendSuccess]);

    console.log(currentFriend)

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getFriends());
    }, []);

    useEffect(() => {
        if(friends && friends.length > 0){
            setCurrentFriend(friends[0].fndInfo)
        }
    }, [friends]);

    useEffect(() => {
        dispatch(getMessage(currentFriend._id));

        if(friends.length > 0){
            
        }
    }, [currentFriend?._id]);

    useEffect(() => {
        if(message.length > 0 ){
            if(message[message.length -1].senderId !== myInfo.id && message[message.length -1].status !== 'seen'){
                dispatch({
                    type: 'UPDATE',
                    payload: {
                        id: currentFriend._id
                    }
                })
                socket.current.emit('seen', { senderId: currentFriend._id, receiverId: myInfo.id})
            dispatch(seenMessage({_id: message[message.length -1]._id}))
            }
        }
        dispatch({
            type: 'MESSAGE_GET_SUCCESS_CLEAR'
        })
    }, [message_get_success]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({behavior: 'smooth'})
    }, [message]);

    const emojiSend = (emu) => {
        setNewMessage(`${newMessage}` + emu);
        socket.current.emit('typingMessage', {
            senderId: myInfo.id,
            receiverId: currentFriend._id,
            msg : emu
        })
    }

    const imageSend = (e) => {
        if(e.target.files.length !== 0){
            sendingSPlay();
            const imagename = e.target.files[0].name;
            const newImageName = Date.now() + imagename;

            socket.current.emit('sendMessage', {
                senderId: myInfo.id,
                senderName: myInfo.userName,
                receiverId: currentFriend._id,
                time: new Date(),
                message: {
                    text: '',
                    image: newImageName
                }
            })

            const formData = new FormData();

            formData.append('senderName', myInfo.userName)
            formData.append('imageName', newImageName)
            formData.append('receiverId', currentFriend._id)
            formData.append('image', e.target.files[0])
            dispatch(ImageMessageSend(formData))

        }
        
    }

    const [hide, setHide] = useState(true)

    const logout = () => {
        dispatch(userLogout());
    }


  return (
    <div className='messenger'>
        <Toaster
        position={'top-right'}
        reverseOrder = {false}
        toastOptions = {{
            style: {
                fontSize : '18px'
            }
        }}
        />
        <div className='row'>
            <div className="col-3">
                <div className="left-side">
                    <div className="top">
                        <div className="image-name">
                            <div className="image">
                                <img src={`./image/${myInfo.image}`} alt="" />
                            </div>
                            <div className="name">
                                <h3>{myInfo.userName}</h3>
                            </div>
                        </div>
                        <div className="icons">
                            <div onClick={() => setHide(!hide)} className="icon">
                               <FaEllipsisH /> 
                            </div>
                            <div className="icon">
                                <FaEdit />
                            </div>

                            <div className={hide ? 'theme_logout' : 'theme_logout show'}>
                                <h3>Dark Mode</h3>
                                <div className="on">
                                    <label htmlFor="dark">ON</label>
                                    <input type="radio" value="dark" name="theme" id='dark'/>
                                </div>
                                <div className="off">
                                    <label htmlFor="white">OFF</label>
                                    <input type="radio" value="white" name="theme" id='white'/>
                                </div>
                                <div onClick={logout} className="logout">
                                    <FaSignOutAlt/> Logout
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="friend-search">
                        <div className="search">
                            <button>
                                <FaSistrix />
                            </button>
                            <input type="text" placeholder='Search' className='form-control'/>
                        </div>
                    </div>
                    {/* <div className="active-friends">
                        {
                            activeUser && activeUser.length > 0 ? activeUser.map(u => <ActiveFriend  setCurrentFriend={setCurrentFriend}  user ={u} />) : ''
                        }
                        
                    </div> */}
                    <div className="friends">

                        {
                            friends && friends.length > 0 ? friends.map((fd) => <div onClick={() => setCurrentFriend(fd.fndInfo)} className={currentFriend._id === fd.fndInfo._id ? 'hover-friend active' : 'hover-friend'}>
                            <Friends myId= {myInfo.id} friend={fd} activeUser={activeUser}/>
                            </div>) : 'No Friend'
                        }
                        

                    </div>
                </div>
            </div>
            {
                currentFriend ? <RightSide 
                currentFriend={currentFriend}
                inputHandle={inputHandle}
                newMessage={newMessage}
                sendMessage={sendMessage}
                message={message}
                scrollRef={scrollRef}
                emojiSend={emojiSend}
                imageSend={imageSend}
                activeUser={activeUser}
                typingMessage = {typingMessage}
                /> : 'Please Select Your Friend'
            }
            
        </div>
    </div>
  )
}

export default Messenger