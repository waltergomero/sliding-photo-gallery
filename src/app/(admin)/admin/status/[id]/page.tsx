import UserCreateForm from '@/components/admin/users/usercreateform'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { Col, Container, Row } from 'react-bootstrap'
import { getStatusById } from '@/actions/status-actions';
import { notFound } from 'next/navigation';
import StatusEditForm from '@/components/admin/status/statuseditform';
import { requireAdmin } from '@/lib/auth-guard';  


export const metadata= { title: "Status" }

const EditStatusPage = async (props:any) => {
 await requireAdmin();
    const { id } = await props.params;
    const status = await getStatusById(id);

     if (!status) notFound();

  return (
    <>
      <Container fluid>
        <PageBreadcrumb title="Edit Status Information" subtitle="Status" />

        <Container>
           <Row className="justify-content-center">
            <Col xl={8}>
              <StatusEditForm status={status} />
            </Col>
          </Row>
        </Container>
      </Container>
    </>
  )
}

export default EditStatusPage
