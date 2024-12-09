import { LockOutlined, MailOutlined } from "@mui/icons-material"
import MessageBox from "../../components/message"
import Loading from "../../components/loading"
import { useState } from "react"
import usePostApi from "../../hooks/postapi"
import appConfig from "../../config"
import usePushMessage from "../../hooks/pushmessage"
import Cookies from 'js-cookie'
import { useGiraf } from "../../giraff"
import { jwtDecode } from "jwt-decode"
const Login = () => {
    const [loading, setLoading] = useState(false)
    const { messageType, response, pushMessage } = usePushMessage()
    const { actionRequest } = usePostApi()
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const { gHead, addGHead } = useGiraf()

    const actionLogin = () => {
        if (!name || !password) return pushMessage('missing email or password')
        setLoading(true)
        actionRequest({ endPoint: `${appConfig.api.api.BASE_URL}settings/login`, params: { email: name, password } , hd:{
            'x-resource-type':'sign-in'
        }}).then((res) => {
            const token = 'Bearer ' + res.token
            Cookies.set('auth_token', token)
            addGHead('auth_token', token)
            pushMessage('user signed in', 'success')
            addGHead('logedIn', true)
            addGHead('user', jwtDecode(res.token))
        }).catch(err => {
            console.log(err)
            pushMessage(err.message, 'error')
        }).finally(() => {
            setLoading(false)
        })
    }

    return (
        <div className="login">
            {response && <MessageBox type={messageType} txt={response} />}
            {loading && <Loading />}

            <h4>LOG IN</h4>
            <div className="input_holder">
                <label className="input">
                    <MailOutlined className="icon" />
                    <div className="l_input">
                        <p>Email Address</p>
                        <input placeholder="example@opencapital.com" onChange={(e) => {
                            setName(e.target.value)
                        }} />
                    </div>
                </label>
                <label className="input" style={{
                    backgroundColor: 'transparent'
                }}>
                    <LockOutlined className="icon" />
                    <div className="l_input">
                        <p>Password</p>
                        <input placeholder="********" type="password" onChange={(e) => {
                            setPassword(e.target.value)
                        }} />
                    </div>
                </label>
            </div>
            <div className="signin_butt" onClick={() => {
                actionLogin()
            }}> Sign In</div>
            <div style={{
                textAlign: 'center',
                fontSize: '12px'
            }}>or</div>
            <div className="signin_butt google"></div>
        </div>
    )
}

export default Login