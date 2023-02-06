import React from 'react';
import { FaPhoneAlt, FaRocketchat, FaVideo } from 'react-icons/fa';
import FriendInfo from './FriendInfo';
import Message from './Message';
import MessageSend from './MessageSend';

const RightSide = (props) => {

    const { currentFriend, newMessage, inputHandle, sendMessage, message, scrollRef, emojiSend, imageSend, activeUser, typingMessage } = props;

    return (
        <div className="col-9">
            <div className="right-side">
                <input type="checkbox" id='dot' />
                <div className="row">
                    <div className="col-8">
                        <div className="message-send-show">
                            <div className="header">
                                <div className="image-name">
                                    <div className="image">
                                        <img src={`./image/${currentFriend.image}`} alt="" />
                                        {
                                            activeUser && activeUser.length > 0 && activeUser.some(u => u.userId === currentFriend._id) ? <div className="active-icon"></div> : ''
                                        }
                                    </div>
                                    <div className="name">
                                        <h3>{currentFriend.userName}</h3>
                                    </div>
                                </div>
                                <div className="icons">
                                    <div className="icon">
                                        <FaPhoneAlt />
                                    </div>
                                    <div className="icon">
                                        <FaVideo />
                                    </div>
                                    <div className="icon">
                                        <label htmlFor="dot"><FaRocketchat /></label>
                                    </div>
                                </div>


                            </div>
                            <Message
                                message={message}
                                currentFriend={currentFriend}
                                scrollRef={scrollRef}
                                typingMessage = {typingMessage}
                            />
                            <MessageSend
                                inputHandle={inputHandle}
                                newMessage={newMessage}
                                sendMessage={sendMessage}
                                emojiSend={emojiSend}
                                imageSend={imageSend}
                            />
                        </div>
                    </div>
                    <div className="col-4">
                        <FriendInfo  message={message} currentFriend={currentFriend} activeUser={activeUser}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RightSide