import { Table } from "antd";


const ProductTable = (props) => {
    const { dataProduct } = props;

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id'
        },
        {
            title: 'Code',
            dataIndex: 'code'
        },
        {
            title: 'Name',
            dataIndex: 'name'
        },
        {
            title: 'Price',
            dataIndex: 'price'
        },
        {
            title: 'Collar',
            dataIndex: 'collar_name'
        },
        {
            title: 'Sleeve',
            dataIndex: 'sleeveName'
        },
        {
            title: 'Category',
            dataIndex: 'categoryName'
        },
        {
            title: 'Brand',
            dataIndex: 'brandName'
        },
        {
            title: 'Description',
            dataIndex: 'description'
        }
    ];

    return (
        < Table
            dataSource={dataProduct}
            columns={columns}
            rowKey={"id"} />
    )
}
export default ProductTable




