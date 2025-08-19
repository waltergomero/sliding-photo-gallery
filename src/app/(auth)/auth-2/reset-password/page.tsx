import AppLogo from '@/components/AppLogo'
import { author, currentYear } from '@/helpers'
import Link from 'next/link'
import { Button, Card, Col, Form, FormControl, FormLabel, Row } from 'react-bootstrap'
import { TbMail } from 'react-icons/tb'

const Page = () => {
  return (
    <div className="auth-box d-flex align-items-center">
      <div className="container-xxl">
        <Row className="align-items-center justify-content-center">
          <Col xl={10}>
            <Card className="rounded-4">
              <Row className="justify-content-between g-0">
                <Col lg={6}>
                  <div className="card-body">
                    <div className="auth-brand text-center mb-4">
                      <AppLogo />
                      <h4 className="fw-bold mt-4">Forgot Password ? | IN+</h4>
                      <p className="text-muted w-lg-75 mx-auto">Enter your email address and we&apos;ll send you a link to reset your password.</p>
                    </div>

                    <Form>
                      <div className="mb-3">
                        <FormLabel htmlFor="userEmail" className="form-label">
                          Email address <span className="text-danger">*</span>
                        </FormLabel>
                        <div className="input-group">
                          <span className="input-group-text bg-light">
                            <TbMail className="text-muted fs-xl" />
                          </span>
                          <FormControl type="email" id="userEmail" placeholder="you@example.com" required />
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="form-check">
                          <input className="form-check-input form-check-input-light fs-14" type="checkbox" id="termAndPolicy" />
                          <label className="form-check-label" htmlFor="termAndPolicy">
                            Agree the Terms &amp; Policy
                          </label>
                        </div>
                      </div>

                      <div className="d-grid">
                        <Button type="submit" className="btn btn-primary fw-semibold py-2">
                          Send Request
                        </Button>
                      </div>
                    </Form>

                    <p className="text-muted text-center mt-4 mb-0">
                      Return to{' '}
                      <Link href="/auth-2/sign-in" className="text-decoration-underline link-offset-3 fw-semibold">
                        Sign in
                      </Link>
                    </p>

                    <p className="text-center text-muted mt-4 mb-0">
                      © 2014 - {currentYear} INSPINIA — by <span className="fw-semibold">{author}</span>
                    </p>
                  </div>
                </Col>

                <Col lg={6} className="d-none d-lg-block">
                  <div className="h-100 position-relative card-side-img rounded-end-4 rounded-end rounded-0 overflow-hidden">
                    <div className="p-4 card-img-overlay rounded-4 rounded-start-0 auth-overlay d-flex align-items-end justify-content-center"></div>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default Page
