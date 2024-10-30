import { Table } from "antd";
import { render } from "react-dom";

const CartDetailTable = (props) => {
    const { dataCartDetail } = props
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',

        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',

        },
        {
            title: 'Price',
            dataIndex: 'price',

        },
        {
            title: 'Total Price',
            dataIndex: 'totalPrice',

        },
        {
            title: 'Customer',
            dataIndex: 'customer',
            render: (_, record) => {
                return record.customer.name
            }

        },
        {
            title: 'ProductDetail',
            dataIndex: 'productDetail',
            render: (_, record) => {
                return record.productDetail.product.name
            }

        },

    ];


    return (
        <Table columns={columns} dataSource={dataCartDetail} />
    )
}
export default CartDetailTable