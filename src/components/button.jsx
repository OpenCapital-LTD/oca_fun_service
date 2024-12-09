import { MdSendAndArchive } from 'react-icons/md'
import '../assets/styles/components.scss'
import { BiSearch } from 'react-icons/bi'

const Button = (props)=>{
    const {logo, onclick, style, txt, size, className} = props
    return(
        <div className={`button ${className}`} style={style} onClick={()=>{
            onclick()
        }}>
            <div className='icon'>
           {logo}
           </div>
            <p className='p'>{txt}</p>
        </div>
    )

}

export default Button