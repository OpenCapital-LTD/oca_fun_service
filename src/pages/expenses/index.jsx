import { useEffect, useState } from 'react'
import '../../assets/styles/expense.scss'
import { useGiraf } from '../../giraff'
import { AddOutlined } from '@mui/icons-material'
import { DownOutlined } from '@ant-design/icons'
import MessageBox from '../../components/message'
import Loading from '../../components/loading'
import useGetApi from '../../hooks/getapi'
import usePostApi from '../../hooks/postapi'
import usePushMessage from '../../hooks/pushmessage'
import appConfig from '../../config'
import { Tooltip } from '@mui/material'
import { shortenWord } from '../../BFF/utils'
import Filler from '../filler'
import Folders from './folders'

const Expense = () => {
    const { gHead, addGHead } = useGiraf()
    const [categ, setCateg] = useState('all')
    const [loading, setLoading] = useState(false)
    const { actionRequest } = useGetApi()
    const { actionRequest: actionPostRequest } = usePostApi()
    const { messageType, response, pushMessage } = usePushMessage()
    const [expenses, setExpenses] = useState([])
    const [approvers, setApprovers] = useState([])

    const switchCateg = (name) => {
        setCateg(name)
    }
    useEffect(() => {
        setLoading(true)
        actionRequest({ endPoint: `${appConfig.api.BASE_URL}expense` }).then((res) => {
            setExpenses(res.data)
        }).catch((err) => {
            pushMessage(err.message, 'error')
        }).finally(() => {
            setLoading(false)
        })
        actionRequest({ endPoint: `${appConfig.api.AUTH_URL}accounts/users/approvers` }).then((res) => {
            console.log('res')
            addGHead('approvers', res.data)
        }).catch((err) => {
            pushMessage(err.message, 'error')
        }).finally(() => {
            setLoading(false)
        })
        return addGHead('expense_ref', false)

    }, [gHead.expense_ref])

    return (
        <div className='expense_main'>
            {response && <MessageBox type={messageType} txt={response} sytles={{
                right: '20px',
                top: '10%',
                height: 'fit-content'
            }} />}
            {loading && <Loading />}
            {gHead.filer && <Filler />}


            <div className='header'>
                <p>Expense</p>

            </div>
            <div className='categs'>
                <div style={{
                    backgroundColor: categ === 'all' ? '#c47c1018' : 'transparent',
                    color: categ === 'all' ? '#2D3E50' : 'grey'
                }} onClick={() => {
                    switchCateg('all')
                }} className='categ_act categ_act_notfocused'>ALL EXPENSES</div>
                <div onClick={() => {
                    switchCateg('todo')
                }} className='categ_act categ_act_focused' style={{
                    backgroundColor: categ === 'todo' ? '#c47c1018' : 'transparent',
                    color: categ === 'todo' ? '#2D3E50' : 'grey'
                }}>TO DO</div>
                {(gHead.user_role?.includes('APPROVER')) && <div onClick={() => {
                    switchCateg('folder')

                }} className='categ_act categ_act_focused' style={{
                    backgroundColor: categ === 'folder' ? '#c47c1018' : 'transparent',
                    color: categ === 'folder' ? '#2D3E50' : 'grey'
                }}>FOLDERS</div>}

            </div>
            <p className='categ_act filter'>+ Add Filter</p>
            <p className='caller'>{expenses.length} expenses, Total {expenses.filter(a => a.amount) !=0 ? expenses.filter(a => a.amount)?.reduce((a, b) => parseInt(b.amount) + a, 0) : '0'} <span style={{
                fontSize: '10px'
            }}>KES</span></p>
            <div className='main_container'>
                {categ == 'folder' ? <Folders /> : < div className="e_lister">
                    <div className="e_row e_header">
                        <p className="e_ind"></p>
                        <p className="e_d">Amount</p>
                        <p className="e_d">Invoice</p>
                        <p className="e_d">Time Code</p>
                        <p className="e_d">Category</p>
                        <p className="e_d">Status</p>
                        <p className="e_d">Date</p>
                    </div>
                    {expenses.filter(l => {
                        if (categ == 'todo') return l.status === 'PENDING' && !l.FolderItem
                        return true
                    }).sort((a, b) => (new Date(b.log_date).getTime()) - (new Date(a.log_date).getTime())).map(l => {
                        console.log()
                        return (
                            <>
                                <Tooltip title={l.status.toLowerCase()}>
                                    <div className="e_row" onClick={() => {
                                        const rp = l.report_period.split(', ')
                                        const d = [
                                            l.id,
                                            rp[0] || '',
                                            rp[1] || '',
                                            l.country,
                                            l.merchant,
                                            l.amount,
                                            l.status,
                                            l.expense_date,
                                            l.invoice,
                                            l.category,
                                            l.time_code,
                                            l.description,
                                            l.pin,
                                            l.etr,
                                            l.file_url,
                                            l.note
                                        ];
                                        d[25] = true
                                        addGHead('focused_expense', d)
                                        addGHead('filer', true)
                                    }}>
                                        <p className="e_ind" style={{
                                            background: l.status == 'APPROVED' || l.status == 'REIMBURSED' ? 'green' : l.status == 'DRAFT' ? 'grey' : l.status == 'REJECTED' ? 'red' : '#ca7300'
                                        }}></p>
                                        <p className="e_d"><span style={{
                                            fontSize: '10px'
                                        }}>KES</span> {l.amount || '0'}</p>
                                        <p className="e_d">{l.invoice}</p>
                                        <p className="e_d">{shortenWord(l.time_code || '', 11)}</p>
                                        <p className="e_d">{l.category}</p>
                                        <p className="e_d">{l.status.toLowerCase()}</p>
                                        <p className="e_d">{l.expense_date}</p>
                                    </div>
                                </Tooltip>
                            </>
                        )
                    })}
                </div>}
            </div>
        </div >
    )
}

export default Expense