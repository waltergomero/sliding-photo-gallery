
import { currency } from '@/helpers'
import Link from 'next/link'
import { Card, CardBody, CardHeader, CardTitle, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Table, Button } from 'react-bootstrap'
import { TbArrowRight, TbDotsVertical, TbEdit, TbEye, TbTrash } from 'react-icons/tb';
import { CategoryTableProps, Category } from '@/types/category';
import { EditCategoryBtn, DeleteCategoryBtn, CreateCategoryBtn } from './buttons';

const CategoriesTable = ({ categories }: CategoryTableProps) => {
  return (
    <Card>
      <CardHeader className="justify-content-between">
        <CardTitle> Categories Table </CardTitle>
            <CreateCategoryBtn />
      </CardHeader>

      <CardBody>
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
            {categories.data.map((category, idx) => (
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
