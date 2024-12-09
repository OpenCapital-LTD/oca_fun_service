import { useEffect, useState } from "react"
import { useGiraf } from "../../giraff"
import AddExpenseRules from "./addrules"
import useGetApi from "../../hooks/getapi"
import usePushMessage from "../../hooks/pushmessage"
import appConfig from "../../config"

const ExpenseRules = () => {
    const { gHead, addGHead } = useGiraf()
    const { actionRequest } = useGetApi()
    const [loading, setLoading] = useState()
    const [refresh, setRefresh] = useState(false)
    const { messageType, response, pushMessage } = usePushMessage()
    const [rules, setRules] = useState([])



    useEffect(() => {
        setLoading(true)
        actionRequest({ endPoint: `${appConfig.api.BASE_URL}settings/categories` }).then((res) => {
            console.log('categories  ;', res)
            addGHead('categories', res.data)

        }).catch((err) => {
            pushMessage(err.message, 'error')
        })
        actionRequest({ endPoint: `${appConfig.api.AUTH_URL}accounts/roles` }).then((res) => {
            console.log('roles  ;', res)
            let d = res.data?.filter(k=>{
                console.log(k.AppAcls)
                if(k.AppAcls.find(a=>a.App.nav_path == 'el_service')) return true
                return false
            })
            addGHead('roles', d)

        }).catch((err) => {
            pushMessage(err.message, 'error')
        }).finally(() => {
            setLoading(false)
        })
        actionRequest({ endPoint: `${appConfig.api.BASE_URL}settings/rules` }).then((res) => {

            console.log('roles  ;', res)
            setRules(res.data)

        }).catch((err) => {
            pushMessage(err.message, 'error')
        }).finally(() => {
            setLoading(false)
        })
        return addGHead("ref_rle", false)
    }, [gHead.ref_rle])

    return (
        <div className="expense_rules">
            {gHead.addRule && <AddExpenseRules />}
            <div className="header">
                <h3>Expense Rules</h3>
                <div className="button" onClick={() => {
                    addGHead('addRule', true)
                }}>+ Add Rule</div>
            </div>
            <div className="rules">
                <div className="rules_row">
                    <p>Name</p>
                    <p>Category</p>
                    <p>roles</p>
                    <p>limit</p>
                </div>
                {rules.map(l => {
                    return (
                        <div className="rules_row" onClick={() => {
                            addGHead('addRule', true)
                        }}>
                            <p>{l.name}</p>
                            <p>{l.categoriesId}</p>
                            <p>{l.RuleRoles?.map(l=>l?.Roles?.name).join(', ')}</p>
                            <p>{l.limit}</p>
                        </div>
                    )
                })}

            </div>

        </div>
    )
}

export default ExpenseRules