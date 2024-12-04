import React, { useState, useEffect, useRef } from "react";
import { Modal, Tree, Checkbox, notification, Row, Col } from "antd";
import {
  getAllPermissionPagination,
  getStaffPermissions,
  updateStaffPermissions,
} from "../../service/api.service";

const UpdatePermissionForUserModal = (props) => {
  const [permissions, setPermissions] = useState([]);
  const [staffPermissions, setStaffPermission] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]); // Quản lý các node mở rộng
  const allPermissionsRef = useRef([]);
  const { id, open, onClose } = props;

  useEffect(() => {
    if (open) {
      loadAllPermissions();
    }
  }, [open]);

  const loadAllPermissions = async () => {
    try {
      const allPermissionsRes = await getAllPermissionPagination(1, 100, "");
      const rawData = allPermissionsRes.data.data.content;


      const allPermissions = rawData.reduce((acc, item) => {
        const [action, entity] = item.name.split("_");
        const permission = { key: item.id, title: item.name, action };

        if (!acc[entity]) {
          acc[entity] = { title: entity.toUpperCase(), children: [] };
        }

        acc[entity].children.push(permission);

        return acc;
      }, {});

      const permissionTree = Object.values(allPermissions);

      allPermissionsRef.current = permissionTree;
      setPermissions(permissionTree);

      if (id) {
        loadStaffPermissions(id);
      }
    } catch (error) {
      console.error("Failed to load all permissions:", error);
    }
  };

  const loadStaffPermissions = async (id) => {
    try {
      const staffPermissionRes = await getStaffPermissions(id);
      const staffPermissionIds = staffPermissionRes.data.data.map(
        (item) => item.id
      );

      const updatedPermissions = allPermissionsRef.current.map((group) => ({
        ...group,
        children: group.children.map((permission) => ({
          ...permission,
          staff: staffPermissionIds.includes(permission.key),
        })),
      }));

      setPermissions(updatedPermissions);
      setStaffPermission(staffPermissionIds);
    } catch (error) {
      console.error("Failed to load staff permissions:", error);
    }
  };

  const handleCheckAll = (checked) => {
    const updatedPermissions = permissions.map((group) => ({
      ...group,
      children: group.children.map((permission) => ({
        ...permission,
        staff: checked,
      })),
    }));
    setPermissions(updatedPermissions);
  };

  const handleGroupCheckAll = (groupKey, checked) => {
    const updatedPermissions = permissions.map((group) =>
      group.title === groupKey
        ? {
          ...group,
          children: group.children.map((permission) => ({
            ...permission,
            staff: checked,
          })),
        }
        : group
    );
    setPermissions(updatedPermissions);
  };

  const handleActionCheckAll = (action, checked) => {
    const updatedPermissions = permissions.map((group) => ({
      ...group,
      children: group.children.map((permission) =>
        permission.action === action
          ? { ...permission, staff: checked }
          : permission
      ),
    }));
    setPermissions(updatedPermissions);
  };

  const handleCheckboxChange = (key, checked) => {
    const updatedPermissions = permissions.map((group) => ({
      ...group,
      children: group.children.map((permission) =>
        permission.key === key ? { ...permission, staff: checked } : permission
      ),
    }));
    setPermissions(updatedPermissions);
  };

  const handleExpandAll = (checked) => {
    if (checked) {
      const allKeys = permissions.map((group) => group.title);
      setExpandedKeys(allKeys);
    } else {
      setExpandedKeys([]);
    }
  };

  const handleOk = async () => {
    const permissionsToAdd = [];
    const permissionsToRemove = [];

    permissions.forEach((group) => {
      group.children.forEach((permission) => {
        if (permission.staff && !staffPermissions.includes(permission.key)) {
          permissionsToAdd.push(permission.key);
        }
        if (!permission.staff && staffPermissions.includes(permission.key)) {
          permissionsToRemove.push(permission.key);
        }
      });
    });

    const payload = {};
    if (permissionsToAdd.length > 0) payload.permissionToAdd = permissionsToAdd;
    if (permissionsToRemove.length > 0)
      payload.permissionToRemove = permissionsToRemove;

    if (Object.keys(payload).length > 0) {
      try {
        const res = await updateStaffPermissions(id, payload);
        if (res.status === 200) {
          notification.success({
            message: "Update Permission Success",
            description: "Permissions updated successfully!",
          });
          loadStaffPermissions(id);
          onClose();
        }
      } catch (error) {
        console.error("Failed to update permissions:", error);
      }
    } else {
      onClose();
    }
  };
  const groupByRows = (data, itemsPerRow) => {
    const rows = [];
    for (let i = 0; i < data.length; i += itemsPerRow) {
      rows.push(data.slice(i, i + itemsPerRow));
    }
    return rows;
  };
  const renderTree = () => {
    const rows = [];
    for (let i = 0; i < permissions.length; i += 4) {
      rows.push(permissions.slice(i, i + 4));
    }
    return rows.map((row, rowIndex) => (
      <Row gutter={16} key={`row-${rowIndex}`}>
        {row.map((group) => (
          <Col span={6} key={group.title}>
            <Tree
              treeData={[
                {
                  title: (
                    <Checkbox
                      checked={group.children.every((child) => child.staff)}
                      indeterminate={
                        group.children.some((child) => child.staff) &&
                        !group.children.every((child) => child.staff)
                      }
                      onChange={(e) =>
                        handleGroupCheckAll(group.title, e.target.checked)
                      }
                    >
                      {group.title}
                    </Checkbox>
                  ),
                  key: group.title,
                  children: group.children.map((permission) => ({
                    title: (
                      <Checkbox
                        checked={permission.staff}
                        onChange={(e) =>
                          handleCheckboxChange(permission.key, e.target.checked)
                        }
                      >
                        {permission.title}
                      </Checkbox>
                    ),
                    key: permission.key,
                  })),
                },
              ]}
            />
          </Col>
        ))}
      </Row>
    ));
  };

  const onCloseModal = () => {
    onClose();
  };

  return (
    <Modal
      title="Manage Permissions"
      open={open}
      maskClosable={false}
      onCancel={onCloseModal}
      onOk={handleOk}
      width={800}
    >
      <div style={{ marginBottom: "16px" }}>
        <Checkbox
          checked={permissions.every((group) =>
            group.children.every((permission) => permission.staff)
          )}
          indeterminate={
            permissions.some((group) =>
              group.children.some((permission) => permission.staff)
            ) &&
            !permissions.every((group) =>
              group.children.every((permission) => permission.staff)
            )
          }
          onChange={(e) => handleCheckAll(e.target.checked)}
        >
          Select All
        </Checkbox>
        <Checkbox onChange={(e) => handleExpandAll(e.target.checked)}>
          Expand/Collapse All
        </Checkbox>
      </div>
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Checkbox
          onChange={(e) => handleActionCheckAll("CREATE", e.target.checked)}
        >
          Select All CREATE
        </Checkbox>
        <Checkbox
          onChange={(e) => handleActionCheckAll("UPDATE", e.target.checked)}
        >
          Select All UPDATE
        </Checkbox>
        <Checkbox
          onChange={(e) => handleActionCheckAll("DELETE", e.target.checked)}
        >
          Select All DELETE
        </Checkbox>
        <Checkbox
          onChange={(e) => handleActionCheckAll("READ", e.target.checked)}
        >
          Select All READ
        </Checkbox>
      </div>
      <div>{renderTree()}</div>
    </Modal>
  );
};

export default UpdatePermissionForUserModal;
