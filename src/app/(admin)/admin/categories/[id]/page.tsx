import UserCreateForm from '@/components/admin/users/usercreateform'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { Col, Container, Row } from 'react-bootstrap'
import { fetchCategoryById } from '@/actions/category-actions';
import { notFound } from 'next/navigation';
import CategoryEditForm from '@/components/admin/categories/categoryeditform';
import { requireAdmin } from '@/lib/auth-guard';


export const metadata= { title: "Category" }

const EditCategoryPage = async (props:any) => {
   await requireAdmin();

    const { id } = await props.params;
    const category = await fetchCategoryById(id);
    console.log("Category data for edit:", category);

     if (!category) notFound();

  return (
    <>
      <Container fluid>
        <PageBreadcrumb title="Edit Category Information" subtitle="Category" />
        <Container>
           <Row className="justify-content-center">
            <Col xl={8}>
              <CategoryEditForm category={category} />
            </Col>
          </Row>
        </Container>
      </Container>
    </>
  )
}

export default EditCategoryPage
