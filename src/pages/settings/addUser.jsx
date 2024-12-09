import { CloseOutlined } from '@mui/icons-material'
import '../../assets/styles/users.scss'
import { useGiraf } from '../../giraff'
import { useEffect, useState } from 'react'
import useGetApi from '../../hooks/getapi'
import usePostApi from '../../hooks/postapi'
import usePushMessage from '../../hooks/pushmessage'
import appConfig from '../../config'
import Loading from '../../components/loading'
import MessageBox from '../../components/message'
const AddUser = () => {
    const { gHead, addGHead } = useGiraf()

    const [refresh, setRefresh] = useState(false)
    const [loading, setLoading] = useState(false)
    const [countries, setCountries] = useState()
    const { actionRequest } = useGetApi()
    const { actionRequest: actionPostRequest } = usePostApi()
    const { messageType, response, pushMessage } = usePushMessage()
    const [permissionList, setPermissionList] = useState(new Set([]))
    const [pl, setPl] = useState()

    const [email, setEmail] = useState()
    const [firstName, setFirstName] = useState()
    const [lastName, setLastName] = useState()
    const [password, setPassword] = useState()
    const [country, setCountry] = useState()

    useEffect(() => {
        setLoading(true)
        actionRequest({ endPoint: `${appConfig.api.AUTH_URL}accounts/countries` }).then((res) => {
            console.log(res)
            setCountries(res.data)

        }).catch((err) => {
            pushMessage(err.message, 'error')
        }).finally(() => {
            setLoading(false)
        })
        setLoading(true)
        actionRequest({ endPoint: `${appConfig.api.AUTH_URL}accounts/roles` }).then((res) => {
            console.log(res)
            setPl(res.data)

        }).catch((err) => {
            pushMessage(err.message, 'error')
        }).finally(() => {
            setLoading(false)
        })
        return setRefresh(false)
    }, [refresh])

    const postUser = () => {
        setLoading(true)
        if (!email || !firstName || !lastName || !country || permissionList.size == 0) return pushMessage('missings roles or permissions')
        actionPostRequest({
            endPoint: `${appConfig.api.AUTH_URL}accounts/user`, params: {
                email,
                firstName,
                lastName,
                password,
                country,
                roles: [...permissionList]
            }
        }).then(res => {
            pushMessage(res.message, 'success')
            addGHead('addUser', false)
            addGHead('ref_users', true)
        }).catch(err => {
            pushMessage(err.message, 'error')
        }).finally(() => {
            setLoading(false)
        })
    }
    return (
        <div className="add_user_cont">
            {response && <MessageBox type={messageType} txt={response} />}
            {loading && <Loading />}
            <div className="form">
                <h2>Add User</h2>
                <CloseOutlined className='close' onClick={() => {
                    addGHead('addUser', false)
                }} />
                <div className='fields'>
                    <div className='holder'>
                        <p>Email</p>
                        <input placeholder='example@opencapital.com' onChange={(e) => {
                            setEmail(e.target.value)
                        }} />
                    </div>
                    <div className='name'>
                        <div className='holder'>
                            <p>First Name</p>
                            <input placeholder='Shellton' onChange={(e) => {
                                setFirstName(e.target.value)
                            }} />
                        </div>
                        <div className='holder'>
                            <p>Second Name</p>
                            <input placeholder='Omondi' onChange={(e) => {
                                setLastName(e.target.value)
                            }} />
                        </div>
                    </div>
                    <div className='holder'>
                        <p>Country Office</p>
                        <select onChange={(e) => {
                            setCountry(e.target.value)
                        }} >
                            <option disabled selected>~ select country office ~</option>
                            {countries && countries.map(l => {
                                return (
                                    <option value={l.office_id}>{l.office_id}</option>

                                )
                            })}
                        </select>
                    </div>
                    <div className='holder'>
                        <p>User Roles</p>
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
                            {pl && pl.map(l => {
                                console.log(l)
                                return (
                                    <option value={l.name}>{l.name}</option>
                                )
                            })}
                        </select>
                    </div>
                    <div className='buttons'>
                        <div className='sub' onClick={() => {
                            addGHead('addUser', false)
                        }}>Cancel</div>
                        <div className='sub' onClick={() => {
                            postUser()
                        }}>Save</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddUser