import React from 'react'
import { Link, useNavigate, useNavigation } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../../assets/styles/drawer.scss"
import menuItems, { menuItemsUser } from "../../../menu-items";
import { DashOutlined } from "@ant-design/icons";
import { useGiraf } from "../../../giraff";
const MainDrawer = () => {
    const [state, setState] = useState()
    const { gHead, addGHead } = useGiraf()
    const navigate = useNavigate()
    const [mItms, setItms] = useState()

    useEffect(() => {
        console.log('Here is the user ', gHead.user.UserRoles)
        console.log('Here is the user ', gHead.roles)
        const roles = gHead.user?.UserRoles?.map((l) => l.Role.type)
        console.log('Here is the user ', roles)
        addGHead("user_role", roles)
    }, [])

    return (
        <div
            className="drawer_main"
        >
            <div className="logo"></div>
            <div className="nav_container">
                {(gHead.user_role && ( gHead.user_role?.includes('ADMIN') || gHead.user_role?.includes('APPROVER')) ? menuItems: menuItemsUser).items.map((l) => {
                    return (
                <div className="nav_item" onClick={() => {
                    // navigate(l.url)
                    // window.location=l.url
                    console.log(l.url)
                    if (l.url === '.') {
                        console.log("went her")
                        addGHead("header", true)
                    } else {
                        console.log("went else")
                        addGHead('header', false)
                    }
                    if (l.url.includes('settings')) {
                        addGHead('sett', true)
                    } else {
                        addGHead('sett', false)

                    }
                    navigate(l.url)
                }}>
                    <div className="atom_icon">
                        {l.icon}
                    </div>
                    <p className="atom_par">{l.title}</p>
                </div>
                )
                })}
            </div>

        </div>
    )
}

export default MainDrawer