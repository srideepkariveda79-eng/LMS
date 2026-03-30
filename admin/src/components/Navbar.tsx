import React, { useEffect, useRef, useState } from 'react'
import {navbarStyles} from '../assets/dummyStyles'
import arohakLogo from '../assets/Arohak-logo.jpg'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ListChecks, LogOut, Menu, PlusCircle, X } from 'lucide-react'
import { useAdminAuth } from '../context/AdminAuthContext'


const Navbar = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isVisible, setIsVisible] = useState(true)
    const location = useLocation()
    const navigate = useNavigate()
    const menuRef = useRef(null)
    const { admin, logout } = useAdminAuth()

    const handleLogout = () => { logout(); navigate('/login') }

     const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/" },
    {
      id: "addcourse",
      label: "Add Course",
      icon: PlusCircle,
      path: "/addcourse",
    },
    {
      id: "listcourse",
      label: "List Courses",
      icon: ListChecks,
      path: "/listcourse",
    },
    { id: "bookings", label: "enrolled", icon: ListChecks, path: "/bookings" },
  ];

  // hide navbar on scrolling down
    useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 80) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // close menu when clicked outside of navbar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMenuOpen]);

  return (
    <>
        <nav className={navbarStyles.nav(isVisible)}>
            <div className={navbarStyles.navContainer}>
                <div ref={menuRef} className={navbarStyles.navInner(isMenuOpen)}>
                    <div className={navbarStyles.glowEffect}></div>
                    <div className={navbarStyles.navbarContent}>
                            <div className={navbarStyles.logoContainer}>
                                <img src={arohakLogo} alt='AROHAK' className='h-10 w-auto' />
                            </div>

                            {/*desktop links*/}
                            <div className={navbarStyles.desktopNav}>
                                <div className={navbarStyles.desktopNavInner}>
                                    {menuItems.map(({id, label, icon: Icon, path}) => {
                                        const isActive = location.pathname === path
                                        return (
                                            <Link key={id} to={path} className={navbarStyles.desktopNavItem(isActive)}>
                                            <Icon className='w-4 h-4' />
                                            <span className='lg:text-md xl:text-lg md:text-xs'>{label}</span>
                                            {isActive && <span className={navbarStyles.desktopActiveGlow} />}
                                            </Link>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Admin info + logout */}
                            <div className="hidden md:flex items-center gap-3 ml-4">
                                {admin && (
                                    <span className="text-xs text-gray-500 font-medium hidden lg:block">
                                        {admin.name}
                                    </span>
                                )}
                                <button onClick={handleLogout}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-xl text-xs font-semibold transition-all border border-red-500/20">
                                    <LogOut size={13} /> Logout
                                </button>
                            </div>
                                    {/* mobile toggle */}
                                    <div className={navbarStyles.mobileToggleContainer}>
                                        <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setIsMenuOpen(!isMenuOpen)
                                        }} className={navbarStyles.mobileToggleButton}
                                        >
                                            {isMenuOpen ? (
                                                <X className={navbarStyles.mobileToggleIcon} />
                                            ) : (
                                                <Menu className={navbarStyles.mobileToggleIcon} />
                                            ) 
                                            }
                                        </button>

                                    </div>

                    </div>
                    {/*mobile navigation */}
                    <div className={navbarStyles.mobileMenu(isMenuOpen)}>
                            <div className={navbarStyles.mobileMenuInner}>
                                    {menuItems.map(({ id, label, icon: Icon, path }) => {
                                        const isActive = location.pathname === path
                                        return (
                                            <Link
                                            key={id}
                                            to={path}
                                            onClick={() => setIsMenuOpen(false)}
                                            className={navbarStyles.mobileMenuItem(isActive)}
                                            >
                                            <Icon className={navbarStyles.mobileMenuIcon} />
                                            <span className={navbarStyles.mobileMenuText}>
                                                {label}
                                            </span>
                                           </Link>
                                        )
                                    })}
                                    <button onClick={() => { handleLogout(); setIsMenuOpen(false) }}
                                        className="flex items-center gap-2 w-full px-4 py-2.5 text-red-400 hover:bg-red-500/10 rounded-xl transition-all text-sm font-semibold mt-1">
                                        <LogOut size={15} /> Logout
                                    </button>
                            </div>
                    </div>
                </div>
            </div>
        </nav>
    </>
  )
}

export default Navbar