import { useState } from "react"

const MessageBox = ({ type, txt, sytles }) => {
    let color;
    if (type == 'error') color = 'rgb(184, 0, 0)'
    if (type == 'success') color = 'rgb(0, 75, 0)'
    return (
        <div className="message_box" style={{
            backgroundColor: color,
            ...sytles
        }}>
            <p>{txt}</p>

        </div>
    )
}

export default MessageBox