import axios from "axios"

const getAllDataPromotion = () => {
    const URL_BACKEND = "/api/v1/promotion";
    return axios.get(URL_BACKEND);
}

export {getAllDataPromotion};