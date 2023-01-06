import React from 'react'
import { useState } from 'react'
import { useStateContext } from '../contexts/ContextProvider'
import { Link,NavLink } from 'react-router-dom'
import { SiShopware } from 'react-icons/si'
import { MdOutlineCancel } from 'react-icons/md'
import { GrInProgress, GrLocation, GrSystem } from "react-icons/gr";
import {
  AiOutlineCalendar,
  AiOutlineShoppingCart,
  AiOutlineAreaChart,
  AiOutlineBarChart,
  AiOutlineStock,
  AiFillInfoCircle,
  AiOutlineProfile,
  AiOutlineLogout,
  AiOutlineHome,
} from "react-icons/ai";
import {
  MdAssignmentInd,
  MdOutlineHelp,
  MdOutlineSupervisorAccount,
} from "react-icons/md";
import { HiOutlineInformationCircle } from "react-icons/hi";
export default function Sidebar() {
  const { activeMenu, setActiveMenu, screenSize, currentColor } = useStateContext()
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("userData"))
  );
  const handelCloseSideBar = () => {
    if (activeMenu && screenSize <= 900) {
      setActiveMenu(false)
    }
  }
  const activeLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-white text-md m-2 hover:bg-blue-100';
  const normalLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 hover:bg-blue-100 hover:text-black m-2';
 const links = [
   {
     title: "Hệ thống",
     links: [
       {
         name: "/home",
         text: "Trang chủ",
         icon: <AiOutlineHome />,
       },
       {
         name: "progress",
         text: "Tiến độ",
         icon: <GrInProgress />,
       },
       {
         name: "assignment",
         text: "Phân công",
         icon: <MdAssignmentInd />,
       },
       {
         name: "orders",
         text: "Đơn hàng",
         icon: <MdAssignmentInd />,
       },
     ],
   },
   {
     title: "Tài khoản",
     links: [
       {
         name: "profile",
         text: "Profile",
         icon: <AiOutlineProfile />,
       },
       {
         name: "logout",
         text: "Đăng xuất",
         icon: <AiOutlineLogout />,
       },
     ],
   },
   {
     title: "Giới thiệu",
     links: [
       {
         name: "help",
         text: "Giúp đỡ",
         icon: <MdOutlineHelp />,
       },
       {
         name: "about",
         text: "Về chúng tôi",
         icon: <HiOutlineInformationCircle />,
       },
     ],
   },
 ];
  return (
    <div className="ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10 ">
            {
                activeMenu && (
                    <>
                        <div className="flex justify-between items-center">
                            <div id="profile" className="space-y-3 items-center p-3 flex">
                                <img
                                    alt="Avatar user"
                                    className="w-10 md:w-16 rounded-full mx-auto"
                                />
                                <div className='p-1'>
                                    <h2 className="font-bold text-xs md:text-sm text-center text-teal-500">
                                        {userInfo.EMPLNAME}
                                    </h2>
                                    <p className="text-xs text-gray-500 text-center">{userInfo.JOB_NAME}</p>
                                </div>
                            </div>
                            <div>

                                <button
                                    type={'button'}
                                    onClick={() => setActiveMenu((prevActiveMenu)=>!prevActiveMenu) }
                                    className={'text-xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden'}
                                >
                                    <MdOutlineCancel/>
                                </button>
                            </div>
                        </div>
                        <div className={'mt-10'}>
                            {links.map((item)=>(
                                <div key={item.title} >
                                    <p className={'text-blue-600 m-3 mt-4 uppercase'}>{item.title}</p>
                                    {item.links.map((link)=>(
                                        <NavLink
                                            to={`${link.name}`}
                                            key={link.name}
                                            onClick={handelCloseSideBar}
                                           style={({ isActive })=>({
                                               backgroundColor: isActive ? currentColor :''
                                           })}
                                            className={({ isActive }) => (isActive ? activeLink : normalLink)}
                                        >
                                            {link.icon}
                                            <span>{link.text}</span>
                                        </NavLink>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </>
                )
            }
        </div>
  )
}
