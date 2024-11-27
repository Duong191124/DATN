import React, { useState, useEffect, useRef } from 'react';
import { Modal, Table, Checkbox, notification, Input } from 'antd';
import { getAllPermissionPagination, getStaffPermissions, updateStaffPermissions } from '../../service/api.service';
import { useNavigate } from 'react-router-dom';

const UpdatePermissionForUserModal = (props) => {
    const [permissions, setPermissions] = useState([]);
    const [staffPermissions, setStaffPermission] = useState([]);
    const allPermissionsRef = useRef([]); // Lưu tất cả quyền để không cần gọi lại API
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const { id, open, onClose } = props

    useEffect(() => {
        if (open) {
            // Chỉ gọi loadStaffPermissions sau khi loadAllPermissions hoàn tất
            loadAllPermissions();
        }
    }, [open, current, pageSize]);

    // Load all permissions with pagination
    const loadAllPermissions = async () => {
        try {
            const allPermissionsRes = await getAllPermissionPagination(current, pageSize, search); // Truyền search vào API
            const allPermissions = allPermissionsRes.data.data.content.map(item => ({
                id: item.id,
                action: item.name,
                staff: false,
            }));

            allPermissionsRef.current = allPermissions; // Lưu tất cả permissions vào ref
            setPermissions(allPermissions); // Set state permissions
            setTotal(allPermissionsRes.data.data.totalElements); // Set tổng số permissions

            // Sau khi loadAllPermissions, gọi loadStaffPermissions
            if (id) {
                loadStaffPermissions(id); // Lấy permissions của staff sau khi load tất cả permissions
            }
        } catch (error) {
            console.error("Failed to load all permissions:", error);
        }
    };

    const onSearchChange = (e) => {
        setSearch(e.target.value); // Cập nhật giá trị tìm kiếm
        setCurrent(1); // Reset trang khi tìm kiếm
    };

    const onCloseModal = () => {
        setSearch(""); // Xóa giá trị tìm kiếm
        onClose(); // Gọi callback để đóng modal
    };

    // Load staff permissions and update checkbox state
    const loadStaffPermissions = async (id) => {
        try {
            const staffPermissionRes = await getStaffPermissions(id);
            const staffPermissionIds = staffPermissionRes.data.data.map(item => item.id);

            // Kiểm tra xem allPermissionsRef đã có dữ liệu chưa
            if (allPermissionsRef.current.length > 0) {
                const updatedPermissions = allPermissionsRef.current.map(permission => ({
                    ...permission,
                    staff: staffPermissionIds.includes(permission.id),
                }));

                setPermissions(updatedPermissions); // Update permissions state
                setStaffPermission(staffPermissionIds); // Set staff permissions state
            }
            console.log(staffPermissionIds);
        } catch (error) {
            console.error("Failed to load staff permissions:", error);
        }
    };


    const handleCheckboxChange = (action, checked) => {
        setPermissions(prevState =>
            prevState.map(item =>
                item.action === action ? { ...item, staff: checked } : item
            )
        );
    };

    const onChange = (pagination) => {
        if (pagination && pagination.current) {
            setCurrent(pagination.current);
        }
        if (pagination && pagination.pageSize) {
            setPageSize(pagination.pageSize);
        }
    };

    const handleOk = async () => {
        const permissionsToAdd = permissions
            .filter(permission => permission.staff && !staffPermissions.includes(permission.action))
            .map(permission => permission.id);

        const permissionsToRemove = staffPermissions
            .filter(staffPermissionId =>
                !permissions.some(p => p.id === staffPermissionId && p.staff)
            );

        console.log("Permissions to remove:", permissionsToRemove);

        const payload = {};
        if (permissionsToAdd.length > 0) {
            payload.permissionToAdd = permissionsToAdd;
        }
        if (permissionsToRemove.length > 0) {
            payload.permissionToRemove = permissionsToRemove;
        }

        if (Object.keys(payload).length > 0) {
            try {
                const res = await updateStaffPermissions(id, payload);
                if (res.status == 200) {
                    notification.success({
                        message: "Update Permission Success",
                        description: "Update Permission for staff successfully!",
                    });
                    await loadStaffPermissions(id);
                    onClose();
                }
            } catch (error) {
                console.error("Failed to update permissions:", error);
            }
        } else {
            onClose();
        }
    };

    const filteredPermissions = permissions.filter(permission =>
        permission.action.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Modal
            title="Manage Permissions"
            open={open}
            maskClosable={false}
            onCancel={onCloseModal}
            onOk={handleOk}
        >
            <Input
                placeholder="Search permissions"
                value={search}
                onChange={onSearchChange} // Gọi hàm onSearchChange khi người dùng nhập
                style={{ marginBottom: '16px' }}
            />
            <Table
                dataSource={filteredPermissions}
                pagination={{
                    current: current,
                    pageSize: pageSize,
                    total: total,
                    showSizeChanger: true,
                    onChange: (page, size) => {
                        setCurrent(page);
                        setPageSize(size);
                    },
                }}
                rowKey="action"
            >
                <Table.Column
                    title="Action"
                    dataIndex="action"
                />
                <Table.Column
                    title="Status"
                    render={(text, record) => (
                        <Checkbox
                            checked={record.staff}
                            onChange={e => handleCheckboxChange(record.action, e.target.checked)}
                        />
                    )}
                />
            </Table>

        </Modal>
    );
}

export default UpdatePermissionForUserModal;