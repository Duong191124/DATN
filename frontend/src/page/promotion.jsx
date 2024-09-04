import { useState } from "react";
import PromotionTable from "../component/promotion/promotion.table";
import { getAllDataPromotion } from "../service/axios.service";

const Promotion = () => {
    const [dataPromotion, setDataPromotion] = useState([]);

    const loadData = async () => {
        const res = await getAllDataPromotion();
        console.log(res.data)
        // if(res.data){
        //     setDataPromotion(res.data)
        // }
    }
    loadData();

    return (
        <PromotionTable
            // dataPromotion={dataPromotion}
            // loadData={loadData}
        />
    )
}

export default Promotion;