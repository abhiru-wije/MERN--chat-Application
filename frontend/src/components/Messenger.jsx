import React from 'react'
import { FaEdit, FaEllipsisH, FaSistrix } from 'react-icons/fa';
import ActiveFriend from './ActiveFriend';
import Friends from './Friends';
import RightSide from './RightSide';
import {useDispatch, useSelector} from 'react-redux'
import { useEffect } from 'react';
import { getFriends } from '../store/actions/messengerAction';
import { useState } from 'react';

const Messenger = () => {

    const [currentFriend, setCurrentFriend] = useState('');
    const [newMessage, setNewMessage] = useState('');

    const inputHandle = (e) => {
        setNewMessage(e.target.value);
    }
    
    const sendMessage = (e) => {
        e.preventDefault();
        console.log(newMessage)
    }

    console.log(currentFriend)

    const {friends} = useSelector(state => state.messenger);
    const {myInfo} = useSelector(state => state.auth);
    

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getFriends());
    }, []);

    useEffect(() => {
        if(friends && friends.length > 0){
            setCurrentFriend(friends[0])
        }
    }, [friends]);


  return (
    <div className='messenger'>
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
                            <div className="icon">
                               <FaEllipsisH /> 
                            </div>
                            <div className="icon">
                                <FaEdit />
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
                    <div className="active-friends">
                        <ActiveFriend/>
                    </div>
                    <div className="friends">

                        {
                            friends && friends.length > 0 ? friends.map((fd) => <div onClick={() => setCurrentFriend(fd)} className={currentFriend._id === fd._id ? 'hover-friend active' : 'hover-friend'}>
                            <Friends friend={fd} />
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
                /> : 'Please Select Your Friend'
            }
            
        </div>
    </div>
  )
}

export default Messenger