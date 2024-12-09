// import {useGiraf} from '../giraff'

import React, { useEffect, useState } from "react"
import { useGiraf } from "../giraff"
import { useRoutes } from "react-router-dom"
import MainRoutes from "./mainRoutes"
import Cookies from 'js-cookie'
import { jwtDecode } from "jwt-decode"
import { LoadingOutlined } from "@ant-design/icons"

const ThemeRoutes = () => {
    
    return useRoutes([MainRoutes])
    // return useRoutes([gHead.logedIn ? MainRoutes : AuthRoutes])

}
export default ThemeRoutes