import Layout from '../../components/Layout';
import Admin from '../../components/auth/Admin';

const Dashboard = () => {
    console.log(`dashboard`);
    return (

        <Admin>
            <Layout>
            <h2>Dashboard</h2>
            </Layout>
        </Admin>        
    );

}

export default Dashboard;