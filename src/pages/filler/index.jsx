import { IoCloseOutline, IoCloseSharp } from 'react-icons/io5'
import '../../assets/styles/filler.scss'
import { useGiraf } from '../../giraff'
import { AddCircleOutlined, CloseOutlined, MessageOutlined } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import { getDate } from '../../BFF/utils'
import useGetApi from '../../hooks/getapi'
import usePushMessage from '../../hooks/pushmessage'
import MessageBox from '../../components/message'
import Loading from '../../components/loading'
import appConfig from '../../config'
import { LoadingOutlined } from '@ant-design/icons'
import usePostApi from '../../hooks/postapi'
import View from '../reciepts/view'

const Filler = () => {
    const { gHead, addGHead } = useGiraf()
    const [country, setCountry] = useState(gHead.user?.country)
    const [image, setImage] = useState()
    const [showProject, setShowProject] = useState(false)
    const [code, setCode] = useState('')
    const [category, setCategory] = useState('')
    const [loading, setLoading] = useState(false)
    const { actionRequest } = useGetApi()
    const { actionRequest: actionPostRequest } = usePostApi()
    const { messageType, response, pushMessage } = usePushMessage()
    const [limit, setLimit] = useState()
    const [amount, setAmount] = useState()
    const [focusedCountry, setFocusedCountry] = useState('')
    const [rp_month, setRpMonth] = useState(getDate(new Date()).month)
    const [rp_year, setRpYear] = useState(new Date().getFullYear())
    const [merchant, setMarchant] = useState()
    const [expense_date, setExpenseDate] = useState()
    const [invoice, setInvoice] = useState()
    const [description, setDescription] = useState()
    const [pin, setPin] = useState()
    const [etr, setEtr] = useState()
    const [recordId, setRecordId] = useState()
    const [setReminder, setSetRinder] = useState('op2')
    const [due_date, setDueDate] = useState()
    const [showDatePop, setShowDatePop] = useState(false)
    const [status, setStatus] = useState()
    const [errList, setErrorList] = useState([])
    const [isBulk, setIsBulk] = useState(false)
    const [imageType, setImageType] = useState('')
    const [pImage, setPImage] = useState('')
    const [disabled, setDisabled] = useState(false)
    const [addNote, setAddNote] = useState(false)
    const [note, setNote] = useState('')
    const [forward, setForward] = useState('')
    const [assigned, setAssigned] = useState('')
    const [showMessage, setShowMesage] = useState(false)
    const [showFolder, setShowFolder] = useState(false)
    const [folder, setFolder] = useState('')
    const [folders, setFolders] = useState([])

    useEffect(() => {
        addGHead('toolbar', true)
        setLoading(true)
        let d = gHead.countries?.find(l => l.office_id == gHead.user?.country)
        console.log(d)
        console.log('get values : ', gHead.categories)

        setErrorList(prev => prev.filter(u => u != 'country'))
        setFocusedCountry(d)

        actionRequest({ endPoint: `${appConfig.api.BASE_URL}folders` }).then((res) => {
            setFolders(res.data)
        }).catch((err) => {
            pushMessage(err.message, 'error')

        }).finally(() => {
            setLoading(false)
        })
    }, [])

    const getRules = (id) => {
        console.log('here is teh id',id)
        actionRequest({ endPoint: `${appConfig.api.BASE_URL}settings/rules/category`, params: { id } }).then((res) => {
            const rulesArray = []
            console.log('here just found nothing', res)
            res.data.map(l => {
                l.RuleRoles.map(r => {
                    let d = {
                        id: l.categoriesId,
                        for: r.role,
                        limit: l.limit
                    }
                    rulesArray.push(d)
                })
            })
            const userRoles = [...new Set(gHead.user.UserRoles.map(l => l.role_id))]
            const crules = userRoles.map(l => {
                const d = rulesArray.find(r => r.for == l)
                return d
            })

            const rule = crules.sort((a, b) => a.limit - b.limit)[0]
            setLimit(rule ? parseInt(rule.limit) : 200000)
            console.log('response : ', rule)
        })
    }
    const uploadImage = (e) => {
        const file = e.target.files[0]
        setImageType("." + file.type.split('/')[1])
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
            setPImage(reader.result.split('base64,')[1])
            setImage(reader.result)
            setErrorList(prev => prev.filter(u => u != 'image'))
        }
    }

    const months = () => {
        const d = new Date()
        let d_ = d.getMonth()
        const months = []
        for (let i = 0; i < 4; i++) {
            const newDate = new Date(d.setMonth(d_ - i))
            months.push(newDate)
        }
        return months
    }
    const uploadRecord = () => {
        if (!rp_month || !rp_year || !image || !country || !merchant || !category || !expense_date || !amount || !invoice || !code || !description) {
            const params = {
                rp_month,
                rp_year,
                code,
                country,
                marchant: merchant,
                category,
                date: expense_date,
                amount,
                invoice,
                description,
                pin,
                id: recordId,
                etr,
                image
            }
            const keys = Object.keys(params)
            keys.map(l => {
                if (!params[l]) {
                    setErrorList(prev => {
                        let d = [...prev, l]
                        return d
                    })
                }
            })
            return pushMessage('kindly provide all the fields')
        }
        if (focusedCountry?.name?.toLocaleLowerCase().includes('kenya') && (!pin || !etr)) return pushMessage('you must provide expense etr and pin number')
        setLoading(true)
        const report_period = `${rp_month}, ${rp_year}`
        const time_code = code
        actionPostRequest({
            endPoint: `${appConfig.api.BASE_URL}expense`, params: {
                report_period,
                time_code,
                country,
                merchant,
                category,
                expense_date,
                amount,
                invoice,
                description,
                pin,
                id: recordId,
                etr,
                image: {
                    image: pImage,
                    type: imageType
                }
            }
        }).then((res) => {
            // pushMessage('record expensed successfully', 'success')
            setRpMonth(t => "")
            setRpYear(t => "")
            setCode(t => "")
            setCountry(t => "")
            setMarchant(t => "")
            setCategory(t => "")
            setExpenseDate(t => "")
            setAmount(t => "")
            setInvoice(t => "")
            setDescription(t => "")
            setPin(t => "")
            setEtr(t => "")
            addGHead('filer', false)
            addGHead('expense', true)
            addGHead('expense_ref', true)
            // setTimeout(() => {
            //     addGHead('filer', false)
            // }, 2000);

        }).catch((err) => {
            console.log(err)

            pushMessage(err.message, 'error')
        }).finally(() => {
            setLoading(false)
        })
    }

    const saveDraftRecord = () => {
        setLoading(true)
        const report_period = `${rp_month}, ${rp_year}`
        const time_code = code

        let p = {
            id: recordId,
            report_period,
            time_code,
            country,
            merchant,
            category,
            expense_date,
            amount,
            invoice,
            description,
            pin,
            etr,
            status: 'DRAFT'
        }
        console.log(p)
        let curr_value = 0
        let p_keys = Object.keys(p)

        p_keys.forEach(l => {
            if (p[l]) curr_value++
        })
        let pv = p
        let { category: cat, ...p1 } = p
        let { ntry, ...p2 } = p1
        if (!p.category) pv = p1
        actionPostRequest({
            endPoint: `${appConfig.api.BASE_URL}expense/draft`, params: {
                curr_value,
                value: p_keys.length,
                due_date,
                ...pv
            }
        }).then((res) => {
            pushMessage('draft record logged successfully', 'success')
            addGHead('expense_ref', true)
            setRecordId(res.data.id)

        }).catch((err) => {
            console.log(err)
            pushMessage(err.message, 'error')
        }).finally(() => {
            setLoading(false)
        })
    }

    useEffect(() => {
        const d = gHead.focused_expense
        if (!d) return
        setRpMonth(d[1])
        setRpYear(d[2])
        setCode(d[10])
        setCountry(d[3])
        setMarchant(d[4])
        setCategory(d[9])
        setExpenseDate(d[7])
        setAmount(d[5])
        setInvoice(d[8])
        setDescription(d[11])
        setPin(d[12])
        setEtr(d[13])
        setRecordId(d[0])
        setStatus(d[6])
        setErrorList(d[21] || [])
        setIsBulk(d[24] || false)
        setImage(d[14])
        setNote(d[15])
        setDisabled(d[25])
        console.log(d[14])
        if (d[3]) {
            console.log('one passed : ',d[3])
            let c = gHead.countries?.find(l => l.office_id == d[3])
            console.log("here is here country : ",gHead.countries)
            setFocusedCountry(c)
        }
        if (d[9]) {
            getRules(d[9])
        }
        console.log('here are projects ; ', gHead.projects)
    }, [])

    const approveExpense = () => {
        setLoading(true)
        actionPostRequest({
            endPoint: `${appConfig.api.BASE_URL}expense/status`, params: {
                status: 'APPROVED',
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
    const rejectExpense = () => {
        setLoading(true)
        if (!note) return pushMessage('you need to add a note')
        actionPostRequest({
            endPoint: `${appConfig.api.BASE_URL}expense/status`, params: {
                status: 'REJECTED',
                id: recordId,
                note
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
    const disburseExpense = () => {
        setLoading(true)
        actionPostRequest({
            endPoint: `${appConfig.api.BASE_URL}expense/status`, params: {
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
    const moveToFolder = () => {
        if (!folder) return pushMessage('you must pick a folder')
        setLoading(true)

        actionPostRequest({
            endPoint: `${appConfig.api.BASE_URL}folders/item`, params: {
                expenseId: recordId,
                folderId: folder
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
        <div className="filler">
            {gHead.receipt_view && <View />}

            {showDatePop && <div className='due_box'>
                <div className='holder'>
                    <p style={{
                        marginTop: '20px'
                    }}>Do you want to set a reminder to complete this draft?</p>
                    <div className='question'>
                        <label>
                            <input value={'op1'} checked={setReminder == 'op1'} type='radio' onChange={() => {
                                setSetRinder('op1')
                            }} />
                            <p>Yes</p>
                        </label>
                        <label>
                            <input value={'op2'} checked={setReminder == 'op2'} type='radio' onChange={() => {
                                setSetRinder('op2')
                                setDueDate(t => '')
                            }} />
                            <p>No</p>
                        </label>
                    </div>
                    {setReminder == 'op1' &&
                        <div className='date'>
                            <label>
                                <p>Date for Reminder</p>
                                <input type='date' onChange={(e) => {
                                    setDueDate(e.target.value)
                                }} />
                            </label>

                        </div>}
                    <div className='butt' onClick={() => {
                        if (loading) return
                        const now = new Date()
                        const date = new Date(due_date)
                        if (now.getTime() > date.getTime()) return pushMessage('please pick a valid date')
                        if (setReminder == 'op1' && !due_date) return pushMessage('please pick a valid date')
                        saveDraftRecord()
                        setShowDatePop(false)
                    }}>{loading ? <LoadingOutlined /> : 'Save'}</div>


                </div>
            </div>}
            {addNote && <div className='due_box'>
                <div className='holder'>
                    <p style={{
                        marginTop: '20px'
                    }}><CloseOutlined className='close' onClick={() => {
                        setAddNote(false)
                    }} style={{
                        border: '1px solid grey'
                    }} /></p>
                    <div className='date'>
                        <label>
                            <p>Add Note</p>
                            <textarea onChange={(e) => {
                                setNote(e.target.value)
                            }} style={{
                                width: '100%',
                                height: '100px',
                                outline: 'none'
                            }} />
                        </label>

                    </div>
                    <div className='butt' onClick={() => {
                        if (loading) return
                        rejectExpense()

                    }}>{loading ? <LoadingOutlined /> : 'Submit'}</div>


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
                        const now = new Date()

                    }}>{loading ? <LoadingOutlined /> : 'Save'}</div>


                </div>
            </div>}
            {showFolder && <div className='due_box'>
                <div className='holder'>
                    <p style={{
                        marginTop: '20px'
                    }}><CloseOutlined className='close' onClick={() => {
                        setShowFolder(false)
                    }} style={{
                        border: '1px solid grey'
                    }} /></p>
                    <div className='date'>
                        <label>
                            <p>Add To Folder</p>
                            <select style={{
                                width: '100%',
                                outline: 'none',
                                height: '35px',
                                marginTop: '5px'
                            }}
                                onChange={(e) => {
                                    setFolder(e.target.value)
                                }}
                            >
                                <option>~ select folder ~</option>
                                {folders.map(l => {
                                    return (
                                        <option value={l.id}>{l.country}, {l.name}</option>
                                    )
                                })}
                            </select>
                        </label>

                    </div>
                    <div className='butt' onClick={() => {
                        if (loading) return
                        moveToFolder()

                    }}>{loading ? <LoadingOutlined /> : 'Save'}</div>


                </div>
            </div>}
            {response && <MessageBox type={messageType} txt={response} sytles={{
                right: '20px',
                top: '10%',
                height: 'fit-content'
            }} />}
            {loading && <Loading />}

            <div className='field_holder'>
                <div className='header'>
                    <div className='controls'>
                        {!disabled && <p>Add Expense</p>}
                        {note && <><MessageOutlined className='msg' onClick={() => {
                            setShowMesage(true)
                        }} />
                            <p className='al'></p>
                            {showMessage && <div className='messageBox'>
                                <CloseOutlined className='close' onClick={() => {
                                    setShowMesage(false)
                                }} />
                                <h4>Note</h4>
                                <p>{note} </p>
                            </div>}
                        </>
                        }
                    </div>
                    <IoCloseOutline size={23} className='close' onClick={() => {
                        addGHead('filer', false)
                    }} />
                </div>
                <div className='field_container'>
                    <div className='input_container'>

                        <div className='input_atom '>
                            <p className='atom_label'>Reporting Period</p>
                            <div className='atom_splitter input_box'>

                                <select disabled={true} className='atom_input date_select' style={{
                                    border: errList.includes('month') && '1px solid orangered'
                                }} onChange={(e) => {
                                    setErrorList(prev => prev.filter(u => u != 'month'))
                                    setRpMonth(e.target.value)
                                }} placeholder='placeholder' value={rp_month}>
                                    <option value="" selected disabled>~ mnth ~</option>
                                    {months().map(l => {
                                        return (
                                            <option value={getDate(l).month}>{getDate(l).month}</option>
                                        )
                                    })}
                                </select>
                                <select disabled={true} className='atom_input date_select' style={{
                                    border: errList.includes('year') && '1px solid orangered'
                                }} onChange={(e) => {
                                    setErrorList(prev => prev.filter(u => u != 'year'))
                                    setRpYear(e.target.value)
                                }} placeholder='placeholder' value={rp_year}>
                                    <option value="" disabled selected>~ year ~</option>
                                    <option value={(new Date()).getFullYear()}>{(new Date()).getFullYear()}</option>
                                    <option value={(new Date()).getFullYear() - 1}>{(new Date()).getFullYear() - 1}</option>
                                </select>
                            </div>
                        </div>
                        <div className='input_atom '>
                            <p className='atom_label'>Country</p>
                            <select disabled={true} className='atom_input select_text' style={{
                                border: errList.includes('country') && '1px solid orangered'
                            }} placeholder='placeholder' onChange={(e) => {
                                const value = e.target.value
                                setCountry(value)
                                console.log(gHead.categories)
                                let d = gHead.countries.find(l => l.id == value)
                                console.log(d)

                                setErrorList(prev => prev.filter(u => u != 'country'))
                                setFocusedCountry(d)
                            }} value={country}>
                                <option value={""} selected disabled>~ country ~</option>
                                {gHead.countries?.map(l => {

                                    return (
                                        <option value={l.id} key={l.id}>{l.name}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className='input_atom '>
                            <p className='atom_label'>Merchant</p>
                            <input disabled={disabled} className='atom_input input_box' style={{
                                border: errList.includes('marchant') && '1px solid orangered'
                            }} value={merchant} onChange={(e) => {
                                setErrorList(prev => prev.filter(u => u != 'marchant'))
                                setMarchant(e.target.value)
                            }} placeholder='Java' />

                        </div>
                        <div className='input_atom ' >
                            <p className='atom_label'>Category</p>
                            <select disabled={disabled} className='atom_input select_text' style={{
                                border: errList.includes('category') && '1px solid orangered'
                            }} value={category} placeholder='placeholder' onChange={(e) => {
                                setCategory(e.target.value)
                                setErrorList(prev => prev.filter(u => u != 'category'))
                                console.log('get values : ', gHead.categories)
                                getRules(e.target.value)
                            }}>
                                <option value={''} selected disabled>~ category ~</option>
                                {/* create categories */}
                                {gHead.categories?.filter(l => l.office_id == focusedCountry?.office_id).map(l => {
                                    return (
                                        <option value={l.code} key={l.id}>{l.tag}</option>
                                    )
                                })}
                            </select>
                        </div>

                        <div className='input_atom '>
                            <p className='atom_label'>Expense Date</p>
                            <input disabled={disabled} className='atom_input input_box ' value={expense_date} onChange={(e) => {
                                const now = new Date()
                                const s = new Date(e.target.value)
                                if (s > now) return pushMessage('expense too early')
                                console.log(100 * 60 * 60 * 24 * 14)
                                console.log(now.getTime() - s.getTime())

                                if (now.getMonth() - s.getMonth() > 2) return pushMessage('expense must not be more than 3 months old')
                                setErrorList(prev => prev.filter(u => u != 'date'))
                                setExpenseDate(e.target.value)
                            }} style={{
                                height: '40px',
                                border: errList.includes('date') && '1px solid orangered'
                            }} placeholder='placeholder' type='date' />
                        </div>

                        <div className='input_atom '>
                            <p className='atom_label'>Amount</p>
                            <div className='atom_splitter input_box'>
                                <input className='atom_input' type='number' style={{
                                    width: '100%',
                                    border: errList.includes('amount') && '1px solid orangered'

                                }} placeholder='00.00' value={amount} disabled={!limit || disabled} onChange={(e) => {
                                    const a = e.target.value
                                    if (!limit) return pushMessage("please pick a category")
                                    if (a > limit) return pushMessage('for this category your limit is : ' + limit)
                                    setErrorList(prev => prev.filter(u => u != 'amount'))
                                    setAmount(a)
                                }} />
                                <select disabled={disabled} className='atom_input cash_select' placeholder='placeholder'>
                                    <option value="">KES</option>
                                    <option>...</option>
                                </select>
                            </div>
                        </div>
                        <p className='equivalent'><i>equivalent : 00:00 {focusedCountry?.currency || 'USD'}</i></p>

                        <br />
                        <br />

                        <div className='input_atom '>
                            <p className='atom_label'>Invoice Number</p>
                            <input disabled={disabled} className='atom_input input_box' style={{
                                border: errList.includes('invoice') && '1px solid orangered'
                            }} onChange={(e) => {
                                setErrorList(prev => prev.filter(u => u != 'invoice'))
                                setInvoice(e.target.value)
                            }} placeholder='P00' value={invoice} />

                        </div>

                        <div className='input_atom pr' >
                            <p className='atom_label'>Time Code</p>
                            <input disabled={disabled} className='atom_input input_box' style={{
                                border: errList.includes('code') && '1px solid orangered'
                            }} onFocus={() => {
                                setShowProject(true)
                            }} value={code} onChange={(e) => {
                                setCode(e.target.value)
                                setShowProject(true)
                            }} placeholder='Admin-00' />
                            {showProject && <div className='t_code' >
                                {gHead.projects?.filter(l => l.project_name.toLowerCase().includes(code?.toLowerCase())).map(l => {
                                    console.log()
                                    return (
                                        <p onClick={() => {
                                            setCode(`[${l.project_name.split('[')[1]}`)
                                            setErrorList(prev => prev.filter(u => u != 'code'))
                                            setShowProject(false)
                                        }} value={l.id} key={l.id}>[{l.project_name.split('[')[1]}</p>
                                    )
                                })}
                                <p onClick={() => {
                                    setErrorList(prev => prev.filter(u => u != 'code'))
                                    setShowProject(false)
                                }}>{code ? code : 'start typing...'}</p>
                            </div>}
                            <div className='drop_select'>
                                <p>Admin-00</p>
                                <p>Admin-00</p>
                                <p>Admin-00</p>
                                <p>Admin-00</p>
                                <p>...</p>
                            </div>
                        </div>
                        {focusedCountry?.name?.toLocaleLowerCase().includes('kenya') ?
                            <>
                                <div className='input_atom '>
                                    {/* based on country */}
                                    <p className='atom_label'>Pin Number</p>
                                    <input disabled={disabled} className='atom_input input_box' style={{
                                        border: errList.includes('pin') && '1px solid orangered'
                                    }} value={pin} onChange={(e) => {
                                        setErrorList(prev => prev.filter(u => u != 'pin'))
                                        setPin(e.target.value)
                                    }} placeholder='P012' />

                                </div>
                                <div className='input_atom '>
                                    <p className='atom_label'>ETR Number</p>
                                    <input disabled={disabled} className='atom_input input_box' style={{
                                        border: errList.includes('etr') && '1px solid orangered'
                                    }} value={etr} onChange={(e) => {
                                        setErrorList(prev => prev.filter(u => u != 'etr'))
                                        setEtr(e.target.value)
                                    }} placeholder='P012' />

                                </div>
                            </>
                            : <></>
                        }
                        <div className='input_atom '>
                            <p className='atom_label '>Expense Description</p>
                            <textarea disabled={disabled} value={description} style={{
                                border: errList.includes('description') && '1px solid orangered',
                                backgroundColor:'transparent',
                                color:'black'
                            }} onChange={(e) => {
                                setErrorList(prev => prev.filter(u => u != 'description'))

                                setDescription(e.target.value)
                            }} className='atom_input input_box text_area' placeholder='brief description' />

                        </div>
                    </div>
                    <div className='upload_container'>
                        <label htmlFor="rect">
                            <div className='file_holder' style={{
                                backgroundImage: "url('" + image + "')",
                                backgroundSize: 'contain',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                                border: errList.includes('image') && '1px solid orangered'

                            }}
                                onClick={() => {
                                    if (!disabled) return
                                    addGHead('receipt_view', true)
                                    addGHead('receipt_url', image)
                                }}
                            >
                                {!disabled && <> <AddCircleOutlined />
                                    <p>Upload Receipt</p>
                                    <p>supported : png, jpeg, pdf</p>
                                </>}
                            </div>
                        </label>
                        <input disabled={disabled} type="file" id='rect' sytle={{
                            display: "none"
                        }}
                            onChange={(e) => {
                                uploadImage(e)
                            }}
                        />
                    </div>
                </div>
                {((!status || status == 'DRAFT') && !isBulk) && <div className='footer'>
                    <div className='button submit' onClick={() => {
                        if (!loading) uploadRecord()
                    }}>{loading ? <LoadingOutlined /> : 'Submit'}</div>
                    <div className='button save' onClick={() => {
                        setShowDatePop(true)
                    }}
                    >Save</div>
                    <div className='button cancel' onClick={() => {
                        addGHead('filer', false)
                    }}>Close</div>
                </div>}
                {((disabled) && !isBulk) && <div className='footer'>
                    <div className='button submit' onClick={() => {
                        if (!loading) approveExpense()
                    }}>{loading ? <LoadingOutlined /> : 'Approve'}</div>

                    <div className='button submit' onClick={() => {
                        if (!loading) disburseExpense()
                    }}>{loading ? <LoadingOutlined /> : 'Reimburse'}</div>
                    <div className='button save' onClick={() => {
                        setForward(true)
                    }}
                    >Forward</div>
                    <div className='button save' onClick={() => {
                        setShowFolder(true)
                    }}
                    >Folder</div>
                    <div className='button save' onClick={() => {
                        setAddNote(true)
                    }}
                    >Reject</div>
                    <div className='button cancel' onClick={() => {
                        addGHead('filer', false)
                    }}>Close</div>
                </div>}
                {(isBulk) && <div className='footer'>
                    <div className='button save' onClick={() => {
                        if (loading) return
                        //get original list
                        const list = gHead.focused_expense
                        const cat = gHead.categories.find(cat => cat.code = category)
                        list[1] = rp_month
                        list[2] = rp_year
                        list[3] = focusedCountry.id
                        list[20] = focusedCountry.name
                        list[4] = merchant
                        list[22] = category
                        list[9] = category
                        list[7] = expense_date
                        list[5] = amount
                        list[8] = invoice
                        list[10] = code
                        list[11] = description
                        list[12] = pin
                        list[13] = etr
                        list[21] = errList
                        list[23] = cat?.code

                        console.log('first : ', gHead.bulk_data)
                        const new_bulk = gHead.bulk_data.filter(n => n[0] != recordId)
                        console.log('second : ', new_bulk)
                        new_bulk.push(list)
                        if (errList.length == 0) {
                            const alist = gHead.alertList.filter(n => n != recordId)
                            addGHead('alertList', alist)
                        }
                        addGHead('bulk_data', new_bulk)
                        addGHead('filer', false)

                    }}>{loading ? <LoadingOutlined /> : 'Save'}</div>

                </div>}
            </div>
        </div>
    )
}

export default Filler