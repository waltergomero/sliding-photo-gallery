
import { currency } from '@/helpers'
import Link from 'next/link'
import { Card, CardBody, CardHeader, CardTitle, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Table, Button } from 'react-bootstrap'
import { TbArrowRight, TbDotsVertical, TbEdit, TbEye, TbTrash } from 'react-icons/tb';
import { UserTableProps, User } from '@/types/user';

const UsersTable = ({ users }: UserTableProps) => {
  return (
    <Card>
      <CardHeader className="justify-content-between">
        <CardTitle> Users Table </CardTitle>
            <Link href="/admin/users/create" className="btn btn-primary btn-sm"aria-label="Add new user">
                <span className="hidden md:block">Add New User</span>{" "}
            </Link>
      </CardHeader>

      <CardBody>
        <Table responsive hover className="table-custom align-middle mb-0">
          <thead className="align-middle table-dark">
            <tr className="text-uppercase fs-xxs">
            <th scope="col">ID</th>
            <th scope="col">Last Name</th>
            <th scope="col">First Name</th>
            <th scope="col">Email</th>
            <th scope="col">Is Active?</th>
            <th scope="col">Is Admin?</th>
            <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.data.map((user, idx) => (
              <tr key={idx}>
                <td>{user.id}</td>
                <td>{user.last_name}</td>
                <td>{user.first_name}</td>
                <td>{user.email}</td>
                <td>
                  {user.isactive ? 'Yes' : 'No'}
                </td>
                <td>
                  {user.isadmin ? 'Yes' : 'No'}
                </td>
                <td>
                <Button variant="light" size="sm" className="btn-icon rounded-circle">
                    <TbEdit className="fs-lg" />
                </Button>
                <Button
                    variant="danger"
                    size="sm"
                    className="btn-icon rounded-circle">
                    <TbTrash className="fs-lg" />
                </Button>
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
