'use client'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { useLayoutContext } from '@/context/useLayoutContext'
import { useEffect } from 'react'
import { Alert, Col, Container, Row } from 'react-bootstrap'
import { TbInfoCircle } from 'react-icons/tb'

const Page = () => {
  const { changeSideNavSize, reset } = useLayoutContext()

  useEffect(() => {
    changeSideNavSize('compact')

    return () => reset()
  }, [])

  return (
    <Container fluid>
      <PageBreadcrumb title="Compact Menu" />

      <Row>
        <Col sm={12}>
          <Alert variant="info" className="alert-bordered border-start border-info d-flex align-items-start gap-2">
            <TbInfoCircle className="fs-xxl" />
            <div>
              To switch to a medium-sized (compact) sidebar, add <code>data-sidenav-size="compact"</code> to the <code>&lt;html&gt;</code> tag. To
              apply this dynamically, use <code>changeSideNavSize('compact')</code> from the <code>LayoutContext</code>.
            </div>
          </Alert>
        </Col>
      </Row>
    </Container>
  )
}

export default Page
