import React from 'react';
import { FaPhoneAlt, FaRocketchat, FaVideo } from 'react-icons/fa';
import FriendInfo from './FriendInfo';
import Message from './Message';
import MessageSend from './MessageSend';

const RightSide = (props) => {

    const {currentFriend, newMessage, inputHandle, sendMessage, message, scrollRef, emojiSend} = props;

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
                                <img src={`./image/${currentFriend.image}`} alt="" />
                                </div>
                                <div className="name">
                                    <h3>{currentFriend.userName}</h3>
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
                        <Message
                        message = {message}
                        currentFriend = {currentFriend}
                        scrollRef = {scrollRef}
                        />
                        <MessageSend
                        inputHandle = {inputHandle}
                        newMessage = {newMessage}
                        sendMessage = {sendMessage}
                        emojiSend = {emojiSend}
                        />
                    </div>
                </div>
                <div className="col-4">
                    <FriendInfo currentFriend={currentFriend}/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default RightSide