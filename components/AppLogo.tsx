import Image from 'next/image'
import Link from 'next/link'

import logoDark from '@/assets/images/logo-black.png'
import logo from '@/assets/images/logo.png'

const AppLogo = () => {
  return (
    <>
      <Link href="/" className="logo-dark">
        <span className='text-black text-bold text-uppercase'>11 Bravo Lens</span>
        {/* <Image src={logoDark} alt="dark logo" height="32" /> */}
      </Link>
      <Link href="/" className="logo-light">
      <span className='text-white text-bold text-uppercase'>11 Bravo Lens</span>
        {/* <Image src={logo} alt="logo" height="32" /> */}
      </Link>
    </>
  )
}

export default AppLogo
