import { Table } from "antd";

const ProductTable = () => {
    const dataSource = [
        {
            key: '1',
            name: 'Mike',
            age: 32,
            address: '10 Downing Street',
        },
        {
            key: '2',
            name: 'John',
            age: 42,
            address: '10 Downing Street',
        },
    ];

    const columns = [
        {
            title: 'id',
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
            dataIndex: 'collar_id'
        },
        {
            title: 'Sleeve',
            dataIndex: 'sleeve_id'
        },
        {
            title: 'Category',
            dataIndex: 'category_id'
        },
        {
            title: 'Brand',
            dataIndex: 'brand_id'
        },
        {
            title: 'Description',
            dataIndex: 'description'
        }
    ];

    return (
        < Table dataSource={dataSource} columns={columns} />
    )
}
export default ProductTable




