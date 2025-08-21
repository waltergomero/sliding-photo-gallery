'use client';

import { useState, useEffect } from 'react';
import { toast  } from 'react-toastify';
import { redirect, useRouter } from 'next/navigation';
import { Button, Col, Form, FormCheck, FormControl, FormGroup, FormLabel, InputGroup, Row } from 'react-bootstrap';
import ComponentCard from '@/components/cards/ComponentCard';
import { createStatus } from '@/actions/status-actions';
import { ZodErrors } from "@/components/common/zod-errors";
import { SaveStatusBtn } from './buttons';
import { getArrayOfNumbers } from '@/lib/utils';


type StatusCreateFormState = {
    loading: boolean;
    zodErrors: any;
    error?: string;
    success?: boolean;
    message?: string;
};

const UserCreateForm = () => {
    
    const router = useRouter();
    const [state, setState] = useState<StatusCreateFormState | null>(null);

    const typeid = getArrayOfNumbers();

    async function handleSubmit(event:any) {
    event.preventDefault();
    const formData = new FormData(event.target);
    setState({ loading: true, zodErrors: null });  

        try {
        const response = await createStatus(formData);
            console.log("Response from createStatus:", response);
            if (response.error === "validation") {
                setState(response as any);
                toast.error(response.message);
            } else if (response.error === "already_exists") {
                toast.error("Failed adding a status: " + response.message);
            } else if (response.success === false) {
                toast.error("Failed updating status: " + response.message);
            } else if (response.success) {
                toast.success("Status updated successfully");
                router.push('/admin/status');
            } else {
                toast.error("Errors: " + response.error);
            } 
            
        } catch (error) {
            toast.error('Failed to update status');
            setState({ loading: false, zodErrors: null });
        }
}

  return (
    <ComponentCard title="New Status Form">
      <Form  onSubmit={handleSubmit} className="g-3">
        <Row>
          <Col md={6}>
            <FormGroup className="position-relative mb-3">
              <FormLabel>Status Name</FormLabel>
              <FormControl  type="text" name='status_name'/>
              <ZodErrors error={state?.zodErrors?.status_name} />
            </FormGroup>       
          </Col>
           <Col md={6}>
            <FormGroup className="position-relative mb-3">
              <label htmlFor="status_type" className="form-label">Type</label>
                    <select className="form-select" id="status_type" name='typeid'>
                        {typeid?.map((id) => (
                            <option key={id} value={id}>
                                {id}
                            </option>
                            ))}
                    </select>
            </FormGroup>
          </Col>
          <Col md={12}>
            <FormGroup className="position-relative mb-3">
              <FormLabel>Description</FormLabel>
              <FormControl  type="text" name='description'/>
            </FormGroup>
          </Col>
          <Col md={12} className='mt-4'>
          <Button type='button' onClick={() => router.back()} className='btn btn-light'>Cancel</Button>
          <span className="mx-2"></span>
            <SaveStatusBtn />
          </Col>
        </Row>
      </Form>
    </ComponentCard>
  )
}


export default UserCreateForm