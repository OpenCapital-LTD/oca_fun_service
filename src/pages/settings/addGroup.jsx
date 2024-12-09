import { CloseOutlined } from '@mui/icons-material'
import '../../assets/styles/users.scss'
import { useGiraf } from '../../giraff'
import { useState } from 'react'
import usePostApi from '../../hooks/postapi'
import usePushMessage from '../../hooks/pushmessage'
import MessageBox from '../../components/message'
import Loading from '../../components/loading'
import appConfig from '../../config'
const AddGroup = () => {
    const { addGHead } = useGiraf()
    const [name, setName] = useState('')
    const [office, setOffice] = useState(false)
    const [parent, setParent] = useState('')
    const { actionRequest } = usePostApi()
    const [loading, setLoading] = useState(false)
    const { messageType, response, pushMessage } = usePushMessage()
    const [currency, setCurrency] = useState('')


    const createOffice = () => {
        if (!name || !office) return pushMessage("missing name or office")
        setLoading(true)

        actionRequest({
            endPoint: `${appConfig.api.AUTH_URL}accounts/countries`, params: {
                name,
                office,
                currency,
                parent,
                office_id: office
            }
        }).then((res) => {
            pushMessage(res.message, 'success')
            addGHead('addGroup', false)
            addGHead("ref_countries", true)

        }).catch((err) => {
            console.log(err)
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
                <h2>Add Office</h2>
                <CloseOutlined className='close' onClick={() => {
                    addGHead('addGroup', false)
                }} />
                <div className='fields'>

                    <div className='holder'>
                        <p>Country ID</p>
                        <input placeholder='office id' onChange={(e) => {
                            setOffice(e.target.value)
                        }} />
                    </div>
                    <div className='holder'>
                        <p>Country Name</p>
                        <input placeholder='country name' onChange={(e) => {
                            setName(e.target.value)
                        }} />
                    </div>

                    <div className='holder'>
                        <p>Currency</p>
                        <input placeholder='KES' onChange={(e) => {
                            setCurrency(e.target.value)
                        }} />
                    </div>
                    <div className='holder'>
                        <p>Parent</p>
                        <select onChange={(e) => {
                            setParent(e.target.value)
                        }}>
                            <option selected disabled>~ select parent office ~</option>
                            <option>OCA Kenya</option>
                            <option>OCA Uganda</option>

                        </select>
                    </div>


                    <div className='buttons'>
                        <div className='sub' onClick={() => {
                            addGHead('addGroup', false)
                        }}>Cancel</div>
                        <div className='sub' onClick={() => {
                            createOffice()
                        }}>Save</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddGroup