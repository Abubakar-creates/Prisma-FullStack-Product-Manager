'use client'

import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Menu, Dropdown } from 'antd';

const { Column } = Table;
const { confirm } = Modal; import { PlusOutlined } from '@ant-design/icons';
import { MdDelete, MdModeEditOutline, MdOutlineModeEditOutline } from 'react-icons/md';
import { SlOptions } from 'react-icons/sl';
import axios from 'axios';
import { AiFillDelete } from "react-icons/ai";
import moment from 'moment';

const OptionsList = (id) => {
  const menu = (
    <Menu>
      <Menu.Item key="1">
        <div className="flex items-center gap-4">
          <MdModeEditOutline /> Edit
        </div>
      </Menu.Item>

      <Menu.Item key="5">
        <div className="flex items-center gap-4" onClick={(id) => showDeleteConfirm(id)}>
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

  const [products, setProducts] = useState([]);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchProducts = async () => {
      const response = await axios.get('/api/users')
      console.log('response of fetchProducts', response);
      setProducts(response.data.data)
      setLoading(false)
    }
    fetchProducts()
  }, [])



  const columns = [

    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },

    {
      title: 'Created At',
      key: 'createdAt',
      render: (render) => (
        <span>
          {render.updatedAt ? moment(render.createdAt).format('LLL') : 'N/A'}
        </span>
      ),
    },
    {
      title: 'Updated At',
      key: 'updatedAt',
      render: (render) => (
        <span>
          {render.updatedAt ? moment(render.updatedAt).format('LLL') : 'N/A'}
        </span>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '',
      key: 'actions',
      render: (render) => (
        <span>
          <Button type="link" icon={<MdOutlineModeEditOutline />} onClick={() => showEditModal(render)} >
          </Button>
          <Button type="link" icon={<AiFillDelete />} onClick={() => showDeleteConfirm(render.id)} >
          </Button>
        </span>
      ),
    },
  ];



  const handleCreate = async (values) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: values.title, price: parseInt(values.price), description: values.description }),
      });
      if (!response.ok) {
        throw new Error('Failed to create product');
      }
      const newProduct = await response.json();
      setProducts([...products, newProduct.data]);
      form.resetFields();
      setVisible(false);
      message.success('Product created successfully');
    } catch (error) {
      console.error('Error creating product:', error);
      message.error('Failed to create product');
    }
  };

  const handleUpdate = async (values) => {
    console.log('values', values);
    try {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: selectedId, title: values.title, price: parseInt(values.price), description: values.description }),
      });
      if (!response.ok) {
        throw new Error('Failed to update product');
      }
      const updatedProduct = await response.json();
      const updatedProducts = products.map((product) =>
        product.id === updatedProduct.data.id ? updatedProduct.data : product
      );
      setProducts(updatedProducts);
      setSelectedId(null);
      setVisible(false);
      message.success('Product updated successfully');
    } catch (error) {
      console.error('Error updating product:', error);
      message.error('Failed to update product');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch('/api/users', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
      const deletedProductId = await response.json();
      const updatedProducts = products.filter((product) => product.id !== deletedProductId.data.id);
      console.log('updatedProducts', deletedProductId);
      setProducts(updatedProducts);
      message.success('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      message.error('Failed to delete product');
    }
  };

  const showDeleteConfirm = (id) => {
    confirm({
      title: 'Are you sure you want to delete this product?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleDelete(id);

      },
    });
  };
  const showEditModal = (product) => {
    setEditingProduct(product);
    setSelectedId(product.id);
    form.setFieldsValue({
      title: product.title,
      price: product.price,
      description: product.description,
    });
    setVisible(true);
  };

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <>
      {loading ?
        <div className="flex justify-center items-center h-screen">
          <div className="border-t-4 border-blue-600 rounded-full animate-spin h-12 w-12"></div>
        </div> :
        <div className='max-w-[80%] mx-auto'>
          <div className="flex justify-between my-10 max-md:flex-col">
            <h1 className='text-xl font-semibold  '>Manage Products</h1>
            <Button type="primary" onClick={showModal} style={{ marginBottom: '1rem' }}>
              Add Product
            </Button>
          </div>
          <Table columns={columns} dataSource={products} rowKey={(record, index) => index} size="small" scroll={{
            x: 900,

          }} />
          <Modal
            title="Add Product"
            visible={visible}
            onCancel={handleCancel}
            footer={[
              <Button key="cancel" onClick={handleCancel}>
                Cancel
              </Button>,
              <Button key="submit" type="primary" onClick={() => form.submit()}>
                Submit
              </Button>,
            ]}
          >
            <Form form={form} layout='vertical' onFinish={editingProduct ? handleUpdate : handleCreate} variant='filled'>
              <Form.Item name="title" label="Title" vertical rules={[{ required: true, message: 'Please enter title' }]}>
                <Input />
              </Form.Item>
              <Form.Item name="price" label="Price" vertical rules={[{ required: true, message: 'Please enter price' }]}>
                <Input type="number" />
              </Form.Item>
              <Form.Item name="description" vertical label="Description">
                <Input.TextArea rows={4} />
              </Form.Item>
            </Form>
          </Modal>

        </div>
      }
    </>

  );
};

export default Page;
