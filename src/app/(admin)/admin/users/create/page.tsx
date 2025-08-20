import UserCreateForm from '@/components/admin/users/usercreateform'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { Col, Container, Row } from 'react-bootstrap'

const Page = () => {
  return (
    <>
      <Container fluid>
        <PageBreadcrumb title="Basic Elements" subtitle="Forms" />

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

export default Page
