'use client';
import React, { useState } from 'react';
import { FormControl, Card, CardBody, CardHeader, CardTitle, InputGroup, Table,  } from 'react-bootstrap'
import { UserTableProps, } from '@/types/user';
import { EditUserBtn, DeleteUserBtn, CreateUserBtn } from './buttons';

const UsersTable = ({ users }: UserTableProps) => {
    const [search, setSearch] = useState('');

  // Filter users based on search query (case-insensitive)
  const filteredUsers = users.data.filter(user =>
    `${user.first_name} ${user.last_name} ${user.email}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card>
      <CardHeader className="justify-content-between">
        <CardTitle> Users Table </CardTitle>
            <CreateUserBtn />
      </CardHeader>

      <CardBody>
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Search users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </InputGroup>
        <Table responsive hover className="table-custom align-middle mb-0">
          <thead className="align-middle table-dark">
            <tr className="text-uppercase fs-xxs">
            <th scope="col">ID</th>
            <th scope="col">Last Name</th>
            <th scope="col">First Name</th>
            <th scope="col">Email</th>
            <th scope="col">Is Admin?</th>
            <th scope="col">Is Active?</th>         
            <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, idx) => (
              <tr key={idx}>
                <td>{user.id}</td>
                <td>{user.last_name}</td>
                <td>{user.first_name}</td>
                <td>{user.email}</td>
                <td>
                  {user.isadmin ? 'Yes' : 'No'}
                </td>
                <td>
                  {user.isactive ? 'Yes' : 'No'}
                </td>
                <td>
                 <EditUserBtn id={user.id} />
                 <span className="mx-1"></span>
                 <DeleteUserBtn id={user.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  )
}

export default UsersTable
