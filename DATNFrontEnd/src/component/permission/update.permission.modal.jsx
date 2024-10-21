import React, { useState, useEffect, useRef } from 'react';
import { Modal, Table, Checkbox, notification } from 'antd';
import { getAllPermissionPagination, getStaffPermissions, updateStaffPermissions } from '../../service/api.service';

const UpdatePermissionForUserModal = (props) => {
    const [permissions, setPermissions] = useState([]);
    const [staffPermissions, setStaffPermission] = useState([]);
    const [initialized, setInitialized] = useState(false);
    const allPermissionsRef = useRef([]); // Lưu tất cả quyền để không cần gọi lại API
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const { id, open, onClose } = props

    useEffect(() => {
        if (open && !initialized) {
            loadAllPermissions();
        }

        if (id && open) {
            loadStaffPermissions(id);
        }
    }, [id, open, current, pageSize]);

    const loadAllPermissions = async () => {
        try {
            const allPermissionsRes = await getAllPermissionPagination(current, pageSize);
            const allPermissions = allPermissionsRes.data.data.content.map(item => ({
                id: item.id,
                action: item.name,
                staff: false,
            }));
            setPermissions(allPermissions);
            allPermissionsRef.current = allPermissions;
            setTotal(allPermissionsRes.data.data.totalElements)
            setInitialized(true);
        } catch (error) {
            console.error("Failed to load all permissions:", error);
        }
    };

    const loadStaffPermissions = async (id) => {
        try {
            const staffPermissionRes = await getStaffPermissions(id);
            const staffPermission = staffPermissionRes.data.data.map(item => item.name);

            // Update trạng thái checked cho các quyền dựa trên staffPermission
            const updatedPermissions = allPermissionsRef.current.map(permission => ({
                ...permission,
                staff: staffPermission.includes(permission.action),
            }));

            setPermissions(updatedPermissions);
            setStaffPermission(staffPermission);
        } catch (error) {
            console.error("Failed to load user permissions:", error);
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
            .filter(staffPermission =>
                !permissions.find(p => p.action === staffPermission && p.staff)
            )
            .map(staffPermission => {
                const foundPermission = permissions.find(p => p.action === staffPermission);
                return foundPermission ? foundPermission.id : null;
            })
            .filter(id => id !== null && id !== undefined);

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
                    onClose();
                }
            } catch (error) {
                console.error("Failed to update permissions:", error);
            }
        } else {
            console.log("No permissions to update");
            onClose();
        }
    };
    // Grouping dữ liệu để hiển thị lên table
    const groupData = [
        {
            key: 'permitionGroup',
            action: 'Permissions',
            staff: null,
        },
        ...permissions.filter(item => item.action.includes('PERMITION')),
        {
            key: 'userGroup',
            action: 'Users',
            staff: null,
        },
        ...permissions.filter(item => item.action.includes('USER')),
    ];
    return (
        <Modal
            title="Manage Permissions"
            open={open}
            maskClosable={false}
            onCancel={onClose}
            onOk={handleOk}
        >
            <Table
                dataSource={permissions}
                pagination={{
                    current: current,
                    pageSize: pageSize,
                    showSizeChanger: true,
                    total: total,
                }}
                onChange={onChange}
                rowKey="action"
            >
                <Table.Column
                    title="Action"
                    dataIndex="action"
                />
                <Table.Column
                    title="Status"
                    render={(text, record) => (
                        record.key ? null : (
                            <Checkbox
                                checked={record.staff}
                                onChange={e => handleCheckboxChange(record.action, e.target.checked)}
                            />
                        )
                    )}
                />
            </Table>
        </Modal>
    );
}

export default UpdatePermissionForUserModal;