import { CloseOutlined, EditOutlined } from '@mui/icons-material'
import '../../assets/styles/users.scss'
import { useEffect, useState } from 'react'
import { Switch } from '@mui/material'
import { MdModeEditOutline } from 'react-icons/md'
import { useGiraf } from '../../giraff'
import MessageBox from '../../components/message'
import Loading from '../../components/loading'
import usePushMessage from '../../hooks/pushmessage'
import appConfig from '../../config'
import useGetApi from '../../hooks/getapi'
import usePutApi from '../../hooks/putapi'
const EditUser = () => {
    const [menu, setMenu] = useState("ACCOUNT")
    const [g_floater, setGFloater] = useState(false)
    const [edit, setEdit] = useState(false)
    const { gHead, addGHead } = useGiraf()
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [phone, setPhone] = useState('')
    const { actionRequest } = useGetApi()
    const { actionRequest: actionPutRequest } = usePutApi()
    const { messageType, response, pushMessage } = usePushMessage()
    const [loading, setLoading] = useState(false)
    const [role_list, setRoleList] = useState()
    const [country_list, setCountryList] = useState()
    const [office, setCountryOffice] = useState()
    const [user_roles, setUserRoles] = useState([])
    const [or_user_roles, setOrUserRoles] = useState()
    const [rm_roles, setRmRoles] = useState([])

    // const [name, setName] = useState('')
    useEffect(() => {
        if (gHead.focused_user) {
            setFirstName(gHead.focused_user.firstName)
            setLastName(gHead.focused_user.lastName)
            setPhone(gHead.focused_user.phone)
            setCountryOffice(gHead.focused_user.country)
            setUserRoles(gHead.focused_user.UserRoles.map(l => l.Role.name))
            setOrUserRoles(gHead.focused_user.UserRoles.map(l => l.Role.name))
        }
        return addGHead('ref_edit_user', false)
    }, [gHead.ref_edit_user])

    useEffect(() => {
        setLoading(true)
        actionRequest({ endPoint: `${appConfig.api.AUTH_URL}accounts/roles` }).then((res) => {
            setRoleList(res.data)
        }).catch((err) => {
            pushMessage(err.message, 'error')
        }).finally(() => {
            setLoading(false)
        })
        actionRequest({ endPoint: `${appConfig.api.AUTH_URL}accounts/countries` }).then((res) => {
            setCountryList(res.data)
        }).catch((err) => {
            pushMessage(err.message, 'error')
        }).finally(() => {
            setLoading(false)
        })
        return addGHead('ref_edit_user', false)

    }, [gHead.ref_edit_user])

    const updatePersonalInfo = async () => {
        setLoading(true)
        actionPutRequest({
            endPoint: `${appConfig.api.AUTH_URL}accounts/user`, params: {
                id: gHead.focused_user.id,
                firstName,
                lastName,
                phone
            }
        }).then(res => {
            pushMessage(res.message, 'success')
            addGHead('ref_users', true)
            setEdit(l => false)
        }).catch(err => {
            pushMessage(err.message, 'error')
        }).finally(() => {
            setLoading(false)
        })
    }
    const updateUserOffice = async () => {
        setLoading(true)
        actionPutRequest({
            endPoint: `${appConfig.api.AUTH_URL}accounts/countries/user`, params: {
                user: gHead.focused_user.id,
                country: office
            }
        }).then(res => {
            pushMessage(res.message, 'success')
            addGHead('ref_users', true)
            setEdit(l => false)
        }).catch(err => {
            pushMessage(err.message, 'error')
        }).finally(() => {
            setLoading(false)
        })
    }
    const updateRoles = async () => {
        let wk_rm = rm_roles.filter(r => !user_roles.includes(r));
        wk_rm = new Set(wk_rm.filter(r => or_user_roles.includes(r)));
        let wk_roles = new Set(user_roles.filter(r => !or_user_roles.includes(r)));

        console.log('remove user roles', [...wk_rm])
        console.log('user roles', [...wk_roles])

        setLoading(true)
        actionPutRequest({
            endPoint: `${appConfig.api.AUTH_URL}accounts/roles/user`, params: {
                id: gHead.focused_user.id,
                roles: [...wk_roles],
                rmRoles:[...wk_rm]
            }
        }).then(res => {
            pushMessage(res.message, 'success')
            addGHead('ref_users', true)
            setEdit(l => false)
        }).catch(err => {
            pushMessage(err.message, 'error')
        }).finally(() => {
            setLoading(false)
        })
    }
    const label = { inputProps: { 'aria-label': 'Switch demo' } };
    return (
        <div className="edit_floater">
            {response && <MessageBox type={messageType} txt={response} />}
            {loading && <Loading />}

            <div className="header top">
                <div className='avator'>
                    <div className='init'>{gHead?.focused_user?.firstName[0]}{gHead?.focused_user?.lastName[0]}</div>
                    <div className='desc'>
                        <h5>{gHead?.focused_user?.firstName} {gHead?.focused_user?.lastName}</h5>
                        <p>{gHead?.focused_user?.email}</p>
                    </div>
                </div>
                <div className='close' onClick={() => {
                    addGHead('edit_user', false)
                }}>
                    <CloseOutlined />
                </div>
            </div>
            <div className='menu'>
                <p style={{
                    backgroundColor: menu === 'ACCOUNT' && '#2D3E50',
                    color: menu === 'ACCOUNT' ? 'white' : '#2D3E50'
                }}
                    onClick={() => {
                        setMenu('ACCOUNT')
                        setEdit(false)
                        setFirstName(gHead.focused_user.firstName)
                        setLastName(gHead.focused_user.lastName)
                        setPhone(gHead.focused_user.phone)
                        setCountryOffice(gHead.focused_user.country)
                        setUserRoles(gHead.focused_user.UserRoles.map(l => l.Role.name))

                    }}
                >OFFICE</p>
                <p style={{
                    backgroundColor: menu === 'ROLES' && '#2D3E50',
                    color: menu === 'ROLES' ? 'white' : '#2D3E50'
                }}
                    onClick={() => {
                        setMenu('ROLES')
                        setEdit(false)
                        setFirstName(gHead.focused_user.firstName)
                        setLastName(gHead.focused_user.lastName)
                        setPhone(gHead.focused_user.phone)
                        setCountryOffice(gHead.focused_user.country)
                        setUserRoles(gHead.focused_user.UserRoles.map(l => l.Role.name))

                    }}>ROLES</p>
                <p style={{
                    backgroundColor: menu === 'DETAILS' && '#2D3E50',
                    color: menu === 'DETAILS' ? 'white' : '#2D3E50'
                }}
                    onClick={() => {
                        setMenu('DETAILS')
                        setEdit(false)
                        setFirstName(gHead.focused_user.firstName)
                        setLastName(gHead.focused_user.lastName)
                        setPhone(gHead.focused_user.phone)
                        setUserRoles(gHead.focused_user.UserRoles.map(l => l.Role.name))

                        setCountryOffice(gHead.focused_user.country)
                    }}>DETAILS</p>
                <p style={{
                    backgroundColor: menu === 'REFERENCES' && '#2D3E50',
                    color: menu === 'REFERENCES' ? 'white' : '#2D3E50'
                }}
                    onClick={() => {
                        setMenu('REFERENCES')
                    }}></p>
            </div>
            {menu === 'ACCOUNT' && <div className='accounts'>
                <div className='groups'>
                    {g_floater && <div className='float_box'>
                        <p onClick={() => {
                            setGFloater(false)
                        }}>x</p>
                        <p>SELECT GROUP</p>
                        {
                            country_list?.map(l => {
                                return (
                                    <div onClick={() => {
                                        setCountryOffice(l.office_id)
                                        setGFloater(false)
                                        setEdit(true)
                                    }}>{l.name}</div>
                                )
                            })
                        }
                    </div>}
                    <div className='header' style={{ marginTop: '30px' }}>
                        <h4>Country Office</h4>
                        {edit && <div className='add' onClick={() => {
                            if (edit) {
                                return updateUserOffice()
                            }
                        }}><MdModeEditOutline size={10} /> save</div>}
                    </div>
                    <div className='lister'>
                        <p className='tt'>CURRENT OFFICE</p>
                        <p style={{
                            marginTop: '20px',
                            fontSize: '12px'
                        }}>{office}</p>
                        <p style={{
                            fontSize: '12px',
                            marginTop: '15px',
                            color: 'dark-blue',
                            textDecoration: 'underline',
                            cursor: 'pointer'

                        }} onClick={() => {
                            setGFloater(t => true)
                        }}>change office</p>
                    </div>
                </div>

            </div>}
            {menu === 'ROLES' && <div className='roles'>
                <div className='header' style={{ marginTop: '30px' }}>
                    <h4>Roles</h4>
                    {edit && <div className='add' onClick={() => {
                        if (edit) {
                            return updateRoles()
                        }
                    }}><MdModeEditOutline size={10} /> save</div>}
                </div>
                <p className='hd'>CURRENT ROLES</p>
                <br></br>

                {role_list?.map(l => {
                    return (
                        <div className='role_list' style={{
                            cursor: 'pointer'
                        }} onClick={() => {
                            setEdit(true)
                            if (user_roles.includes(l.name)) {
                                setRmRoles(g => {
                                    return [...g, l.name]
                                })
                                let v = user_roles.filter(d => d != l.name)
                                setUserRoles(l => {
                                    return [...v]
                                })

                            } else {
                                setUserRoles(g => {
                                    return [...g, l.name]
                                })

                            }

                        }} >
                            <input type='checkbox' className='check' checked={user_roles.includes(l.name)} />
                            <div className='desc'>
                                <p className='p1'>{l.name}</p>
                            </div>
                        </div>
                    )
                })}
            </div>}
            {menu === 'DETAILS' && <div className='details'>
                <div className='header' style={{
                    // alignItems:'space-around'
                }}>
                    <h4>Personal Info</h4>
                    <div className='add' onClick={() => {
                        if (edit) {
                            return updatePersonalInfo()
                        }
                        setEdit(l => true)
                    }}><MdModeEditOutline size={10} /> {edit ? 'save' : 'edit'}</div>
                </div>
                <div className='container'>
                    <div className='list'>
                        <p>First Name</p>
                        <input value={firstName} placeholder='- -' disabled={!edit} onChange={e => {
                            setFirstName(e.target.value)
                        }} />
                    </div>
                    <div className='list'>
                        <p>Last Name</p>
                        <input value={lastName} placeholder='- -' disabled={!edit} onChange={e => {
                            setLastName(e.target.value)

                        }} />
                    </div>
                    <div className='list'>
                        <p>Phone</p>
                        <input value={phone} placeholder='- -' disabled={!edit} onChange={e => {
                            setPhone(e.target.value)

                        }} />
                    </div>
                </div>

            </div>}
        </div>
    )
}
export default EditUser