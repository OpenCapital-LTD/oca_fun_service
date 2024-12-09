import { CloseOutlined } from '@mui/icons-material'
import '../../assets/styles/groups.scss'
import { useGiraf } from '../../giraff'
import AddGroup from './addGroup'
import { useEffect, useState } from 'react'
import useGetApi from '../../hooks/getapi'
import MessageBox from '../../components/message'
import Loading from '../../components/loading'
import appConfig from '../../config'
import usePushMessage from '../../hooks/pushmessage'
import usePostApi from '../../hooks/postapi'
const Groups = () => {
    const { gHead, addGHead } = useGiraf()
    const { messageType, response, pushMessage } = usePushMessage()
    const [loading, setLoading] = useState(false)
    const { actionRequest } = useGetApi()
    const { actionRequest: actionPostRequest } = usePostApi()
    const [countries, setCountries] = useState()
    const [focused, setFocused] = useState()
    const [refresh, setRefresh] = useState(false)

    const [name, setName] = useState('')
    const [office, setOffice] = useState('')
    const [parent, setParent] = useState('')
    const [currency, setCurrency] = useState('')

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
        return addGHead("ref_countries", false)
    }, [gHead.ref_countries])

    const updateOffice = () => {
        if (!name || !office) return pushMessage("missing name or office")
        setLoading(true)

        actionPostRequest({
            endPoint: `${appConfig.api.AUTH_URL}accounts/countries`, params: {
                name,
                parent,
                currency,
                edit: true,
                office_id: office
            }
        }).then((res) => {
            pushMessage(res.message, 'success')
            addGHead("ref_countries", true)
            addGHead("editGroup", false)


        }).catch((err) => {
            console.log(err)
            pushMessage(err.message, 'error')
        }).finally(() => {
            setLoading(false)

        })
    }

    return (
        <div className="groups_tab">
            {response && <MessageBox type={messageType} txt={response} />}
            {loading && <Loading />}

            {gHead.editGroup === true && <div className='right_pane'>
                <CloseOutlined className='close' onClick={() => {
                    addGHead("editGroup", false)
                }} />
                <div className='boxer'>
                    <h4 >Edit Office</h4>

                </div><div className='input'>
                    <p>Office ID</p>
                    <input placeholder='office ID' value={office} onChange={(e) => {
                        setOffice(e.target.value)
                    }} />
                </div>
                <div className='input'>
                    <p>Country Name</p>
                    <input placeholder='country name' value={name} onChange={(e) => {
                        setName(e.target.value)
                    }} />
                </div>


                <div className='input'>
                    <p>Currency</p>
                    <input placeholder='KES' value={currency} onChange={(e) => {
                        setCurrency(e.target.value)
                    }} />

                </div>
                <div className='input'>
                    <p>Parent</p>
                    <select onChange={(e) => {
                        setParent(e.target.value)
                    }} >
                        <option selected disabled>~ select parent office ~</option>
                        <option>OCA Kenya</option>
                        <option>OCA Uganda</option>

                    </select>
                </div>
                <div className='button' onClick={() => {
                    updateOffice()
                }}>Save</div>

            </div>}
            <h3>Country Office</h3>
            <div className='button' onClick={() => {
                addGHead('addGroup', true)
            }}>+ Add Office</div>
            {gHead.addGroup == true && <AddGroup />}
            <div className='lister' >
                <p>Name</p>
                <p>Office ID</p>
                <p>Currency</p>
                <p>Group</p>
            </div>
            {countries && countries.map(l => {
                return (
                    <div key={l.id} className='lister' onClick={() => {
                        addGHead("editGroup", true)
                        setOffice(l.office_id)
                        setName(l.name)
                        setCurrency(l.currency)
                        setParent(l.parent)
                    }}>
                        <p>{l.name}</p>
                        <p>{l.office_id}</p>
                        <p>{l.currency}</p>
                        <p>Open Capital Group</p>
                    </div>
                )
            })}
        </div>
    )
}

export default Groups