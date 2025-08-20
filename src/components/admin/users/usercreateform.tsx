'use client';

import { useState, useEffect } from 'react';
import { toast  } from 'react-toastify';
import { redirect, useRouter } from 'next/navigation';
import { Button, Col, Form, FormCheck, FormControl, FormGroup, FormLabel, InputGroup, Row } from 'react-bootstrap';
import ComponentCard from '@/components/cards/ComponentCard';
import { createNewUser } from '@/actions/user-actions';
import { ZodErrors } from "@/components/common/zod-errors";
//import CheckboxDefault from '@/components/ui/custom/checkboxDefault';

type UserCreateFormState = {
    loading: boolean;
    zodErrors: any;
    error?: string;
    success?: boolean;
    message?: string;
};

const UserCreateForm = () => {
    
    const router = useRouter();
    const [state, setState] = useState<UserCreateFormState | null>(null);

    async function handleSubmit(event:any) {
    event.preventDefault();
    const formData = new FormData(event.target);
    setState({ loading: true, zodErrors: null });  

        try {
        const response = await createNewUser(formData);
            console.log("Response from createNewUser:", response);
            if (response.error === "validation") {
                setState(response as any);
                toast.error(response.message);
            } else if (response.error === "already_exists") {
                toast.error("Failed adding a user: " + response.message);
            } else if (response.success === false) {
                toast.error("Failed updating user: " + response.message);
            } else if (response.success) {
                toast.success("User updated successfully");
                router.push('/admin/users');
            } else {
                toast.error("test " + response.error);
            }  
        } catch (error) {
            toast.error('Failed to update user');
            setState({ loading: false, zodErrors: null });
        }
}

  return (
    <ComponentCard title="React Bootstrap Validation With Tooltip">
      <Form  onSubmit={handleSubmit} className="g-3">
        <Row>
          <Col md={4}>
            <FormGroup className="position-relative mb-3">
              <FormLabel>First name</FormLabel>
              <FormControl  type="text" name='first_name'/>
              <ZodErrors error={state?.zodErrors?.first_name} />
            </FormGroup>       
          </Col>
          <Col md={4}>
            <FormGroup className="position-relative mb-3">
              <FormLabel>Last name</FormLabel>
              <FormControl  type="text" name='last_name'/>
              <ZodErrors error={state?.zodErrors?.last_name} />
            </FormGroup>
          </Col>
           <Col md={4}>
            <FormGroup className="position-relative mb-3">
              <FormLabel>Email</FormLabel>
              <FormControl  type="email" name='email'/>
              <ZodErrors error={state?.zodErrors?.email} />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup className="position-relative mb-3">
              <FormLabel>Password</FormLabel>
              <FormControl  type="password" name='password'/>
              <ZodErrors error={state?.zodErrors?.password} />
            </FormGroup>
          </Col>
          <Col md={12}>
            <FormGroup className="position-relative my-3" >
              <FormCheck style={{ borderColor: '#212529 !important' }}
                label="Is user admin?"
                name="isadmin"
              />
            </FormGroup>
          </Col>
          <Col sm={12}>
            <Button variant="primary" type="submit">
              Submit Form
            </Button>
          </Col>
        </Row>
      </Form>
    </ComponentCard>
  )
}

      <style>{`
        .form-check-input {
          border-color: #212529 !important;
        }
      `}</style>

export default UserCreateForm