import { CloseOutlined } from '@mui/icons-material'
import '../../assets/styles/view.scss'
import { useGiraf } from '../../giraff'
import { LoadingOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
const View = ({ url }) => {
    const { gHead, addGHead } = useGiraf()
    const [loading, setLoading] = useState(true)
    const [scale, setScale] = useState(1)
    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 5000);
    }, [])
    const handleWheel = (event) => {
        if (event.deltaY < 0) {
            setScale(prevScale => Math.min(prevScale + 0.1, 5)); // Zoom in
        } else {
            setScale(prevScale => Math.max(prevScale - 0.1, 1)); // Zoom out
        }
    };
    return (
        <div className='view' style={{
            transform: `scale(${scale})`,
        }} onWheel={(event) => {
            // alert()
            handleWheel(event)
        }}>
            <div className='main' style={{
                backgroundImage: "url('" + gHead.receipt_url + "')",
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}>
                <CloseOutlined className='close' onClick={() => {
                    addGHead('receipt_view', false)
                }} />
                <div>
                    {loading && <LoadingOutlined style={{
                        marginTop: '20%',
                        marginLeft: '50%',
                        fontSize: '25px'
                    }} />}
                </div>
            </div>
        </div>
    )
}

export default View