import React from 'react'
import { useEffect } from 'react'
const Logout = () => {
    const clearData = () => {
        localStorage.removeItem("userData");
    }
    useEffect(() => {
        clearData();
         window.location.href = '/';
    }, [])
    
  return (
    <div>Logout</div>
  )
}

export default Logout