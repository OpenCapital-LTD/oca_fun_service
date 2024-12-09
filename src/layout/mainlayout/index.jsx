import React from 'react'
import { Box, Breadcrumbs, Toolbar } from "@mui/material"
import Header from "./header"
import MainDrawer from "./drawer"
import navigation from '../../menu-items'
import { Outlet } from "react-router-dom"
import '../../assets/styles/global.scss'
import { useGiraf } from "../../giraff"
import CustomizeDrawer from "./customise"
import { useEffect, useState } from "react"
import useGetApi from "../../hooks/getapi"
import usePushMessage from "../../hooks/pushmessage"
import MessageBox from "../../components/message"
import Loading from "../../components/loading"
import appConfig from "../../config"
const MainLayout = () => {
    return (
        <div className="app_container">
                <Outlet />
        </div>
    )
}

export default MainLayout