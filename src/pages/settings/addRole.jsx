import { CloseOutlined } from '@mui/icons-material'
import '../../assets/styles/users.scss'
import { useGiraf } from '../../giraff'
import { useEffect, useState } from 'react'
import MessageBox from '../../components/message'
import Loading from '../../components/loading'
import usePostApi from '../../hooks/postapi'
import usePushMessage from '../../hooks/pushmessage'
import appConfig from '../../config'
const AddRole = () => {
    const { gHead, addGHead } = useGiraf()
    const [permissionList, setPermissionList] = useState(new Set([]))
    const [apps, setApps] = useState(new Set([]))
    const { messageType, response, pushMessage } = usePushMessage()
    const [loading, setLoading] = useState(false)
    const { actionRequest } = usePostApi()
    const [role, setRole] = useState('')
    const [type, setType] = useState('')

    const postRole = () => {
        setLoading(true)
        if (!role || permissionList.size == 0 || apps.size == 0) return pushMessage('missings roles, apps or permissions')
        let aps = gHead.apps?.filter(d => {
            return [...apps].includes(d.name)
        }).map(l=>l.id)
        actionRequest({
            endPoint: `${appConfig.api.AUTH_URL}accounts/roles`, params: {
                name: role,
                type,
                apps: aps,
                permissions: [...permissionList]
            }
        }).then(res => {
            pushMessage(res.message, 'success')
            addGHead('addRole', false)
            addGHead("ref_roles", false)
        }).catch(err => {
            pushMessage(err.message, 'error')
        }).finally(() => {
            setLoading(false)
        })
    }

    return (
        <div className="add_user_cont add_office">
            {response && <MessageBox type={messageType} txt={response} />}
            {loading && <Loading />}
            <div className="form">
                <h2>Add Role</h2>
                <CloseOutlined className='close' onClick={() => {
                    addGHead('addRole', false)
                }} />
                <div className='fields'>

                    <div className='holder'>
                        <p>Role Name</p>
                        <input placeholder='role name' onChange={(e) => {
                            setRole(e.target.value)
                        }} />
                    </div>
                    <div className='holder two'>

                        <select style={{
                            marginTop: '2%'
                        }} onChange={(e) => {
                            setType(e.target.value)
                        }}>
                            <option selected disabled>~ Role Type ~</option>
                            <option value={'USER'}> user </option>
                            <option value={'ADMIN'}> admin </option>
                            <option value={'APPROVER'}> approver </option>

                        </select>

                        <p>App(s)</p>
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
                        <select onChange={(e) => {
                            setApps(l => {
                                return new Set([...l, e.target.value])
                            })
                        }}>
                            <option selected disabled>~ select apps ~</option>
                            {gHead.apps && gHead.apps.map(l => {
                                return (
                                    <option value={l.name}>{l.name}</option>
                                )
                            })}
                        </select>

                        <p>Permissions</p>
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


                    <div className='buttons'>
                        <div className='sub' onClick={() => {
                            addGHead('addRole', false)
                        }}>Cancel</div>
                        <div className='sub' onClick={() => {
                            postRole()
                        }}>Save</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddRole