'use client';
import React, { useState } from 'react';
import { Card, CardBody, CardHeader, CardTitle, InputGroup,   Table, FormControl } from 'react-bootstrap'
import { StatusTableProps, } from '@/types/status';
import { EditStatusBtn, DeleteStatusBtn, CreateStatusBtn } from './buttons';

const StatusTable = ({ status }: StatusTableProps) => {
  const [search, setSearch] = useState('');

  // Filter status based on search query (case-insensitive)
  const filteredStatus = status.data.filter(statusItem =>
    `${statusItem.status_name} ${statusItem.description}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card>
      <CardHeader className="justify-content-between">
        <CardTitle> Status Table </CardTitle>
            <CreateStatusBtn />
      </CardHeader>

      <CardBody>
         <InputGroup className="mb-3">
          <FormControl
            placeholder="Search status..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </InputGroup>
        <Table responsive hover className="table-custom align-middle mb-0">
          <thead className="align-middle table-dark">
            <tr className="text-uppercase fs-xxs">
            <th scope="col">ID</th>
            <th scope="col">Status Name</th>
            <th scope="col">Type ID</th>
            <th scope="col">Description</th>
            <th scope="col">Is Active?</th>
            <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStatus.map((statusItem, idx) => (
              <tr key={idx}>
                <td>{statusItem.id}</td>
                <td>{statusItem.status_name}</td>
                <td>{statusItem.typeid}</td>
                <td>{statusItem.description}</td>
                <td>
                  {statusItem.isactive ? 'Yes' : 'No'}
                </td>
                <td>
                 <EditStatusBtn id={statusItem.id} />
                 <span className="mx-1"></span>
                 <DeleteStatusBtn id={statusItem.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  )
}

export default StatusTable
