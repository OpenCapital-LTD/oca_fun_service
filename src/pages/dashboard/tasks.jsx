import { CloseOutlined } from '@mui/icons-material'
import '../../assets/styles/tasks.scss'
import { useGiraf } from '../../giraff'
import { useState } from 'react'
import useGetApi from '../../hooks/getapi'
import usePostApi from '../../hooks/postapi'
import usePushMessage from '../../hooks/pushmessage'
import MessageBox from '../../components/message'
import Loading from '../../components/loading'
import appConfig from '../../config'
import { LoadingOutlined } from '@ant-design/icons'

const Tasks = () => {
    const { gHead, addGHead } = useGiraf()
    const [loading, setLoading] = useState(false)
    const { actionRequest } = useGetApi()
    const { actionRequest: actionPostRequest } = usePostApi()
    const { messageType, response, pushMessage } = usePushMessage()
    const [name, setName] = useState()
    const [due_date, setDate] = useState('')

    const postTask = () => {
        if (!name || !due_date) return pushMessage('you must provide both name and date')
        setLoading(true)
        actionPostRequest({
            endPoint: `${appConfig.api.BASE_URL}tasks`, params: {
                name,
                due_date
            }
        }).then((res) => {
            pushMessage(res.message, 'success')
            addGHead('expense_ref', true)
            addGHead('task_box', false)

        }).catch((err) => {
            pushMessage(err.message, 'error')
        }).finally(() => {
            setLoading(false)
        })
    }

    return (
        <div className='task_box'>
            {response && <MessageBox type={messageType} txt={response} />}
            {loading && <Loading />}

            <div className='main_box'>
                <CloseOutlined className='close' onClick={() => {
                    addGHead('task_box', false)
                }} />

                <label>
                    <p>Task Name</p>
                    <input placeholder='name of task' type='text' onChange={(e) => {
                        setName(e.target.value)

                    }} />
                </label>
                <label>
                    <p>Due Date</p>
                    <input type='date' onChange={(e) => {
                        if (new Date(e.target.value).getTime() < new Date().getTime()) {
                            pushMessage('you must provide a valid date')
                            return
                        }
                        setDate(e.target.value)



                    }} value={due_date} />
                </label>
                <div className='save' onClick={() => {
                    if (loading) return
                    postTask()
                }}>
                    {loading ? <LoadingOutlined /> : 'Save'}
                </div>
            </div>
        </div>
    )
}
export default Tasks