import { useEffect } from 'react';
import {isAuth} from '../../actions/auth';
import Router from 'next/router';

const Admin = ({children}) => {

    useEffect(() => {
        if(!isAuth()){
            console.warn(`!isAuth`);
            Router.push(`/admin/signin`);
        } 
    },[])

    return (
        <React.Fragment>{children}</React.Fragment>
    )
    
}


export default Admin;