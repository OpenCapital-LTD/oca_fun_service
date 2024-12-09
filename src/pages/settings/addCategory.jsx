import { CloseOutlined } from '@mui/icons-material'
import '../../assets/styles/users.scss'
import '../../assets/styles/categories.scss'
import { useGiraf } from '../../giraff'
import { useEffect, useState } from 'react'
import usePostApi from '../../hooks/postapi'
import appConfig from '../../config'
import MessageBox from '../../components/message'
import Loading from '../../components/loading'
import useGetApi from '../../hooks/getapi'
import usePushMessage from '../../hooks/pushmessage'
const AddCategories = () => {
    const { gHead, addGHead } = useGiraf()
    const [isSub, setIsSub] = useState(false)
    const [name, setName] = useState('')
    const [office, setOffice] = useState('')
    const [parent, setParent] = useState('')
    const { actionRequest } = usePostApi()
    const [code, setCode] = useState()

    const [countries, setCountries] = useState()
    const { actionRequest: actionGetRequest } = useGetApi()

    const { messageType, response, pushMessage } = usePushMessage()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (gHead.editCateg == true) {
            setName(gHead.focCateg.name)
            setOffice(gHead.focCateg.office_id)
            setParent(gHead.focCateg.parent)
            setCode(gHead.focCateg.code)
        }
    }, [])



    const createCategory = () => {
        if (!name || !office) return pushMessage("missing name or office")
        setLoading(true)

        actionRequest({
            endPoint: `${appConfig.api.BASE_URL}settings/categories`, params: {
                name,
                parent,
                isSub,
                code,
                edit: gHead.editCateg && gHead.editCateg,
                office_id: office
            }
        }).then((res) => {
            console.log(res)
            pushMessage(res.message, 'success')
            addGHead('addCateg', false)
            addGHead("ref_ctg", true)

        }).catch((err) => {
            console.log(err)
            pushMessage(err.message, 'error')
        }).finally(() => {
            setLoading(false)

        })
    }
    return (
        <div className="add_user_cont add_categories">
            {response && <MessageBox type={messageType} txt={response} />}
            {loading && <Loading />}

            <div className="form">
                <h2>Add Category</h2>
                <CloseOutlined className='close' onClick={() => {
                    addGHead('addCateg', false)
                }} />
                <div className='fields'>

                    <div className='holder'>
                        <p>Category Name</p>
                        <input placeholder='category name' value={name} onChange={(e) => {
                            setName(e.target.value)
                        }} />
                    </div>
                    <div className='holder'>
                        <p>Category Code</p>
                        <input placeholder='OCA_0001' disabled={gHead.editCateg} value={code} onChange={(e) => {
                            setCode(e.target.value)
                        }} />
                    </div>
                    <div className='holder sub'>
                        <input placeholder='office name' onChange={() => {
                            setIsSub(t => {
                                if (t) return false
                                if (!t) return true
                            })
                        }} type='checkbox' />
                        <p>is a sub-category</p>
                    </div>

                    {isSub && <div className='holder'>
                        <p>Parent Category</p>
                        <select onChange={(e) => {
                            setParent(e.target.value)
                        }}>
                            <option selected disabled>~ select parent category ~</option>
                            {gHead.categories && gHead.categories.map(l => {
                                return (
                                    <option value={l.id}>{l.name} - {l.code}</option>

                                )
                            })}

                        </select>
                    </div>}


                    <div className='holder'>
                        <p>Country Office</p>
                        <select onChange={(e) => {
                            setOffice(e.target.value)
                        }}>
                            <option selected disabled>~ select parent office ~</option>
                            {gHead.offices && gHead.offices.map(l => {
                                return (
                                    <option>{l.office_id}</option>
                                )
                            })}

                        </select>
                    </div>

                    <div className='buttons'>
                        <div className='sub' onClick={() => {
                            addGHead('addCateg', false)
                        }}>Cancel</div>
                        <div className='sub' onClick={() => {
                            createCategory()
                        }}>Save</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddCategories