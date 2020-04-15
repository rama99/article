import { useState } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import NProgress from 'nprogress';
import { APP_NAME } from '../config';
import {isAuth , signout } from '../actions/auth';

import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import '.././node_modules/nprogress/nprogress.css';

Router.onRouteChangeStart = url => NProgress.start();
Router.onRouteChangeComplete = url => NProgress.done();
Router.onRouteChangeError = url => NProgress.done();

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <Navbar color="light" light expand="md">
        <Link href="/">
          <NavLink className="font-weight-bold">{APP_NAME}</NavLink>
        </Link>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>

          <Nav className="ml-auto" navbar>
            
            {
              isAuth() &&  (<React.Fragment>  
                                <NavItem>
                                    <Link href="/admin">
                                      <NavLink>{`${isAuth().name}'s Dashboard`}</NavLink>
                                    </Link>
                                </NavItem>
                                <NavItem>
                                  <NavLink style={{ cursor: 'pointer' }} onClick={() => signout(() => Router.replace(`/`))}>
                                    Signout
                                  </NavLink>
                                </NavItem>                                
                            </React.Fragment>
              )
            }
            
            
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default Header;
