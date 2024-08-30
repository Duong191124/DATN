package com.example.demo.entity;

import jakarta.persistence.*;

import java.util.Collection;
import java.util.Objects;

@Entity
public class Role {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private int id;
    @Basic
    @Column(name = "name")
    private String name;
    @Basic
    @Column(name = "status")
    private byte status;
    @OneToMany(mappedBy = "roleByRoleId")
    private Collection<Customer> customersById;
    @OneToMany(mappedBy = "roleByRoleId")
    private Collection<Staff> staffById;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public byte getStatus() {
        return status;
    }

    public void setStatus(byte status) {
        this.status = status;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Role role = (Role) o;
        return id == role.id && status == role.status && Objects.equals(name, role.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, status);
    }

    public Collection<Customer> getCustomersById() {
        return customersById;
    }

    public void setCustomersById(Collection<Customer> customersById) {
        this.customersById = customersById;
    }

    public Collection<Staff> getStaffById() {
        return staffById;
    }

    public void setStaffById(Collection<Staff> staffById) {
        this.staffById = staffById;
    }
}
