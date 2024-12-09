import { CategoryOutlined, DeleteOutline, DownloadOutlined, EditOutlined, ReportGmailerrorredOutlined, UploadFileOutlined, WarningAmber } from "@mui/icons-material"
import { useEffect, useState } from "react"
import * as XLSX from "xlsx"
import { saveAs } from 'file-saver'
import { useGiraf } from "../../giraff"
import Filler from "../filler"
import MessageBox from "../../components/message"
import Loading from "../../components/loading"
import usePushMessage from "../../hooks/pushmessage"
import usePostApi from "../../hooks/postapi"
import useGetApi from "../../hooks/getapi"
import { AlertOutlined, LoadingOutlined } from "@ant-design/icons"
import appConfig from "../../config"
import { IoAlertOutline } from "react-icons/io5"
import { Tooltip } from "@mui/material"
import { shortenWord } from "../../BFF/utils"
import template from './template.xlsx';
const BulkUploads = () => {
    const [data, setData] = useState([])
    const { gHead, addGHead } = useGiraf()
    const [fileName, setFileName] = useState('')
    const [firstLoad, setFirstLoad] = useState(false)
    const [loading, setLoading] = useState(false)
    const { actionRequest } = useGetApi()
    const { actionRequest: actionPostRequest } = usePostApi()
    const { messageType, response, pushMessage } = usePushMessage()
    const [alertList, setAlertList] = useState([])
    const [rules, setRules] = useState()

    useEffect(() => {
        addGHead('toolbar', false)
        if (gHead.bulk_data) setFirstLoad(true)
    }, [])

    useEffect(() => {
        actionRequest({ endPoint: `${appConfig.api.BASE_URL}settings/rules` }).then((res) => {
            const rulesArray = []
            console.log('ules : ', res.data)
            let rules = [];
            res.data.forEach(r => {
                let rl = r.RuleRoles
                rl.forEach(l => {
                    console.log(l)
                    let rl = {
                        role_id: l.role,
                        ...r
                    }
                    rules.push(rl)
                })
            })
            const roles = gHead.user.UserRoles.map(r => r.role_id)
            roles.map((l) => {

            })
            setRules(rules)
        })
    }, [])
    const handlFileUpload = (e) => {
        const file = e.target.files[0]
        addGHead('fileName', file?.name)

        const reader = new FileReader()
        reader.readAsArrayBuffer(file);

        reader.onload = (e) => {
            const binaryStr = e.target.result
            const workbook = XLSX.readFile(binaryStr, { type: 'binary' })
            const firstSheetName = workbook.SheetNames[0]
            const worksheet = workbook.Sheets[firstSheetName]
            const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
            const list = sheetData.filter(l => l.length > 0)
            let vlist = []
            const finalList = list.map((l, x) => {
                //month, year, country, 
                l[20] = l[3]

                const category = gHead.categories.find(r => r.code == l[9])
                const country = gHead.countries.find(c => c.name.toLowerCase().includes(l[3]?.toLowerCase()))
                const errors = []

                if (!category) {
                    vlist.push(l[0])
                    l[23] = l[9]
                    l[9] = ''
                    errors.push('category')
                } else {
                    let rule = rules.find(r => r.categoriesId == l[9])
                    l[22] = category.id
                    l[23] = l[9]

                    if (parseInt(l[5]) > parseInt(rule.limit)) {
                        vlist.push(l[0])
                        errors.push('amount')
                    }
                }
                if (!country) {
                    l[3] = ''
                    vlist.push(l[0])
                    errors.push('country')
                } else {
                    l[3] = country.id
                    if (country.name.toLowerCase().includes('kenya') && (!l[12] || !l[13])) {
                        vlist.push(l[0])
                        if (!l[12]) errors.push('pin')
                        if (!l[13]) errors.push('etr')
                    }
                }

                if (!l[1]) errors.push('month')
                if (!l[2]) errors.push('year')
                if (!l[3]) errors.push('country')
                if (!l[4]) errors.push('marchant')
                if (!l[22]) errors.push('category')
                if (!l[8]) errors.push('invoice')
                if (!l[5]) errors.push('amount')
                if (!l[10]) errors.push('code')
                if (!l[11]) errors.push('description')
                if (!l[7]) errors.push('date')
                // if (!l[7]?.includes('/')) errors.push('date')
                l[24] = true
                l[21] = errors
                if (!l[0] || l[0] == '#Index') {
                    vlist = vlist.filter(d => d != l[0])
                }
                return l
            })


            addGHead('bulk_data', finalList)
            addGHead('alertList', [...new Set(vlist)])
            setFirstLoad(true)
        }

    }
    const actionBulkUpload = () => {
        if (gHead.alertList.length > 0) return pushMessage('please make sure all records are correct')
        const record = gHead.bulk_data?.filter((l, x) => x > 1).map(d => {
            return {
                user_id: gHead.user.id,
                report_period: `${d[1]}, ${d[2]}`,
                country: d[3],
                merchant: d[4],
                category: d[22],
                expense_date: d[7]?.toString(),
                amount: d[5]?.toString(),
                invoice: d[8],
                time_code: d[10],
                description: d[11],
                // task_id: d[4],
                pin: d[12],
                etr: d[13],

            }
        })
        setLoading(true)
        actionPostRequest({ endPoint: `${appConfig.api.BASE_URL}expense/bulk`, params: record }).then((res) => {
            console.log(res)
            addGHead('expense_ref', true)
            addGHead('bulk_data', null)
            setFirstLoad(false)
            pushMessage(res.message, 'success')
        }).catch((err) => {
            pushMessage(err.message, 'error')
        }).finally(() => {
            setLoading(false)
        })
        console.log(record)
    }
    return (
        <div className="bulk_upload">
            {response && <MessageBox type={messageType} txt={response} sytles={{
                right: '20px',
                top: '10%',
                height: 'fit-content'
            }} />}
            {loading && <Loading />}


            {gHead.filer && <Filler />}

            {!firstLoad ? <label for="fileIn">
                <div className="bulk_input">
                    <UploadFileOutlined className="uploadfile" />
                    <p>upload file</p>
                    <p className="su">supported: xls, csv</p>
                </div>

            </label> :
                <div className="bulk_lister">
                    <div className="hd">
                        <div className="s_butt" onClick={() => {
                            actionBulkUpload()
                        }}>{loading ? <LoadingOutlined /> : 'Submit'}</div>
                        <div className="s_butt sve">Save</div>
                        <label for="fileIn" className="upload_label">
                            <UploadFileOutlined className="uploadfile icon" />
                            <p>Replace</p>
                        </label>
                        <a href="/src/assets/templates/template.xlsx" style={{
                            textDecoration: 'none',
                            color: 'grey'
                        }} download="template.xlsx" className="d">
                            <DownloadOutlined className="uploadfile icon" />
                            <p>New Template</p>
                        </a>
                        <p>Current : {gHead.fileName} </p>
                        <p>Total : <span style={{
                            fontSize: '10px'
                        }}>KES</span> {gHead.bulk_data?.filter((l, x) => x > 1) != 0 ? gHead.bulk_data?.filter((l, x) => x > 1).reduce((a, b) => parseInt(a) + parseInt(b[5])) : '0'}</p>

                    </div>
                    <div className="lister">
                        <div className="list">
                            <p>Index</p>
                            <p>Month</p>
                            <p>Year</p>
                            <p>Country</p>
                            <p>Merchant</p>
                            <p>Amount</p>
                            <p>Currency</p>
                            <p>Date</p>
                            <p>Invoice</p>
                            <p>Category</p>
                            <p>Time Code</p>
                            <p>Description</p>
                        </div>
                        {gHead.bulk_data?.length > 0 ? gHead.bulk_data.sort((a, b) => a[0] - b[0])?.filter((l, x) => x > 1).map(l => {
                            return (
                                <div className="list" key={l[0]}>
                                    <p
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'flex-start'
                                        }}>{l[0]}
                                        {gHead.alertList?.includes(l[0]) &&
                                            <Tooltip title={'error : ' + l[21].join(', ')}>
                                                <ReportGmailerrorredOutlined style={{
                                                    fontSize: '20px',
                                                    marginLeft: '9%',
                                                    color: 'rgb(209, 112, 0)',
                                                    cursor: 'pointer'
                                                }}
                                                />
                                            </Tooltip>
                                        }
                                    </p>
                                    <p>{l[1]}</p>
                                    <p>{l[2]}</p>
                                    <p>{shortenWord(l[20] || '', 10)}</p>
                                    <p>{l[4]}</p>
                                    <p>{l[5]}</p>
                                    <p>{l[6]}</p>
                                    <p>{l[7]}</p>
                                    <p>{l[8]}</p>
                                    <p>{l[23]}</p>
                                    <p>{l[10]}</p>
                                    <p>{l[11]}</p>
                                    <p className="butts">
                                        <Tooltip title="edit">
                                            <EditOutlined onClick={() => {
                                                // l[3] = gHead.user.office_id
                                                addGHead('focused_expense', l)
                                                addGHead('filer', true)
                                            }} style={{
                                                fontSize: '14px',
                                                border: '1px solid grey',
                                                padding: '3px',
                                                cursor: 'pointer'

                                            }} />
                                        </Tooltip>
                                        <Tooltip title="remove">
                                            <DeleteOutline onClick={() => {
                                                const new_bulk = gHead.bulk_data.filter(d => d[0] != l[0])
                                                console.log('first : ', gHead.alertList)
                                                const new_err = gHead.alertList.filter(d => d != l[0])
                                                console.log('second : ', new_err)
                                                addGHead('bulk_data', new_bulk)
                                                addGHead('alertList', new_err)

                                            }} style={{
                                                fontSize: '15px',
                                                marginLeft: '10px',
                                                border: '1px solid rgb(201, 0, 0)',
                                                padding: '3px',
                                                cursor: 'pointer',
                                                color: 'rgb(201, 0, 0)'

                                            }} />
                                        </Tooltip>
                                    </p>

                                </div>
                            )
                        }) :
                            <div>loading</div>
                        }

                    </div>

                </div>}
            <input id="fileIn" onChange={(e) => {
                console.log('chagned')
                handlFileUpload(e)
            }} type="file" accept=".xlsx" ></input>
            <div className="temp_download">
                <i>
                    <a href={template} style={{
                        textDecoration: 'none',
                        color: 'grey'
                    }} download="template.xlsx">download template</a>
                </i></div>
        </div>
    )
}

export default BulkUploads