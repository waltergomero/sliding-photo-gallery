'use client';

import { useState, useEffect } from 'react';
import { toast  } from 'react-toastify';
import { redirect, useRouter } from 'next/navigation';
import { Button, Col, Form, FormCheck, FormControl, FormGroup, FormLabel, InputGroup, Row } from 'react-bootstrap';
import ComponentCard from '@/components/cards/ComponentCard';
import { createCategory } from '@/actions/category-actions';
import { ZodErrors } from "@/components/common/zod-errors";
import { SaveCategoryBtn } from './buttons';


type CategoryCreateFormState = {
    loading: boolean;
    zodErrors: any;
    error?: string;
    success?: boolean;
    message?: string;
};

const UserCreateForm = () => {
    
    const router = useRouter();
    const [state, setState] = useState<CategoryCreateFormState | null>(null);

    async function handleSubmit(event:any) {
    event.preventDefault();
    const formData = new FormData(event.target);
    setState({ loading: true, zodErrors: null });  

        try {
        const response = await createCategory(formData);
            console.log("Response from createCategory:", response);
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
    <ComponentCard title="New Category Form">
      <Form  onSubmit={handleSubmit} className="g-3">
        <Row>
          <Col md={4}>
            <FormGroup className="position-relative mb-3">
              <FormLabel>Category Name</FormLabel>
              <FormControl  type="text" name='category_name'/>
              <ZodErrors error={state?.zodErrors?.category_name} />
            </FormGroup>       
          </Col>
          <Col md={8}>
            <FormGroup className="position-relative mb-3">
              <FormLabel>Description</FormLabel>
              <FormControl  type="text" name='description'/>
            </FormGroup>
          </Col>
          <Col md={12} className='mt-4'>
          <Button type='button' onClick={() => router.back()} className='btn btn-light'>Cancel</Button>
          <span className="mx-2"></span>
            <SaveCategoryBtn />
          </Col>
        </Row>
      </Form>
    </ComponentCard>
  )
}


export default UserCreateForm