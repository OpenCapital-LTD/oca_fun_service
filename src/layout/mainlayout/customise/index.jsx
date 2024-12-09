import React, { useEffect, useState } from 'react'
import '../../../assets/styles/drawer.scss'
import settings_menu, { settings_menu_in_app } from '../../../menu-items/settigns'
import { useNavigate } from 'react-router-dom'

const CustomizeDrawer = () => {
    const [selected, setSelected] = useState('Users')
    const [s_menu, setSMenu] = useState(settings_menu)
    const navigate = useNavigate()
    useEffect(()=>{
        if(window.location.href.includes('expense_service')){
            setSMenu(settings_menu_in_app)
        }
    },[])
    return (
        <div className='custom_drawer'>

            {s_menu.items.map(l => {
                return (
                    <div className='lister_sect'>
                        <br />
                        <p className='lister_tt'>{l.title.toUpperCase()}</p>
                        <div className='lister_nav'>
                            {l.children.map(k => {
                                return (

                                    <p className='lister' style={{
                                        backgroundColor: selected === k.title ? "rgba(128, 128, 128, 0.274)" : 'inherit'
                                    }}
                                        onClick={() => {
                                            setSelected(k.title)
                                            const url =  k.url
                                            // const url = '/settings' + k.url
                                            navigate(url)
                                        }}
                                    >{k.title}</p>
                                )
                            })}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default CustomizeDrawer