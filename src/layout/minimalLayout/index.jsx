import React from 'react'
import { Outlet } from "react-router-dom"
import { useGiraf } from "../../giraff"
import './../../assets/styles/global.scss'
import '../../assets/styles/components.scss'
import '../../assets/styles/auth.scss'

const MinimalLayout = () => {
    const { gHead } = useGiraf()
    return (
        <div className="app_container_min">
            <div className="auth_main">
                <div className="logo_box">
                    <div className="short_logo"></div>
                    <p>OCA eHub</p>
                </div>
                <div className="main_container">
                    <div className="vector"></div>
                    <div className="rest">
                        <Outlet />
                    </div>
                </div>

            </div>

        </div>
    )
}
export default MinimalLayout