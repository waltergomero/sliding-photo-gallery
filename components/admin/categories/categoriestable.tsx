'use client';
import React, { useState } from 'react';
import { InputGroup, FormControl, Card, CardBody, CardHeader, CardTitle, Table, } from 'react-bootstrap'
import { CategoryTableProps, } from '@/types/category';
import { EditCategoryBtn, DeleteCategoryBtn, CreateCategoryBtn } from './buttons';

const CategoriesTable = ({ categories }: CategoryTableProps) => {
   const [search, setSearch] = useState('');

  // Filter categories based on search query (case-insensitive)
  const filteredCategories = categories.data.filter(category =>
    `${category.category_name} ${category.description}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card>
      <CardHeader className="justify-content-between">
        <CardTitle> Categories Table </CardTitle>
            <CreateCategoryBtn />
      </CardHeader>

      <CardBody>
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Search categories..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </InputGroup>
        <Table responsive hover className="table-custom align-middle mb-0">
          <thead className="align-middle table-dark">
            <tr className="text-uppercase fs-xxs">
            <th scope="col">ID</th>
            <th scope="col">Category Name</th>
            <th scope="col">Description</th>
            <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map((category, idx) => (
              <tr key={idx}>
                <td>{category.id}</td>
                <td>{category.category_name}</td>
                <td>{category.description}</td>
                <td>
                 <EditCategoryBtn id={category.id.toString()} />
                 <span className="mx-1"></span>
                 <DeleteCategoryBtn id={category.id.toString()} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  )
}

export default CategoriesTable
