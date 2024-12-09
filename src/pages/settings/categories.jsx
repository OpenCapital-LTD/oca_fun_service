import AddCategories from "./addCategory"
import '../../assets/styles/groups.scss'
import { useGiraf } from '../../giraff'
import { CloseOutlined } from "@mui/icons-material"
import { useEffect, useState } from "react"
import { Switch } from "@mui/material"
import Loading from "../../components/loading"
import MessageBox from "../../components/message"
import useGetApi from "../../hooks/getapi"
import usePushMessage from "../../hooks/pushmessage"
import appConfig from "../../config"

const Categories = () => {
    const { gHead, addGHead } = useGiraf()
    const [editCateg, setEditCateg] = useState(false)
    const [enabled, setEnabled] = useState(false)
    const [countries, setCountries] = useState()
    const [categories, setCategories] = useState()
    const { actionRequest } = useGetApi()
    const [parent, setParent] = useState()
    const [code, setCode] = useState()

    const [refresh, setRefresh] = useState(false)
    const { messageType, response, pushMessage } = usePushMessage()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        actionRequest({ endPoint: `${appConfig.api.AUTH_URL}accounts/countries` }).then((res) => {
            console.log(res)
            addGHead('offices', res.data)

        }).catch((err) => {
            pushMessage(err.message, 'error')
        }).finally(() => {
            setLoading(false)
        })
        return addGHead("ref_ctg", false)
    }, [gHead.ref_ctg])

    useEffect(() => {
        setLoading(true)
        actionRequest({ endPoint: `${appConfig.api.BASE_URL}settings/categories` }).then((res) => {
            console.log(res)
            addGHead('categories', res.data)
            setCategories(res.data)

        }).catch((err) => {
            pushMessage(err.message, 'error')
        }).finally(() => {
            setLoading(false)
        })
        return addGHead("ref_ctg", false)
    }, [gHead.ref_ctg])


    return (
        <div className="categories">
            {response && <MessageBox type={messageType} txt={response} />}
            {loading && <Loading />}

            {gHead.addCateg && <AddCategories />}
            <div className="header">
                <h2>Categories</h2>
                <div className="button" onClick={() => {
                    addGHead("addCateg", true)
                    addGHead("editCateg", false)
                }}>
                    <p>Add Category</p>
                </div>
            </div>
            <div className="lister">
                <div className="list_atom head">
                    <p>Name</p>
                    <p>Code</p>
                    <p>Country</p>
                </div>
                {categories && categories.map(l => {
                    return (
                        <div className="list_atom" onClick={() => {
                            setCode(l.code)
                            setParent(l.parent)
                            addGHead("addCateg", true)
                            addGHead("editCateg", true)
                            addGHead("focCateg", l)
                        }}>
                            <p>{l.name}</p>
                            <p>{l.code}</p>
                            <p>{l.office_id}</p>
                        </div>

                    )
                })}

            </div>
            {editCateg && <div className="edit_categ">
                <div className="header">
                    <p>Edit Category</p>
                    <CloseOutlined className="close" onClick={() => {
                        setEditCateg(false)
                    }} />
                </div>
                <div className="options">
                    {/* <div className="opt_atoms"><Switch onClick={() => {
                            setEnabled(t => {
                                if (t) return false
                                return true
                            })
                        }} /> {enabled ? 'disable' : 'enable'}</div> */}
                    <div className="opt_atoms del">Delete</div>
                </div>
                <div className="input_box">
                    <input placeholder="Category Name"></input>
                    <select>
                        <option selected disabled>~ select parent category ~</option>
                        <option>categ 1</option>
                        <option>categ 2</option>
                        <option>...</option>

                    </select>
                    <input placeholder="Category Name"></input>
                </div>
                <div className="edit">Edit</div>

            </div>}
        </div>
    )
}

export default Categories