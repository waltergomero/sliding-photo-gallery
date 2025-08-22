import UserCreateForm from '@/components/admin/users/usercreateform'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { Col, Container, Row } from 'react-bootstrap';
import { requireAdmin } from '@/lib/auth-guard';

const CreateUserPage = async () => {
  await requireAdmin();
  return (
    <>
      <Container fluid>
        <PageBreadcrumb title="Create New User Page" subtitle="User" />

        <Container>
           <Row className="justify-content-center">
            <Col xl={8}>
              <UserCreateForm />
            </Col>
          </Row>
        </Container>
      </Container>
    </>
  )
}

export default CreateUserPage
