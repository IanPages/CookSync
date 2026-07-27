import { useState } from 'react'
//import reactLogo from './assets/react.svg'
import './App.css'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline'
import { NavLink, Link, Route, Routes, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Home from './components/home'
import About from './components/about'
import Login from './components/login'
import Register from './components/register'
import { useAuth } from './context/auth_context'
import Household from './components/household'
import Profile from './components/profile'

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isLoggedIn, user, logout } = useAuth()
  const navigate = useNavigate()
  const navigation = isLoggedIn
    ? [
      { name: 'Home', href: '/' },
      { name: 'Household', href: '/household' },
      { name: 'Profile', href: '/profile' },
      { name: 'About', href: '/about' },
    ]
    : [
      { name: 'Home', href: '/' },
      { name: 'About', href: '/about' },
    ]



  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="min-h-screen relative overflow-x-hidden">
        <header className="relative inset-x-0 top-0 z-50">
          <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
            <div className="flex lg:flex-1">
              <NavLink to="/" className="-m-1.5 p-1.5">
                <span className="sr-only">CookSync</span>
                <img
                  alt=""
                  src="/logoIp.png"
                  className="h-12 w-auto rounded-xl"
                />
              </NavLink>
            </div>
            <div className="flex lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="-m-2.5 inline-flex items-center bg-cook-primary justify-center rounded-md p-2.5 text-gray-200"
              >
                <span className="sr-only">Open main menu</span>
                <Bars3Icon aria-hidden="true" className="size-6" />
              </button>
            </div>
            <div className="hidden lg:flex lg:gap-x-12">
              {navigation.map((item) => (
                <NavLink key={item.name} to={item.href} className="font-semibold ">
                  {item.name}
                </NavLink>
              ))}
            </div>
            <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-4">
              {isLoggedIn && user ? (
                <>
                  <div className="flex items-center gap-2">
                    {user.picture ? (
                      <img src={user.picture} alt={user.username} className="h-8 w-8 rounded-full object-cover ring-2 ring-white/20" />
                    ) : (
                      <div className="h-8 w-8 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className=" flex items-center gap-2 bg-cook-primary text-white px-4 py-2 rounded-lg transition-colors border border-white/10"
                  >

                    <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/login" className="font-semibold text-white">
                    Log in <span aria-hidden="true">→</span>
                  </NavLink>
                  <NavLink to="/register" className="font-semibold text-white">
                    Register <span aria-hidden="true">→</span>
                  </NavLink>
                </>
              )}
            </div>
          </nav>
          <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
            <div className="fixed inset-0 z-50" />
            <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-cook-bg p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-100/10 shadow-xl shadow-cook-accent/40">
              <div className="flex items-center justify-between">
                <NavLink to="/" className="-m-1.5 p-1.5">
                  <span className="sr-only">CookSync</span>
                  <img
                    alt=""
                    src="/logoIp.png"
                    className="h-12 w-auto rounded-xl"
                  />
                </NavLink>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="-m-2.5 rounded-md p-2.5 bg-cook-primary"
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon aria-hidden="true" className="size-6" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-white/10">
                  <div className="space-y-2 py-6">
                    {navigation.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.href}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-white/5"
                      >
                        {item.name}
                      </NavLink>
                    ))}
                  </div>
                  <hr className='bg-cook-accent ' />
                  <div className="py-6 grid grid-cols-2 gap-2 justify-items-center items-center">
                    {isLoggedIn && user ? (
                      <>
                        <div className="flex items-center gap-3 px-3 py-2 mb-2">
                          {user.picture ? (
                            <img src={user.picture} alt={user.username} className="h-8 w-8 rounded-full object-cover" />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold text-sm">
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                          className="mb-4 flex items-center gap-2 bg-cook-primary text-white px-4 py-2 rounded-lg transition-colors border border-white/10"
                        >
                          <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                          Log out
                        </button>
                      </>
                    ) : (
                      <Link
                        to="/login"
                        className="block w-full rounded-lg py-2.5 font-semibold cursor-pointer"
                      >
                        Log in
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </DialogPanel>
          </Dialog>
        </header>
        <main className="container mx-auto p-4 relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/household" element={<Household />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
        <footer className="relative bottom-0 w-full mt-6 p-4 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Ian Pagés Rodríguez. All rights reserved.
          </p>
        </footer>
      </div>
      <ToastContainer />
    </>
  )
}

export default App
