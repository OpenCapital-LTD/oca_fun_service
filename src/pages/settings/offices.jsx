import { AddOutlined } from "@mui/icons-material"

const Office = () => {
    return (
        <div className="settings office">
            <div className='header'>
                <h3>Country Office</h3>
                <div className='button' onClick={() => {
                }}>
                    <AddOutlined size={13} />
                    <p>Add Office</p>
                </div>
            </div>
            <p style={{
                fontWeight:'500',
                marginLeft:'5%',
                fontSize:'12px',
                marginTop:'40px',
                marginBottom:'-20px'
            }}>6 Country Offices</p>
            <div className="lister">
                <div className="header_list_head">
                    <p>Office Name</p>
                    <p>Office ID</p>
                    <p>Country</p>
                    <p>Currency</p>
                </div>

                <div className="header_list" onClick={() => {
                    addGHead('edit_user', true)
                }}>
                    <div className="off">OCA Kenya</div>
                    <div className='off'>OCA001</div>
                    <div className='off'>KEN</div>
                    <div className='off'>
                        KES
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Office