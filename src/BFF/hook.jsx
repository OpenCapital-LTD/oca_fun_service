import { useGiraf } from "../giraff";
import { useGetApi } from "../pages/hooks";

const useBaseBFF = () => {
    const { actionRequest } = useGetApi();
    const { gHead, addGHead } = useGiraf()

    const baseAggregate = async ({ parent, children }) => {
        try {
            // Fetch parent data
            const parentRes = (await actionRequest({ endPoint: parent.endPoint, params: parent.params, hd: parent.hd })).data;

            // Fetch children data
            for (const el of children) {
                try {
                    let childRes = gHead.bffUser;
                    if (el.name == "User" && !gHead.bffUser) childRes = (await actionRequest({ endPoint: el.endPoint, params: el.params, hd: el.hd })).data;
                    addGHead('bffUser', childRes)

                    parentRes.forEach((l) => {
                        const userId = l[parent.link_param];
                        const childParam = childRes.find(child => child.id === userId);
                        l[el.name] = childParam;

                        if (l.date) {
                            const now = new Date();
                            const recordDate = new Date(l.date);
                            const diffInMs = Math.abs(now - recordDate);
                            const totalHours = diffInMs / (1000 * 60 * 60);

                            // Calculate days and remaining hours
                            const days = Math.floor(totalHours / 24);
                            const hours = totalHours % 24;
                            const intHours = Math.floor(hours);

                            l.days = days;
                            l.hours = intHours;
                        } else {
                            l.date = 0;
                        }
                    });
                } catch (childError) {
                    console.error(`Error child data for ${el.endPoint}:`, childError);
                }
            }

            return parentRes;
        } catch (error) {
            console.error('Error in baseAggregate:', error);
            throw error;  // Re-throw the error for further handling if necessary
        }
    };
    const getUserById = (user_id)=>{
        console.log('usser ', user_id)
        const users = gHead.bffUser
        if(!users) return
        const user = users.filter(l=>l.id === user_id)
        console.log('and here ' ,users)
        return user[0]

    }
    return { baseAggregate , getUserById};
};

export default useBaseBFF;
