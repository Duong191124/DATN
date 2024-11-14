import { useEffect, useState } from "react"
import { fetchDataWeight } from "../service/api.service";
import WeightForm from "../component/weight/weight.form";
import WeightTable from "../component/weight/weight.table";

const WeightPage = () => {
    const [dataWeight, setDataWeight] = useState([]);
    const loadDataWeight = async () => {
        const res = await fetchDataWeight();
        setDataWeight(res.data.data)
    }

    useEffect(() => {
        loadDataWeight()
    }, []);
    return (
        <>
            <WeightForm
                loadDataWeight={loadDataWeight}
            />
            <WeightTable
                dataWeight={dataWeight}
                loadDataWeight={loadDataWeight}
            />
        </>

    )
}
export default WeightPage