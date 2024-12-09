import { CloseOutlined } from '@mui/icons-material'
import '../../assets/styles/groups.scss'
import '../../assets/styles/roles.scss'
import { useGiraf } from '../../giraff'
import AddGroup from './addGroup'
import AddRole from './addRole'
import { useEffect, useState } from 'react'
import useGetApi from '../../hooks/getapi'
import appConfig from '../../config'
import usePushMessage from '../../hooks/pushmessage'
import MessageBox from '../../components/message'
import Loading from '../../components/loading'
import { shortenWord } from '../../BFF/utils'
import usePostApi from '../../hooks/postapi'
import { Tooltip } from '@mui/material'
const Roles = () => {
    const { gHead, addGHead } = useGiraf()
    const { actionRequest } = useGetApi()
    const { actionRequest: actionPostRequest } = usePostApi()
    const [loading, setLoading] = useState(false)
    const [roles, setRoles] = useState([])
    const [permissionList, setPermissionList] = useState([])
    const [apps, setApps] = useState([])
    const [role, setRole] = useState('')
    const { messageType, response, pushMessage } = usePushMessage()
    useEffect(() => {
        setLoading(true)
        actionRequest({ endPoint: `${appConfig.api.AUTH_URL}accounts/permissions` }).then((res) => {
            addGHead('permissions', res.data)
        }).catch((err) => {
            pushMessage(err.message, 'error')
        }).finally(() => {
            setLoading(false)
        })
        setLoading(true)
        actionRequest({ endPoint: `${appConfig.api.AUTH_URL}accounts/apps` }).then((res) => {
            addGHead('apps', res.data)
        }).catch((err) => {
            pushMessage(err.message, 'error')
        }).finally(() => {
            setLoading(false)
        })
        setLoading(true)
        actionRequest({ endPoint: `${appConfig.api.AUTH_URL}accounts/roles` }).then((res) => {
            setRoles(res.data)
        }).catch((err) => {
            pushMessage(err.message, 'error')
        }).finally(() => {
            setLoading(false)
        })

        return addGHead("ref_roles", false)
    }, [gHead.ref_roles])

    const postRole = () => {
        setLoading(true)
        if (!role || permissionList.size == 0 || apps.size == 0) return pushMessage('missings roles or permissions')
        let aps = gHead.apps?.filter(d => {
            return [...apps].includes(d?.name)
        }).map(l => l.id)
        actionPostRequest({
            endPoint: `${appConfig.api.AUTH_URL}accounts/roles`, params: {
                name: role,
                edit: true,
                apps: aps,
                permissions: [...permissionList]
            }
        }).then(res => {
            pushMessage(res.message, 'success')
            addGHead('addRole', false)
        }).catch(err => {
            pushMessage(err.message, 'error')
        }).finally(() => {
            setLoading(false)
        })
    }
    return (
        <div className="groups_tab roles">
            {response && <MessageBox type={messageType} txt={response} />}
            {loading && <Loading />}

            {gHead.editGroup === true && <div className='right_pane'>
                <CloseOutlined className='close' onClick={() => {
                    addGHead("editGroup", false)
                }} />
                <div className='boxer'>
                    <h4 >Edit Role</h4>

                </div><div className='input'>
                    <p>Role Name</p>
                    <input placeholder='role name' disabled value={role} onChange={(e) => {
                        setRole(e.target.value)
                    }} />
                </div>
                <p style={{
                    fontSize: '12px',
                    marginTop: '10px'
                }}>Permissions</p>
                <div className='role_list'>

                    {[...permissionList].map((p, x) => {
                        return (
                            <div >
                                <p>{p}</p>
                                <CloseOutlined className='close' onClick={() => {
                                    let new_arr = [...permissionList]
                                    new_arr.splice(x, 1)
                                    setPermissionList(new Set([...new_arr]))
                                }} />
                            </div>
                        )
                    })}
                </div>
                <p style={{
                    fontSize: '12px',
                    marginTop: '10px'
                }}>Apps</p>
                <div className='role_list'>
                    {[...apps].map((p, x) => {
                        return (
                            <div >
                                <p>{p}</p>
                                <CloseOutlined className='close' onClick={() => {
                                    let new_arr = [...apps]
                                    new_arr.splice(x, 1)
                                    setApps(new Set([...new_arr]))
                                }} />
                            </div>
                        )
                    })}
                </div>
                <div className='input'>
                    <p>Apps</p>
                    <select onChange={(e) => {
                        setApps(l => {

                            return new Set([...l, e.target.value])
                        })
                    }}>
                        <option selected disabled>~ select apps ~</option>
                        {gHead.apps && gHead.apps.map(l => {
                            return (
                                <option value={l?.name}>{l?.name}</option>
                            )
                        })}

                    </select>
                </div>
                <div className='input'>
                    <p>Permissions</p>
                    <select onChange={(e) => {
                        setPermissionList(l => {

                            return new Set([...l, e.target.value])
                        })
                    }}>
                        <option selected disabled>~ select permission ~</option>
                        {gHead.permissions && gHead.permissions.map(l => {
                            return (
                                <option value={l.key}>{l.key}</option>
                            )
                        })}

                    </select>
                </div>
                <div className='button' onClick={() => {
                    postRole()
                }}>Save</div>

            </div>}
            <h3>Roles</h3>
            <div className='button' onClick={() => {
                addGHead('addRole', true)
            }}>+ Add Role</div>
            {gHead.addRole == true && <AddRole />}
            <div className='lister' >
                <p>Role Name</p>
                <p>Apps</p>
                <p>Permissions</p>
            </div>

            {roles.map(l => {
                console.log()
                return (

                    <div className='lister' onClick={() => {
                        addGHead("editGroup", true)
                        setRole(l?.name)
                        setPermissionList(Object.keys(l.Acls).filter(k => l.Acls[k] === true))
                        setApps(l.AppAcls.map(d => d.App?.name))
                    }}>
                        <p>{l?.name}</p>
                        <Tooltip title={l.AppAcls.map(l => l.App.name).join(', ')}>
                            <p>{shortenWord(l.AppAcls.map(l => l.App.name).join(', '), 30)}</p>
                        </Tooltip>
                        <Tooltip title={Object.keys(l.Acls).filter(k => l.Acls[k] === true).join(', ')}>
                            <p>{shortenWord(Object.keys(l.Acls).filter(k => l.Acls[k] === true).join(', '), 30)}</p>
                        </Tooltip>
                    </div>
                )

            })}
        </div>
    )
}

export default Roles