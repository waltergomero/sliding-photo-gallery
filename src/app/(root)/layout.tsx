import RootLayout from '@/layouts/RootLayout'
import { ChildrenType } from '@/types'

const Layout = ({ children }: ChildrenType) => {
  return <RootLayout>{children}</RootLayout>
}

export default Layout
