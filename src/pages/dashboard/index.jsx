import '../../assets/styles/dashboard.scss'
import Smoke from '../../components/smoke'
import ball_1 from '../../assets/images/ball_1.png'
import ball_2 from '../../assets/images/ball_2.png'
import ball_3 from '../../assets/images/ball_3.png'
import ball_4 from '../../assets/images/ball_4.png'
import { useEffect } from 'react'
import { useState } from 'react'
import ws from '../../BFF/socket'
import FloatingEmojis from '../../components/emoji'
import {motion, AnimatePresence } from 'framer-motion'
import a_1 from '../../assets/images/a_1.png'
import a_2 from '../../assets/images/a_2.png'
import a_3 from '../../assets/images/a_3.png'
import a_4 from '../../assets/images/a_4.png'

const DashboardDefault = () => {
    const [stage, setStage] = useState(0)
    const [messages, setMessages] = useState([])
    const [presenter, setPresenter] = useState(false)
    const [emojis, setEmojis] = useState([])
    const [balls, setBalls] = useState([1,2,3,4,5,6,7,8,9,10, 11,12,13,14,15,16,17,18,19,20,21,22,23,24])
    const [message, setMessage] = useState('')
    const range = (start, stop, step = 1) => 
    Array.from({ length: Math.ceil((stop - start) / step) }, (_, i) => start + i * step);


    const list = [ball_1,ball_2,ball_2, ball_3,ball_4]
    let count = 0

    const onData = (data)=>{
        let d=  Math.floor(Math.random() * 270)
        // while(d > 250 && d < 254 ){
        // d = Math.floor(Math.random() * 270)
        // }'
        const em = { 
            'Very Bad':  '😢',
            'confeti':  '🎉',
            'boost':  '🚀',
            'Medium':  '😐',
            'Good':  '🙂',
            'Very Good':  '😂',
            'love':  '🥰'
        }
        if(em[data]){
        createFloatingEmoji(em[data])
    }else{
        let doc = document.getElementById(`b_${d}`).style.opacity = 1
        console.log(data)
        setMessages(l=>{
            return [...l, data]
        })
    }
        // setMessages(data)
    }
    useEffect(() => {
        // Create a new WebSocket connection
        const ws = new WebSocket('ws://localhost:3143');
      
        ws.onopen = () => {
          console.log('WebSocket connected');
        };
      
        ws.onmessage = (event) => {
            event.data.text().then(l=>{
                onData(l)
                

              })
        };
      
        ws.onclose = () => {
          console.log('WebSocket disconnected');
        };
      
        // Cleanup on component unmount
        return () => {
          ws.close();
        };
      }, []);
      const [floatingEmojis, setFloatingEmojis] = useState([])
      const emojis_ = ['👍', '❤️', '😂', '😮', '😢', '👏', '🎉', '🚀']

  const createFloatingEmoji = (emoji) => {
    const id = Date.now()
    const x = Math.random() * 100 // Random horizontal position (0-100%)
    setFloatingEmojis(prev => [...prev, { id, emoji, x:x-35 }])


    // Remove emoji after animation completes
    setTimeout(() => {
      setFloatingEmojis(prev => prev.filter(e => e.id !== id))
    }, 3000) // Match this with the animation duration
  }

  const getRange  = (l)=>{
    let c= []
    for(let i=0;i< l;i++){
        c.push(i)
    }
    return c
  }

    return (
        <div className="dashboard">
            <Smoke class_name = 'chimney'/>
            <Smoke class_name = 'chimney_2'/>
            <Smoke class_name = 'chimney_3'/>
            <Smoke class_name = 'chimney_4'/>
            <img src={a_1} style={{
                height:'200px',
                width:'200px',
                position:'absolute',
                left:'30%',
                bottom:'5%',
            }}/>
            <img src={a_2} style={{
                height:'200px',
                width:'200px',
                position:'absolute',
                left:'33%',
                bottom:'5%',
            }}/>
            <img src={a_3} style={{
                height:'200px',
                width:'200px',
                position:'absolute',
                left:'39%',
                bottom:'5%',
            }}/>
            <img src={a_4} style={{
                height:'200px',
                width:'200px',
                position:'absolute',
                left:'46%',
                bottom:'5%',
                zIndex:300
            }}/>
            <div className='oca_logo' onClick={onData}></div>
            <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-blue-200 to-blue-400">
      
            <div style={{
        bottom:'9px',
        left:'45%',
        position:'absolute',
        zIndex:200,
        width:'300px',
        
      }} className="fixed inset-x-0 bottom-0 mb-4 flex justify-center items-end">
      <div className="bg-white rounded-full shadow-lg p-2 flex space-x-2"  style={{
      }}>
        
      </div>
      <AnimatePresence >
        {floatingEmojis.map(({ id, emoji, x }) => (
          <motion.div
            key={id}
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: -200, opacity: [0, 1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3, times: [0, 0.1, 0.9, 1] }}
            className="absolute text-4xl pointer-events-none"
            style={{ left: `${x}%`, bottom: '100px' , fontSize:'50px', position:'absolute'}}
          >
            {emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>

    </main>
            <div className='hidra'></div>
            <div className='presenter_mode' style={{
                display: presenter ? 'block' : 'none'
            }}>
                <div className='close' onClick={()=>{
                    setPresenter(false)
                }}>x</div>
                <div className='mess'>
                {message}
                </div>
                </div>
            <div className='holder'>
            {balls.map((x,l)=>{
                return <div className='row'>
                    {
                        getRange(l).map(k=>{
                let index= Math.floor(Math.random() * 5)
                count +=1

                return (
                        // ((count < 87 || count > 91) && (count < 101 || count > 105) && (count < 116 || count > 120) && (count < 127 || count > 130) ) ? <img className={`ball b${l}`} src={list[index]} alt="ball" /> : <div style={{minWidth:'10px', backgroundColor:'white'}}></div>
                        (!(count > 250 && count < 254) ) ? <img key={count} id={`b_${count}`} className={`ball b_${count}`} src={list[index]} alt="ball" onClick={()=>{
                            
                            setPresenter(true)
                            let ind = Math.floor(Math.random() * messages.length)
                            console.log(messages)
                            setMessage(messages[ind])

                        }} 
                        /> : <div key={count} style={{minWidth:'25px', backgroundColor:'none'}}></div>
                        // {((count < 87 || count > 91) && (count < 101 || count > 105) && (count < 116 || count > 120) && (count < 127 || count > 130) ) ? <img className={`ball b${l}`} src={list[index]} alt="ball" /> : <div style={{minWidth:'45px', backgroundColor:'white'}}></div>}
                );
                
                        })
                    }
                </div>
            })}

</div>
        </div>
    )
}

export default DashboardDefault