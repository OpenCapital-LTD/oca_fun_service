import { AddOutlined, CloseOutlined, DeleteOutline, Download, DownloadOutlined, FolderOutlined } from '@mui/icons-material'
import '../../assets/styles/folders.scss'
import { useEffect, useState } from 'react'
import MessageBox from '../../components/message'
import Loading from '../../components/loading'
import useGetApi from '../../hooks/getapi'
import usePostApi from '../../hooks/postapi'
import usePushMessage from '../../hooks/pushmessage'
import appConfig from '../../config'
import { getDate, shortenWord } from '../../BFF/utils'
import { useGiraf } from '../../giraff'
import { Tooltip } from '@mui/material'
import Filler from '../filler'
import { LoadingOutlined } from '@ant-design/icons'

const Folders = () => {
    const { gHead, addGHead } = useGiraf()
    const [folders, setFolders] = useState([])
    const [loading, setLoading] = useState(false)
    const { actionRequest } = useGetApi()
    const { actionRequest: actionPostRequest } = usePostApi()
    const { messageType, response, pushMessage } = usePushMessage()
    const [country, setCountry] = useState(gHead.countries[0]?.office_id)
    const [folderItems, setFolderItems] = useState([])
    const [folderName, setFolderName] = useState('')
    const [showContextMenu, setContextMenu] = useState('')
    const [itemMenuId, setItemMenuId] = useState('')
    const [menuPosition, setMenuPosition] = useState('')
    const [month, setMonth] = useState(getDate((new Date())).month)
    const [year, setYear] = useState('2024')
    const [folder, setFolder] = useState('')
    const [forward, setForward] = useState()
    const [assigned, setAssigned] = useState()

    useEffect(() => {
        setLoading(true)
        actionRequest({ endPoint: `${appConfig.api.BASE_URL}folders` }).then((res) => {
            setFolders(res.data)
            console.log(res.data)
        }).catch((err) => {
            pushMessage(err.message, 'error')

        }).finally(() => {
            setLoading(false)
        })
        return addGHead('refresh_folders', null)
    }, [gHead.refresh_folders])


    const handleContextMenu = (e, id) => {
        e.preventDefault()
        setItemMenuId(id)
        setMenuPosition({
            x: e.clientX,
            y: e.clientY
        })
    }
    const createFolder = () => {
        setLoading(true)
        const now = new Date()
        const month = getDate(now).month
        actionPostRequest({
            endPoint: `${appConfig.api.BASE_URL}folders`, params: {
                month,
                country
            }
        }).then((res) => {
            pushMessage(res.message, 'success')
            addGHead('refresh_folders', true)
        }).catch((res) => {
            pushMessage(res.message, 'error')
        }).finally(() => {
            setLoading(false)
        })
    }

    const assignApprover = () => {
        setLoading(true)
        actionPostRequest({
            endPoint: `${appConfig.api.BASE_URL}folders/forward`, params: {
                id: folder.id,
                assigned
            }
        }).then((res) => {
            pushMessage(res.message, 'success')
            setItemMenuId(t => '')
            setAssigned(t => '')
            setForward(false)
            addGHead('refresh_folders', true)
            addGHead('expense_ref', true)
            addGHead('folder_pane', false)
        }).catch((res) => {
            pushMessage(res.message, 'error')
        }).finally(() => {
            setLoading(false)
        })
    }

    const deleteFolder = () => {
        setLoading(true)
        actionPostRequest({
            endPoint: `${appConfig.api.BASE_URL}folders/delete`, params: {
                id: itemMenuId
            }
        }).then((res) => {
            pushMessage(res.message, 'success')
            setItemMenuId(t => '')
            addGHead('refresh_folders', true)
            addGHead('expense_ref', true)
        }).catch((res) => {
            pushMessage(res.message, 'error')
        }).finally(() => {
            setLoading(false)
        })
    }

    const removeItemFromFolder = (id) => {
        setLoading(true)
        actionPostRequest({
            endPoint: `${appConfig.api.BASE_URL}folders/item/remove`, params: {
                id
            }
        }).then((res) => {
            pushMessage(res.message, 'success')
            const rem = folderItems.filter(l => l.id != id)
            setFolderItems(rem)
            addGHead('refresh_folders', true)
            addGHead('expense_ref', true)
        }).catch((res) => {
            pushMessage(res.message, 'error')
        }).finally(() => {
            setLoading(false)
        })
    }

    const approveExpense = () => {
        setLoading(true)
        console.log(folderItems)
        const records = folderItems.map(l => {
            return {
                id: l.Expense.id,
                status: 'APPROVED'
            }
        })

        actionPostRequest({
            endPoint: `${appConfig.api.BASE_URL}expense/status/bulk`, params: {
                records
            }
        }).then((res) => {
            pushMessage(res.message, 'success')
            addGHead('expense_ref', true)
            addGHead('refresh_folders', true)
            addGHead('folder_pane', false)

        }).catch((err) => {
            pushMessage(err.message, 'error')
        }).finally(() => {
            setLoading(false)
        })
        let d = new Date()
        d.getTime()

    }

    const disburseExpense = () => {
        setLoading(true)
        actionPostRequest({
            endPoint: `${appConfig.api.BASE_URL}expense/status/bulk`, params: {
                status: 'REIMBURSED',
                id: recordId
            }
        }).then((res) => {
            pushMessage(res.message, 'success')

            addGHead('filer', false)
            addGHead('expense_ref', true)
        }).catch((err) => {
            pushMessage(err.message, 'error')
        }).finally(() => {
            setLoading(false)
        })

    }
    return (
        <div className="folders">
            {gHead.filer && <Filler />}

            {response && <MessageBox type={messageType} txt={response} sytles={{
                right: '20px',
                top: '10%',
                height: 'fit-content'
            }} />}
            {loading && <Loading />}
            {gHead.folder_pane && <div className='folder_list'>
                <div className='main'>
                    <div className='header'>
                        <p>{country}, {folderName}</p>
                        <div className='button_d' style={{
                            borderColor: folder.status != 'PENDING' && 'grey',
                            color: folder.status != 'PENDING' && 'grey',
                            backgroundColor: folder.status != 'PENDING' && 'transparent',
                            cursor: folder.status != 'PENDING' && 'default',

                        }} onClick={() => {
                            if (loading || folder.status != 'PENDING') return
                            setForward(true)
                        }}>Forward</div>
                        <div className='button_d' style={{
                            borderColor: folder.status == 'APPROVED' || folder.status != 'FORWARDED' && 'grey',
                            color: folder.status == 'APPROVED' || folder.status != 'FORWARDED' && 'grey',
                            backgroundColor: folder.status == 'APPROVED' || folder.status != 'FORWARDED' && 'transparent',
                            cursor: folder.status == 'APPROVED' || folder.status != 'FORWARDED' && 'default',

                        }} onDoubleClick={() => {
                            if (loading || folder.status != 'FORWARDED') return
                            approveExpense()
                        }}>Approve All</div>
                        <div className='button_d' style={{
                            borderColor: folder.status == 'REIMBURSED' || folder.status != 'APPROVED' && 'grey',
                            color: folder.status == 'REIMBURSED' || folder.status != 'APPROVED' && 'grey',
                            backgroundColor: folder.status == 'REIMBURSED' || folder.status != 'APPROVED' && 'transparent',
                            cursor: folder.status == 'REIMBURSED' || folder.status != 'APPROVED' && 'default',

                        }}>Reimburse All</div>
                        <DownloadOutlined style={{
                            fontSize: '20px',
                            border: '1px solid grey',
                            padding: '5px',
                            cursor: 'pointer'
                        }} />
                        <CloseOutlined className='close' style={{
                            marginLeft: '10%'
                        }} onClick={() => {
                            addGHead('folder_pane', false)
                        }} />
                    </div>
                    <div className='body'>
                        < div className="e_lister">
                            <div className="e_row e_header" style={{
                                marginLeft: '2%',
                                width: '66%',
                            }}>
                                <p className="e_ind"></p>
                                <p className="e_d">Amount</p>
                                <p className="e_d">Invoice</p>
                                <p className="e_d">Time Code</p>
                                <p className="e_d">Category</p>
                                <p className="e_d">Status</p>
                                <p className="e_d">Date</p>
                            </div>
                            {folderItems.map(l => {
                                l = {
                                    ...l,
                                    ...l.Expense,
                                    item_id: l.id
                                }
                                return (
                                    <div className='over_d'>
                                        <Tooltip title={l.status.toLowerCase()}>
                                            <div className="e_row" key={l.id} onClick={() => {
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
                                                    l.file_url
                                                ];
                                                d[25] = true
                                                addGHead('focused_expense', d)
                                                addGHead('filer', true)
                                            }}>
                                                <p className="e_ind" style={{
                                                }}></p>
                                                <p className="e_d"><span style={{
                                                    fontSize: '10px'
                                                }}>KES</span> {l.amount || '0'}</p>
                                                <p className="e_d">{l.invoice}</p>
                                                <p className="e_d">{shortenWord(l.time_code || '', 20)}</p>
                                                <p className="e_d">{l.category}</p>
                                                <p className="e_d">{l.status.toLowerCase()}</p>
                                                <p className="e_d">{l.expense_date}</p>

                                            </div>

                                        </Tooltip>
                                        <p className="p" style={{
                                            // marginLeft: '5%',

                                        }}>
                                            <DeleteOutline onClick={() => {
                                                if (loading || folder.status == 'APPROVED') return
                                                console.log(l)
                                                removeItemFromFolder(l.item_id)

                                            }} style={{
                                                fontSize: '15px',
                                                border: '1px solid rgb(201, 0, 0)',
                                                padding: '3px',
                                                cursor: 'pointer',
                                                color: 'rgb(201, 0, 0)'

                                            }} />
                                        </p>

                                    </div>
                                )
                            })}
                        </div>

                    </div>

                </div>
            </div>}
            {forward && <div className='due_box'>
                <div className='holder'>
                    <p style={{
                        marginTop: '20px'
                    }}><CloseOutlined className='close' onClick={() => {
                        setForward(false)
                    }} style={{
                        border: '1px solid grey'
                    }} /></p>
                    <div className='date'>
                        <label>
                            <p>Assign Approver</p>
                            <select style={{
                                width: '100%',
                                outline: 'none',
                                height: '35px',
                                marginTop: '5px'
                            }}
                                onChange={(e) => {
                                    setAssigned(e.target.value)
                                }}
                            >
                                <option>~ select approver ~</option>
                                {gHead.approvers && gHead.approvers.map(l => {
                                    return (
                                        <option value={l.id}>{l.firstName} {l.lastName}</option>
                                    )
                                })}
                            </select>
                        </label>

                    </div>
                    <div className='butt' onClick={() => {
                        if (loading) return
                        assignApprover()

                    }}>{loading ? <LoadingOutlined /> : 'Save'}</div>


                </div>
            </div>}
            <select value={year} className='s_country m' onChange={(e) => {
                setYear(e.target.value)
            }}>
                <option>~ year ~</option>
                {['2024', '2025']?.map((l) => {
                    return (
                        <option value={l}>{l} </option>
                    )
                })}
            </select>
            <select value={month} className='s_country m' onChange={(e) => {
                setMonth(e.target.value)
            }}>
                <option>~ month ~</option>
                {[
                    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                ]?.map((l) => {
                    return (
                        <option value={l}>{l} </option>
                    )
                })}
            </select>
            <select value={country} className='s_country' onChange={(e) => {
                setCountry(e.target.value)
            }}>
                <option>~ select country ~</option>
                {gHead.countries?.map((l) => {
                    return (
                        <option value={l.office_id}>{l.name} </option>
                    )
                })}
            </select>

            <div className='main'>
                <div className='folder create_folder' onClick={() => {
                    createFolder()
                }}>
                    <AddOutlined className='icon' />
                    <p>Generate</p>
                </div>
                {folders.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()).map((l) => {
                    return (
                        <div className='folder' onClick={() => {
                            if (itemMenuId) return setItemMenuId(t => '')
                            setFolderName(l.month + " " + l.year)
                            setFolder(l)
                            setFolderItems(l.FolderItems)
                            addGHead('folder_pane', true)

                        }}
                            onContextMenu={(e) => {
                                handleContextMenu(e, l.id)
                            }}
                        >
                            <p>{l.name}</p>
                            <FolderOutlined className='icon' />
                            {itemMenuId == l.id && <div style={{
                                top: menuPosition.y,
                                left: `${menuPosition.x - 10}px`
                            }} className="hover_menu">
                                <p onClick={() => {
                                    setItemMenuId(t => '')
                                    addGHead('refresh_folders', true)
                                }}>refresh</p>
                                <p>forward</p>
                                <p onClick={() => {
                                    deleteFolder()
                                }}>delete</p>
                            </div>}
                        </div>
                    )
                })}
            </div>

        </div>
    )

}

export default Folders