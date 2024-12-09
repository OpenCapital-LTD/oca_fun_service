import { useEffect } from "react";
import { useLocation } from "react-router-dom"
import PropTypes from 'prop-types'
const ScrollTop = ({children})=>{
    const location = useLocation()
    const {pathname} = location;
    useEffect(()=>{
        window.scrollTo({
            top:0,
            left:0,
            behavior:'smooth'
        });
    }, [pathname])
    return children || null

}

ScrollTop.prototype = {
    children:PropTypes.node
}

export default ScrollTop