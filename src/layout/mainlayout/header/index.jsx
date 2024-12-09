import React from 'react'
import { LogoutOutlined, MenuOutlined, UploadOutlined } from "@mui/icons-material"
import "../../../assets/styles/header.scss"
import { FiMapPin, FiUpload } from "react-icons/fi"
import { HiOutlineClipboardDocumentList } from "react-icons/hi2"
import { useGiraf } from "../../../giraff"
import { useNavigate } from "react-router-dom"
import { Tooltip } from "@mui/material"
import Cookies from 'js-cookie'
import { getDate } from "../../../BFF/utils"

const Header = () => {
    const { gHead, addGHead } = useGiraf()
    const navigate = useNavigate()
    return (
        <div
            className="main_header"
        >
            <div className="avatar_sec">
                <p className="avatar">{gHead.user?.firstName[0]}{gHead.user?.lastName[0]}</p>
                <p className="atom_par" style={{
                    marginTop: '10px',
                    marginLeft: '20px',
                    width: '200px',
                }}>Hi {gHead.user?.firstName} <p style={{
                    fontWeight: '300',
                    fontSize: '14px'
                }}>Today is : {getDate(new Date()).date}</p></p>
            </div>
            <div className="action_sec">
                <Tooltip title='single upload'>
                    <div className="action_but" onClick={() => {
                        navigate('.')
                        addGHead("toolbar", true)
                        addGHead("focused_expense", null)
                        addGHead('filer', true)
                    }}>
                        <div className="action_atom">
                            <UploadOutlined />
                        </div>

                        {/* <div>Upload</div> */}
                    </div>
                </Tooltip>
                <Tooltip title='bulk upload'>

                    <div className="action_but" onClick={() => {
                        addGHead("toolbar", false)
                        navigate('bulk')
                    }}>
                        <div className="action_atom">
                            <HiOutlineClipboardDocumentList />
                        </div>

                        {/* <div>Bulk Upload</div> */}
                    </div>
                </Tooltip>
                <Tooltip title='Log Out'>
                    <div className="action_but" onClick={() => {
                        Cookies.remove('auth_token')
                        addGHead("logedIn", false)
                    }}>
                        <div className="action_atom">
                            <LogoutOutlined />
                        </div>

                        {/* <div>Log Out</div> */}
                    </div>
                </Tooltip>
            </div>
        </div>
    )
}

export default Header