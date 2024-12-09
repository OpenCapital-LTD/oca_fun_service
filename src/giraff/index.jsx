import React, { createContext, useContext, useState } from "react";
import Cookies from 'js-cookie'

const Giraf = createContext(undefined)
const GirafProvider = ({ children }) => {
    const [gHead, setGHead] = useState({
    })
    const addGHead = (key, ref) => {
        setGHead((prevG) => ({
            ...prevG,
            [key]: ref
        }))
    }

    return (
        <Giraf.Provider value={{ gHead, addGHead }}>
            {children}
        </Giraf.Provider>
    )
}
const useGiraf = () => {
    return useContext(Giraf)
}

export { useGiraf, GirafProvider }