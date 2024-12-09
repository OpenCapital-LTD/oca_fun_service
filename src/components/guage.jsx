import { Gauge, gaugeClasses } from "@mui/x-charts"
import '../assets/styles/components.scss'
import { Tooltip } from "@mui/material"
import { useEffect, useRef } from "react"
import { TiTick } from "react-icons/ti"
const CGuage = ({ count }) => {
    const gRef = useRef()
    useEffect(() => {
        console.log(gRef.current)
    }, [])
    return (
        <Tooltip title={count + "% Done"}>

            <div className="guage">

                <Gauge width={70} color="green"
                    ref={gRef}
                    sx={(theme) => ({

                        [`& .${gaugeClasses.valueArc}`]: {
                            fill: count > 70 ? 'green' : count > 50 ? 'orange' : count > 25 ? 'orangered' : 'red',
                        }
                    })}
                    className="g" height={70} value={count} text={''} />
            </div>
        </Tooltip>

    )
}

export default CGuage