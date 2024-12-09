import { useEffect } from 'react';
import ws from '../../BFF/socket'
const Page = ()=>{

    useEffect(()=>{
        onSendData()
    })
    const onSendData = ()=>{
        if ( ws.readyState === WebSocket.OPEN) {
            ws.send("inputValue");
          }
      }
    return(
        <div>
            running
        </div>
    )
}

export default Page