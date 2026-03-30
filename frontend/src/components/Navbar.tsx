import { useEffect, useRef, useState } from 'react'
import { navbarStyles } from '../assets/dummyStyles.js'
import arohakLogo from '../assets/Arohak-logo.jpg'

import { BookMarked, BookOpen, Contact, Home, Menu, X, BookOpenText, LogOut, User, ChevronDown } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthModal from './AuthModal'

const baseNav = [
    { name: 'Home', icon: Home, href: '/' },
    { name: 'Courses', icon: BookOpen, href: '/courses' },
    { name: 'About', icon: BookMarked, href: '/about' },
    { name: 'Contact', icon: Contact, href: '/contact' },
]

const signedInNav = [
    { name: 'Home', icon: Home, href: '/' },
    { name: 'Courses', icon: BookOpen, href: '/courses' },
    { name: 'My Courses', icon: BookOpenText, href: '/mycourses' },
]

const Navbar = () => {
    const { isSignedIn, user, logout } = useAuth()
    const navigate = useNavigate()
    const [showModal, setShowModal] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [lastScrollY, setLastScrollY] = useState(0)
    const [isScrolled, setIsScrolled] = useState(false)
    const [showNavbar, setShowNavbar] = useState(true)
    const menuRef = useRef(null)
    const userMenuRef = useRef(null)

    const navItems = isSignedIn ? signedInNav : baseNav

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY
            setIsScrolled(scrollY > 20)
            setShowNavbar(!(scrollY > lastScrollY && scrollY > 100))
            setLastScrollY(scrollY)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [lastScrollY])

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setIsOpen(false)
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setShowUserMenu(false)
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const desktopLinkClass = (isActive) =>
        `${navbarStyles.desktopNavItem} ${isActive ? navbarStyles.desktopNavItemActive : ''}`

    const mobileLinkClass = (isActive) =>
        `${navbarStyles.mobileMenuItem} ${isActive ? navbarStyles.mobileMenuItemActive : navbarStyles.mobileMenuItemHover}`

    return (
        <>
            {showModal && <AuthModal onClose={() => setShowModal(false)} />}

            <nav className={`${navbarStyles.navbar} ${showNavbar ? navbarStyles.navbarVisible : navbarStyles.navbarHidden} ${isScrolled ? navbarStyles.navbarScrolled : navbarStyles.navbarDefault}`}>
                <div className={navbarStyles.container}>
                    <div className={navbarStyles.innerContainer}>
                        {/* Logo */}
                        <div className='flex items-center select-none'>
                            <img src={arohakLogo} alt='AROHAK' className='h-12 w-auto' />
                        </div>

                        {/* Desktop nav */}
                        <div className={navbarStyles.desktopNav}>
                            <div className={navbarStyles.desktopNavContainer}>
                                {navItems.map((item) => {
                                    const Icon = item.icon
                                    return (
                                        <NavLink key={item.name} to={item.href} end={item.href === '/'} className={({ isActive }) => desktopLinkClass(isActive)}>
                                            <div className='flex items-center space-x-2'>
                                                <Icon size={16} className={navbarStyles.desktopNavIcon} />
                                                <span className={navbarStyles.desktopNavText}>{item.name}</span>
                                            </div>
                                        </NavLink>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Right side */}
                        <div className={navbarStyles.authContainer}>
                            {!isSignedIn ? (
                                <button type='button' onClick={() => setShowModal(true)} className={navbarStyles.createAccountButton ?? navbarStyles.loginButton}>
                                    <span>Sign Up for learning</span>
                                </button>
                            ) : (
                                <div className='relative flex items-center gap-2' ref={userMenuRef}>
                                    <button onClick={() => setShowUserMenu(p => !p)}
                                        className='flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-gray-100 transition'>
                                        <div className='w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-amber-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0'>
                                            {user?.name?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                        <span className='text-sm font-semibold text-gray-700 hidden sm:block max-w-[120px] truncate'>{user?.name}</span>
                                        <ChevronDown size={14} className={`text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`}/>
                                    </button>
                                    {showUserMenu && (
                                        <div className='absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50'>
                                            <button onClick={() => { navigate('/profile'); setShowUserMenu(false) }}
                                                className='flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition'>
                                                <User size={15} className='text-gray-400'/> My Profile
                                            </button>
                                            <div className='border-t border-gray-100 my-1'/>
                                            <button onClick={() => { logout(); setShowUserMenu(false) }}
                                                className='flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition'>
                                                <LogOut size={15}/> Sign Out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            <button onClick={() => setIsOpen(!isOpen)}>
                                {isOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile nav */}
                    <div ref={menuRef} className={`${navbarStyles.mobileMenu} ${isOpen ? navbarStyles.mobileMenuOpen : navbarStyles.mobileMenuClosed}`}>
                        <div className={navbarStyles.mobileMenuContainer}>
                            <div className={navbarStyles.mobileMenuItems}>
                                {navItems.map((item) => {
                                    const Icon = item.icon
                                    return (
                                        <NavLink key={item.name} to={item.href} end={item.href === '/'} className={({ isActive }) => mobileLinkClass(isActive)} onClick={() => setIsOpen(false)}>
                                            <div className={navbarStyles.mobileMenuIconContainer}>
                                                <Icon size={18} className={navbarStyles.mobileMenuIcon} />
                                            </div>
                                            <span className={navbarStyles.mobileMenuText}>{item.name}</span>
                                        </NavLink>
                                    )
                                })}

                                {!isSignedIn ? (
                                    <button type='button' onClick={() => { setShowModal(true); setIsOpen(false) }}
                                        className={navbarStyles.mobileCreateAccountButton ?? navbarStyles.mobileLoginButton}>
                                        <span>Sign up for Learning</span>
                                    </button>
                                ) : (
                                    <>
                                        <NavLink to='/profile' className={({ isActive }) => mobileLinkClass(isActive)} onClick={() => setIsOpen(false)}>
                                            <div className={navbarStyles.mobileMenuIconContainer}><User size={18} className={navbarStyles.mobileMenuIcon}/></div>
                                            <span className={navbarStyles.mobileMenuText}>My Profile</span>
                                        </NavLink>
                                        <button onClick={() => { logout(); setIsOpen(false) }}
                                            className='flex items-center gap-2 px-4 py-2 text-sm text-red-500'>
                                            <LogOut size={16} /> Sign out
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className={navbarStyles.backgroundPattern}>
                    <div className={navbarStyles.pattern}></div>
                </div>
            </nav>
        </>
    )
}

export default Navbar
