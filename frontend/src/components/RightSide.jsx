import React from 'react';
import { FaPhoneAlt, FaRocketchat, FaVideo } from 'react-icons/fa';
import FriendInfo from './FriendInfo';
import Message from './Message';
import MessageSend from './MessageSend';

const RightSide = () => {
  return (
    <div className="col-9">
        <div className="right-side">
            <input type="checkbox" id='dot'/>
            <div className="row">
                <div className="col-8">
                    <div className="message-send-show">
                        <div className="header">
                            <div className="image-name">
                                <div className="image">
                                <img src="/image/45092new.png" alt="" />
                                </div>
                                <div className="name">
                                    <h3>Abhiru Wijesinghe</h3>
                                </div>
                            </div>
                            <div className="icons">
                                <div className="icon">
                                    <FaPhoneAlt/>
                                </div>
                                <div className="icon">
                                    <FaVideo/>
                                </div>
                                <div className="icon">
                                   <label htmlFor="dot"><FaRocketchat/></label> 
                                </div>
                            </div>
                            
                            
                        </div>
                        <Message/>
                        <MessageSend/>
                    </div>
                </div>
                <div className="col-4">
                    <FriendInfo/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default RightSide