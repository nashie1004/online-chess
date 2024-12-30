import { Link, Navbar as NavbarMain, NavbarBrand, NavbarContent, NavbarItem, Button, Avatar, Chip } from '@nextui-org/react'
import { NavLink,  useNavigate, useSearchParams, useLocation } from 'react-router'
export const AcmeLogo = () => {
    return (
      <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
        <path
          clipRule="evenodd"
          d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
          fill="currentColor"
          fillRule="evenodd"
        />
      </svg>
    );
  };
  
export default function Navbar() {
    const url = useLocation();
  console.log(url)
  return (
    <NavbarMain className="" isBordered>
      <NavbarBrand>
        <AcmeLogo />
        <p className="font-bold text-inherit">ONLINE-CHESS.COM</p>
      </NavbarBrand>
      <NavbarContent className=" sm:flex gap-4" justify="center">
        {
          [
            { url: "/", name: "Home" },
            { url: "/play", name: "Play" },
            { url: "/profile", name: "Profile" },
            { url: "/login", name: "Login" },
            { url: "/register", name: "Register" },
          ].map((item, idx) => {
            return <NavbarItem key={idx} className={item.url === url.pathname ? "text-primary" : ""}>
            <NavLink to={item.url}>{item.name}</NavLink>
          </NavbarItem>
          })
        }
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="">
          <Avatar showFallback src="https://images.unsplash.com/broken" />
        </NavbarItem>
        <NavbarItem>
            <NavbarItem>
            <NavLink to="/">Log out</NavLink>
            </NavbarItem>
        </NavbarItem>
        <NavbarItem>
          <Chip color="warning" variant="bordered">
            <NavLink to="https://github.com/nashie1004/online-chess">Source code on Github</NavLink>
          </Chip>
        </NavbarItem>
      </NavbarContent>
    </NavbarMain>
  )
}
