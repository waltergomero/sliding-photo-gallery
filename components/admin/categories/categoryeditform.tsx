'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { Button, Col, Form, FormCheck, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap';
import ComponentCard from '@/components/cards/ComponentCard';
import { updateCategory } from '@/actions/category-actions';
import { ZodErrors } from "@/components/common/zod-errors";
import { SaveCategoryBtn } from './buttons';

type CategoryEditFormState = {
  loading: boolean;
  zodErrors: Record<string, string[]> | null | undefined;
  error?: string;
  success?: boolean;
  message?: string;
};

type Category = {
  id: string;
  category_name: string;
  description: string;
  isactive: boolean;
};

type CategoryEditFormProps = {
  category: Category;
};

const CategoryEditForm = ({ category }: CategoryEditFormProps) => {
  const router = useRouter();
    const [state, setState] = useState<CategoryEditFormState>({
      loading: false,
      zodErrors: null,
    });
  

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setState(prev => ({ ...prev, loading: true, zodErrors: null }));

    try {
      const response = await updateCategory(formData);
      console.log("Response from updateCategory:", response);

      if (response.error === "validation") {
        setState(prev => ({ ...prev, loading: false, zodErrors: response.zodErrors, message: response.message }));
        toast.error(response.message);
      } else if (response.error === "already_exists") {
        setState(prev => ({ ...prev, loading: false, message: response.message }));
        toast.error("Failed adding a category: " + response.message);
      } else if (response.success === false) {
        setState(prev => ({ ...prev, loading: false, message: response.message }));
        toast.error("Failed updating category: " + response.message);
      } else if (response.success) {
        toast.success("Category updated successfully");
        router.push('/admin/categories');
      } else {
        setState(prev => ({ ...prev, loading: false, error: response.error }));
        toast.error("Errors: " + response.error);
      }
    } catch {
      toast.error('Failed to update category');
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <ComponentCard title="Edit Category Form">
      <Form onSubmit={handleSubmit} className="g-3">
        <Row>
          <Col md={12}>
            <FormGroup className="position-relative mb-3">
              <FormLabel>Category Id</FormLabel>
              <FormControl type="text" name="category_id" readOnly defaultValue={category.id} />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup className="position-relative mb-3">
              <FormLabel>Category Name</FormLabel>
              <FormControl type="text" name="category_name" defaultValue={category.category_name} />
              <ZodErrors error={state.zodErrors?.category_name} />
            </FormGroup>
          </Col>
          <Col md={8}>
            <FormGroup className="position-relative mb-3">
              <FormLabel>Description</FormLabel>
              <FormControl type="text" name="description" defaultValue={category.description} />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup className="position-relative">
              <FormCheck
                label="Is active?"
                name="isactive"
                defaultChecked={category.isactive}
              />
            </FormGroup>
          </Col>
          <Col md={12} className="mt-4">
            <Button type="button" onClick={() => router.back()} className="btn btn-light">
              Cancel
            </Button>
            <span className="mx-2"></span>
            <SaveCategoryBtn loading={state.loading} />
          </Col>
        </Row>
      </Form>
      <style>{`
        .form-check-input {
          border-color: #7a8794 !important;
        }
      `}</style>
    </ComponentCard>
  );
};

export default CategoryEditForm;