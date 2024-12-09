import { SettingsEthernet } from "@mui/icons-material"
import { GirafProvider } from "../../giraff"
import Settings from "."
import CustomizeDrawer from "../../layout/mainlayout/customise"
import { Route, Routes } from "react-router-dom"
import Groups from "./groups"
import Roles from "./roles"
import Categories from "./categories"
import ExpenseRules from "./expense"

const SettingsEntry = () => {
    return (
        <GirafProvider>
            <CustomizeDrawer />
            <Routes>
                <Route path="/" element={<Settings />}>
                    <Route path="/con" element={<Settings />} />

                </Route>
                <Route path="/office" element={<Groups />} />
                <Route path="/roles" element={<Roles />} />
                <Route path="/category" element={<Categories />} />
                <Route path="/expense_rules" element={<ExpenseRules />} />
            </Routes>
        </GirafProvider>
    )

}
export default SettingsEntry