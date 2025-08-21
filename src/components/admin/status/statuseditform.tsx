'use client';

import { useState, useEffect } from 'react';
import { toast  } from 'react-toastify';
import { redirect, useRouter } from 'next/navigation';
import { Button, Col, Form, FormCheck, FormControl, FormGroup, FormLabel, InputGroup, Row } from 'react-bootstrap';
import ComponentCard from '@/components/cards/ComponentCard';
import { updateStatus } from '@/actions/status-actions';
import { ZodErrors } from "@/components/common/zod-errors";
import { SaveStatusBtn} from './buttons';
import { getArrayOfNumbers } from '@/lib/utils';


type StatusEditFormState = {
    loading: boolean;
    zodErrors: any;
    error?: string;
    success?: boolean;
    message?: string;
};

const UserEditForm = ({status}:any) => {
    
    const router = useRouter();
    const [state, setState] = useState<StatusEditFormState | null>(null);

    const typeid = getArrayOfNumbers();

    async function handleSubmit(event:any) {
    event.preventDefault();
    const formData = new FormData(event.target);
    setState({ loading: true, zodErrors: null });  

        try {
        const response = await updateStatus(formData);
            console.log("Response from edit status:", response);
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
    <ComponentCard title="Edit Status Form">
      <Form  onSubmit={handleSubmit} className="g-3">
        <Row>
          <Col md={12}>
            <FormGroup className="position-relative mb-3">
              <FormLabel>Status Id</FormLabel>
              <FormControl  type="text" name='statusid' defaultValue={status.id} readOnly />
            </FormGroup>       
          </Col>
          <Col md={6}>
            <FormGroup className="position-relative mb-3">
              <FormLabel>Status Name</FormLabel>
              <FormControl  type="text" name='status_name' defaultValue={status.status_name} />
              <ZodErrors error={state?.zodErrors?.status_name} />
            </FormGroup>       
          </Col>
           <Col md={6}>
            <FormGroup className="position-relative mb-3">
              <label htmlFor="status_type" className="form-label">Type</label>
                    <select className="form-select" id="status_type" name='typeid' defaultValue={status?.typeid}>
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
              <FormControl  type="text" name='description' defaultValue={status.description} />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup className="position-relative" >
              <FormCheck
                label="Is active?"
                name="isactive"
                defaultChecked={status.isactive}
              />
            </FormGroup>
          </Col>
          <Col md={12} className='mt-4'>
          <Button type='button' onClick={() => router.back()} className='btn btn-light'>Cancel</Button>
          <span className="mx-2"></span>
            <SaveStatusBtn />
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


export default UserEditForm