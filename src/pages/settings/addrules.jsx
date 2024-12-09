import { CloseOutlined } from '@mui/icons-material'
import '../../assets/styles/users.scss'
import '../../assets/styles/groups.scss'
import '../../assets/styles/roles.scss'
import { useGiraf } from '../../giraff'
import { useState } from 'react'
import MessageBox from '../../components/message'
import Loading from '../../components/loading'
import usePushMessage from '../../hooks/pushmessage'
import usePostApi from '../../hooks/postapi'
import appConfig from '../../config'
const AddExpenseRules = () => {
    const { gHead, addGHead } = useGiraf()
    const [rolesList, setRolesList] = useState(new Set([]))
    const { actionRequest } = usePostApi()
    const { messageType, response, pushMessage } = usePushMessage()
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState()
    const [limit, setLimit] = useState()
    const [category, setCategory] = useState()

    const pushRule = () => {
        if (!name || !limit || [...rolesList].length == 0 || !category) return pushMessage('you must enter all the fields')
        const roles = gHead.roles.filter(l => [...rolesList].includes(l.name))?.map(l => l.id)
        setLoading(true)
        actionRequest({
            endPoint: `${appConfig.api.BASE_URL}settings/rules`, params: {
                name,
                roles,
                limit,
                categoriesId: category
            }
        }).then(res => {
            pushMessage(res.message, 'success')
            addGHead('addRule', false)
            addGHead('ref_rle', true)
        }).catch(err => {
            pushMessage(err.message, 'error')
        }).finally(() => {
            setLoading(false)
        })


    }

    return (
        <div className="add_user_cont add_office e_rules">
            {response && <MessageBox type={messageType} txt={response} />}
            {loading && <Loading />}

            <div className="form">
                <div className='head'>
                    <h2>Add Expense Rule</h2>
                    <CloseOutlined className='close' onClick={() => {
                        addGHead('addRule', false)
                    }} />
                </div>
                <div className='fields'>

                    <div className='holder'>
                        <p>Rule Name</p>
                        <input placeholder='rule name' onChange={(e) => {
                            setName(e.target.value)
                        }} />
                    </div>
                    <div className='holder'>
                        <p>Roles</p>
                        <div className='role_list'>
                            {[...rolesList]?.map((p, x) => {
                                return (
                                    <div >
                                        <p>{p}</p>
                                        <CloseOutlined className='close' onClick={() => {
                                            let new_arr = [...rolesList]
                                            new_arr.splice(x, 1)
                                            setRolesList(new Set([...new_arr]))
                                        }} />
                                    </div>
                                )
                            })}
                        </div>
                        <select onChange={(e) => {
                            setRolesList(l => {
                                return new Set([...l, e.target.value])
                            })
                        }}>
                            <option selected disabled>~ select roles ~</option>
                            {gHead.roles?.map(l => {
                                return (
                                    <option value={l.name}>{l.name}</option>
                                )
                            })}

                        </select>
                    </div>
                    <div className='holder'>
                        <p>Expense Category</p>
                        <select onChange={(e) => {
                            setCategory(e.target.value)
                        }}>
                            <option selected disabled>~ select category ~</option>
                            {gHead.categories?.map(l => {
                                return (
                                    <option value={l.code}>{l.tag}</option>
                                )
                            })}

                        </select>
                    </div>
                    <div className='holder'>
                        <p>Expense Limit</p>
                        <input placeholder='expense limit' onChange={(e) => {
                            setLimit(e.target.value)
                        }} />
                    </div>
                    <div className='buttons'>
                        <div className='sub' onClick={() => {
                            addGHead('addRule', false)
                        }}>Cancel</div>
                        <div className='sub' onClick={() => {
                            pushRule()
                        }}>Save</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddExpenseRules