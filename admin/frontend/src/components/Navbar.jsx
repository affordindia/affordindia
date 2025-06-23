import React from 'react'
import { assets } from '../assets/assets';





const Navbar = () => {
  return (
    <>
    <div className='flex justify-between items-center bg-[#2c2a4a] px-12 py-3 shadow-md'>

  <div>
    <img src={assets.logo} alt="Logo" />
  </div>

  <div className="flex items-center justify-center bg-[#e8e0d0] text-[#000] text-md border rounded-md h-11 w-28">
    Logout
  </div>

</div>

    
    </>
  )
}

export default Navbar