'use client'

import React, { useEffect, useState } from 'react';
import { Table, Button, Menu, Dropdown } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { FaUserCog } from 'react-icons/fa';
import { MdBlock, MdChangeCircle, MdDelete, MdModeEditOutline } from 'react-icons/md';
import { SlOptions } from 'react-icons/sl';
import axios from 'axios';


const OptionsList = () => {
    const menu = (
        <Menu>
            <Menu.Item key="1">
                <div className="flex items-center gap-4">
                    <MdModeEditOutline /> Edit
                </div>
            </Menu.Item>
            <Menu.Item key="2">
                <div className="flex items-center gap-4">
                    <MdChangeCircle /> Change Permission
                </div>
            </Menu.Item>
            <Menu.Item key="3">
                <div className="flex items-center gap-4">
                    <FaUserCog /> Role
                </div>
            </Menu.Item>
            <Menu.Item key="4">
                <div className="flex items-center gap-4">
                    <MdBlock /> Block
                </div>
            </Menu.Item>


            <Menu.Item key="5">
                <div className="flex items-center gap-4">
                    <MdDelete /> Delete
                </div>
            </Menu.Item>
        </Menu>
    );

    return (
        <Dropdown overlay={menu} trigger={["click"]}>
            <Button type="text" icon={<SlOptions />} />
        </Dropdown>
    );
};



const Page = () => {

    const [user, setUser] = useState([{ name: 'john', email: 'john@email.com', role: 'Manager' }]);

    useEffect(() => {
        const fetchProducts = async () => {
            const response = await axios.get('/api/users')
            return response.data.json()
            console.log('response of fetchProducts', response);
        }
        fetchProducts()
    }, [])



    const columns = [
        {
            title: 'FullName',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },

        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (render) => (
                <div>
                    <OptionsList />
                </div>
            ),
        },
    ];

    return (
        <div>
            <div className="flex justify-between my-10 max-md:flex-col">
                <h1 className='text-xl font-semibold  '>Manage Provider</h1>
                <Button type="primary" className='max-md:mt-4' icon={<PlusOutlined />}  >
                    Add New Provider
                </Button>
            </div>
            <Table columns={columns} dataSource={user} rowKey={(record, index) => index} size="small" scroll={{
                x: 900,

            }} />

        </div>
    );
};

export default Page;
