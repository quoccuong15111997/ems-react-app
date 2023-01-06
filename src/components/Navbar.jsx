import React from 'react'
import { navbarItems } from '../data/local';
import NavbarItem from './NavbarItem';
import uuid from 'react-uuid'
import { DropDownList } from '@progress/kendo-react-dropdowns';
const Navbar = () => {
    const countries = [
      "Tiếng Việt","English"
    ]
    const locations = localStorage.getItem("locations")
      ? JSON.parse(localStorage.getItem("locations"))
      : [];
    const userData = localStorage.getItem("userData")
      ? JSON.parse(localStorage.getItem("useruserDatadata"))
      : undefined;
    const valueRender = (element, value) => {
      if (!value) {
        return element;
      }
      const children = [
        <span
          key={1}
          style={{
            display: "inline-block",
            background: "#333",
            color: "#fff",
            borderRadius: "50%",
            width: "18px",
            height: "18px",
            textAlign: "center",
            overflow: "hidden",
          }}
        >
          {value}
        </span>,
        <span key={2}>&nbsp; {element.props.children}</span>,
      ];
      return React.cloneElement(
        element,
        {
          ...element.props,
        },
        children
      );
    };
  return (
    <div>
      <nav className="bg-primary border-gray-200 px-2 sm:px-4 py-2.5">
        <div className="container flex flex-wrap items-center justify-between mx-auto">
          <a href="/" className="flex items-center">
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              className="h-6 mr-3 sm:h-9"
              alt="FirstEMS Logo"
            />
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              FirstEMS
            </span>
          </a>
          <div className="flex items-center md:order-2">
            {locations.length > 0 && (
              <div>
                <DropDownList
                  data={locations}
                 
                  style={{
                    width: "300px",
                  }}
                />
              </div>
            )}
            <div className="ml-5">
              <DropDownList
                data={countries}
                defaultValue={countries[0]}
                style={{
                  width: "150px",
                }}
              />
            </div>
          </div>
          <div
            className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="mobile-menu-language-select"
          >
            <ul className="flex flex-col p-4 mt-4 border rounded-lg md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 ">
              {navbarItems.map((item) => (
                <NavbarItem key={uuid()} navItem={item} />
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar