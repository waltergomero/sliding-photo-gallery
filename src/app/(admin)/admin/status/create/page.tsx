import StatusCreateForm from '@/components/admin/status/statuscreateform'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { Col, Container, Row } from 'react-bootstrap';
import { requireAdmin } from '@/lib/auth-guard';

const CreateStatusPage = () => {
   await requireAdmin();
  return (
    <>
      <Container fluid>
        <PageBreadcrumb title="Create New Status Page" subtitle="Status" />
        <Container>
           <Row className="justify-content-center">
            <Col xl={8}>
              <StatusCreateForm />
            </Col>
          </Row>
        </Container>
      </Container>
    </>
  )
}

export default CreateStatusPage
