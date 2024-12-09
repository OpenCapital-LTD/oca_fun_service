import { Suspense } from 'react'
import Loader from './loader'

const Loadable = (Component)=>(Props)=>{
    <Suspense fallback={<Loader/>}>
        <Component {...Props}/>
    </Suspense>

}

export default Loadable