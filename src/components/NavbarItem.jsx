import React from 'react'

const NavbarItem = (props) => {
  console.log(JSON.stringify(props.navItem));
  return (
    <li>
      <a
        href="#"
        className="block py-2 pl-3 pr-4 text-white font-semibold  rounded md:bg-transparent  md:p-0 "
        aria-current="page" 
      >
        {props.navItem.title}
        
      </a>
    </li>
  );
};

export default NavbarItem