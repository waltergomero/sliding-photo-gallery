
import { Card, CardBody, CardHeader, CardTitle, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Table, Button } from 'react-bootstrap'
import { UserTableProps, User } from '@/types/user';
import { EditUserBtn, DeleteUserBtn, CreateUserBtn } from './buttons';

const UsersTable = ({ users }: UserTableProps) => {
  return (
    <Card>
      <CardHeader className="justify-content-between">
        <CardTitle> Users Table </CardTitle>
            <CreateUserBtn />
      </CardHeader>

      <CardBody>
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
            {users.data.map((user, idx) => (
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
