/* eslint-disable no-template-curly-in-string */
import React from 'react'

const Friends = (props) => {
  const {fndInfo, msgInfo} = props.friend;
  return (
    <div className="friend">
        <div className="friend-image">
            <div className="image">
            <img src={`./image/${fndInfo.image}`} alt="" />
            </div>
        </div>
        <div className="friend-name-seen">
            <div className="friend-name">
                <h4>{fndInfo.userName}</h4>
                <div className="msg-time">
                  {
                    msgInfo && msgInfo.senderId
                  }
                </div>
            </div>
        </div>
    </div>
  )
}

export default Friends