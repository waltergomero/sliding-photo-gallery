import UserCreateForm from '@/components/admin/users/usercreateform'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { Col, Container, Row } from 'react-bootstrap'
import { getUserById } from '@/actions/user-actions';
import { notFound } from 'next/navigation';
import UserEditForm from '@/components/admin/users/usereditform';
import { requireAdmin } from '@/lib/auth-guard';


export const metadata= { title: "User" }

const EditUserPage = async (props:any) => {
    await requireAdmin();
    const { id } = await props.params;
    const user = await getUserById(id);

     if (!user) notFound();

  return (
    <>
      <Container fluid>
        <PageBreadcrumb title="Edit User Information" subtitle="User" />

        <Container>
           <Row className="justify-content-center">
            <Col xl={8}>
              <UserEditForm user={user} />
            </Col>
          </Row>
        </Container>
      </Container>
    </>
  )
}

export default EditUserPage
