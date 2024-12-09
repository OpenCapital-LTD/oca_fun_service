import { AddOutlined, ViewAgenda } from '@mui/icons-material'
import '../../assets/styles/reciepts.scss'
import { DownOutlined } from '@ant-design/icons'
import { FaRegFolderOpen } from 'react-icons/fa'
import { useGiraf } from '../../giraff'
import { useEffect, useState } from 'react'
import useGetApi from '../../hooks/getapi'
import usePushMessage from '../../hooks/pushmessage'
import appConfig from '../../config'
import { getDate } from '../../BFF/utils'
import MessageBox from '../../components/message'
import Loading from '../../components/loading'
import View from './view'

const Reciepts = () => {
    const { gHead, addGHead } = useGiraf()
    const [folder, setFolders] = useState([])
    const [loading, setLoading] = useState(true)
    const [receiptlist, setReceiptList] = useState([])

    const { actionRequest } = useGetApi()
    const { messageType, response, pushMessage } = usePushMessage()

    useEffect(() => {
        addGHead('toolbar', false)
        console.log('expenses', gHead.user_expenses)

        actionRequest({ endPoint: `${appConfig.api.BASE_URL}expense/user` }).then((res) => {
            addGHead('user_expenses', res.data)

            const files = res.data?.filter(l => l.file_url) || []
            const folders = new Map()
            files.forEach(l => {
                let d = new Date(l.log_date)
                const month = getDate(d).month
                if (folders.has(month)) {
                    let fs = folders.get(month)
                    fs.push(l)
                    folders.set(month, fs)
                } else {
                    folders.set(month, [l])
                }
            })
            let fls = []
            folders.forEach((l, f) => {
                fls.push({
                    folder: f,
                    links: l
                })
            })
            console.log('some ',res.data)
            setFolders(fls)
        }).catch((err) => {
            pushMessage(err.message, 'error')
        }).finally(() => {
            setLoading(false)
        })
    }, [])
    return (
        <div className="reciepts">
            {response && <MessageBox type={messageType} txt={response} />}
            {loading && <Loading />}
            {gHead.receipt_view && <View />}

            <h3>Your Receipts</h3>
            <p className='categ_act filter'>+ Add Filter</p>
            <div className='r_holder'>

                <div className='holder'>
                    {folder?.map(l => {
                        return (
                            <div className='folder' key={l.folder} onClick={() => {
                                setReceiptList(l.links)
                                console.log(l.links)
                            }}>
                                <p>{l.folder}</p>
                                <FaRegFolderOpen className='icon' size={50} />

                            </div>
                        )
                    })}
                </div>
                <div className='lister'>
                    <h4>Records</h4>
                    {
                        receiptlist.length > 0 ? receiptlist.map((l) => {
                            return (
                                <div className='record' onClick={() => {
                                    addGHead('receipt_view', true)
                                    addGHead('receipt_url', l.file_url)
                                }}>
                                    <ViewAgenda />
                                    <p>{getDate(new Date(l.log_date)).date} - {l.invoice}</p>
                                </div>)
                        })
                            :
                            <div style={{
                                marginTop: '30%'
                            }}>click folder to view </div>
                    }

                </div>
            </div>
        </div>
    )
}

export default Reciepts