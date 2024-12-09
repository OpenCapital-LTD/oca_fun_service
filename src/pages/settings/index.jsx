import { Button, Switch, Tooltip } from '@mui/material'
import '../../assets/styles/settings.scss'
import { AddOutlined, SearchOutlined } from '@mui/icons-material'
import AddUser from './addUser'
import { useGiraf } from '../../giraff'
import EditUser from './editUser'
import { useEffect, useState } from 'react'
import usePushMessage from '../../hooks/pushmessage'
import MessageBox from '../../components/message'
import Loading from '../../components/loading'
import useGetApi from '../../hooks/getapi'
import appConfig from '../../config'
import { shortenWord } from '../../BFF/utils'

const Settings = () => {
    const { gHead, addGHead } = useGiraf()
    const { messageType, response, pushMessage } = usePushMessage()
    const [loading, setLoading] = useState(false)
    const [users, setUsers] = useState([])
    const { actionRequest } = useGetApi()
    const [refresh, setRefresh] = useState(false)

    useEffect(() => {
        setLoading(true)
        actionRequest({ endPoint: `${appConfig.api.AUTH_URL}accounts/user/search` }).then((res) => {
            console.log('here is the res : ',res.data)
            setUsers(res.data)
        }).catch((err) => {
            pushMessage(err.message, 'error')
        }).finally(() => {
            setLoading(false)
        })
        return addGHead("ref_users", false)
    }, [gHead.ref_users])
    return (
        <div className='settings'>
            {response && <MessageBox type={messageType} txt={response} />}
            {loading && <Loading />}

            <div className='header'>
                {gHead.addUser === true && <AddUser />}
                {gHead.edit_user === true && <EditUser />}
                <h2>Users</h2>
                <div className='button' onClick={() => {
                    addGHead('addUser', true)
                }}>
                    <AddOutlined size={13} />
                    <p>Add Users</p>
                </div>
            </div>
            <div className='filter'>
                <input placeholder='search by name' />

                <SearchOutlined className="search_butt" size={1} />
            </div>
            <div className="lister">
                <div className="lister_header">
                    <p>User</p>
                    <p>Groups</p>
                    <p>Roles</p>
                    <p>Status</p>
                </div>
                {
                    users && [...users].map(l => {
                        // l.forEach(k=>console.log('here is k : ',k))
                        return (

                            <div key={l.id} className="lister_row" onClick={() => {
                                addGHead('edit_user', true)
                                addGHead('ref_edit_user', true)
                                addGHead('focused_user', l)
                            }}>

                                <div className="avator" >
                                    <div className="init" 
                                   style={{
                                    backgroundImage: `url('${l.url_image ? l.url_image : l.picture}')`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                                    >{!l.url_image && `${l?.firstName[0]}${l?.lastName[0]}`}</div>
                                    <div className="desc">
                                        <p>{`${l.firstName} ${l.lastName}`}</p>
                                        <p className='greyed'>{l.email}</p>
                                    </div>
                                </div>
                                <div className='g'>Open Capital</div>
                                <Tooltip title={l.UserRoles?.map(l=>l.Role?.name).join(', ')}>
                                <div className='r'>{shortenWord([...(new Set(l.UserRoles?.map(l => l.Role?.name)))].join(', '), 25)}</div>
                                </Tooltip>
                                <div className='s' onClick={(e) => {
                                    console.log('')
                                }}>
                                    <Switch checked={l.status === 'ACTIVE'} />
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Settings