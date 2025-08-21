'use client';

import { useState, useEffect } from 'react';
import { toast  } from 'react-toastify';
import { redirect, useRouter } from 'next/navigation';
import { Button, Col, Form, FormCheck, FormControl, FormGroup, FormLabel, InputGroup, Row } from 'react-bootstrap';
import ComponentCard from '@/components/cards/ComponentCard';
import { updateCategory } from '@/actions/category-actions';
import { ZodErrors } from "@/components/common/zod-errors";
import { SaveCategoryBtn} from './buttons';
import { ca } from 'zod/v4/locales';


type UserCreateFormState = {
    loading: boolean;
    zodErrors: any;
    error?: string;
    success?: boolean;
    message?: string;
};

const CategoryEditForm = ({category}:any) => {
    
    const router = useRouter();
    const [state, setState] = useState<UserCreateFormState | null>(null);

    async function handleSubmit(event:any) {
    event.preventDefault();
    const formData = new FormData(event.target);
    setState({ loading: true, zodErrors: null });  

        try {
        const response = await updateCategory(formData);
            console.log("Response from edit category:", response);
            if (response.error === "validation") {
                setState(response as any);
                toast.error(response.message);
            } else if (response.error === "already_exists") {
                toast.error("Failed adding a category: " + response.message);
            } else if (response.success === false) {
                toast.error("Failed updating category: " + response.message);
            } else if (response.success) {
                toast.success("Category updated successfully");
                router.push('/admin/categories');
            } else {
                toast.error("Errors: " + response.error);
            }  
            
        } catch (error) {
            toast.error('Failed to update category');
            setState({ loading: false, zodErrors: null });
        }
}

  return (
    <ComponentCard title="Edit Category Form">
      <Form  onSubmit={handleSubmit} className="g-3">
        <Row>
           <Col md={12}>
            <FormGroup className="position-relative mb-3">
              <FormLabel>Category Id</FormLabel>
              <FormControl  type="text" name='category_id' readOnly defaultValue={category.id}/>
            </FormGroup>       
          </Col>
          <Col md={4}>
            <FormGroup className="position-relative mb-3">
              <FormLabel>Category Name</FormLabel>
              <FormControl  type="text" name='category_name' defaultValue={category.category_name} />
              <ZodErrors error={state?.zodErrors?.category_name} />
            </FormGroup>       
          </Col>
          <Col md={8}>
            <FormGroup className="position-relative mb-3">
              <FormLabel>Description</FormLabel>
              <FormControl  type="text" name='description' defaultValue={category.description}  />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup className="position-relative" >
              <FormCheck
                label="Is active?"
                name="isactive"
                defaultChecked={category.isactive}
              />
            </FormGroup>
          </Col>
          <Col md={12} className='mt-4'>
          <Button type='button' onClick={() => router.back()} className='btn btn-light'>Cancel</Button>
          <span className="mx-2"></span>
            <SaveCategoryBtn />
          </Col>
        </Row>
      </Form>
      <style>{`
        .form-check-input {
          border-color: #212529 !important;
        }
      `}</style>

    </ComponentCard>
  )
}


export default CategoryEditForm