import { useState } from 'react'
//import reactLogo from './assets/react.svg'
import './App.css'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { NavLink, Link, Route, Routes } from 'react-router-dom'
import Home from './components/home'
import About from './components/about'
import Login from './components/login'

function App() {
  //const [count, setCount] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
  ]

  return (
    <>
      <div className="min-h-screen relative overflow-x-hidden text-gray-900 bg-black">
        <header className="relative inset-x-0 top-0 z-50">
          <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
            <div className="flex lg:flex-1">
              <NavLink to="/" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <img
                  alt=""
                  src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                  className="h-8 w-auto"
                />
              </NavLink>
            </div>
            <div className="flex lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-200"
              >
                <span className="sr-only">Open main menu</span>
                <Bars3Icon aria-hidden="true" className="size-6" />
              </button>
            </div>
            <div className="hidden lg:flex lg:gap-x-12">
              {navigation.map((item) => (
                <NavLink to={item.href} className="text-sm/6 font-semibold text-white">
                  {item.name}
                </NavLink>
              ))}
            </div>
            <div className="hidden lg:flex lg:flex-1 lg:justify-end">
              <NavLink to="/login" className="text-sm/6 font-semibold text-white">
                Log in <span aria-hidden="true">&rarr;</span>
              </NavLink>
            </div>
          </nav>
          <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
            <div className="fixed inset-0 z-50" />
            <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gray-900 p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-100/10">
              <div className="flex items-center justify-between">
                <NavLink to="/" className="-m-1.5 p-1.5">
                  <span className="sr-only">Your Company</span>
                  <img
                    alt=""
                    src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                    className="h-8 w-auto"
                  />
                </NavLink>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="-m-2.5 rounded-md p-2.5 text-gray-200"
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
                  <div className="py-6">
                    <Link
                      to="/login"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-white hover:bg-white/5"
                    >
                      Log in
                    </Link>
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
          </Routes>
        </main>
        <footer className="fixed bottom-0 w-full mt-6 p-4 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Ian Pagés Rodríguez. All rights reserved.
          </p>
        </footer>
      </div>
    </>
  )
}

export default App
