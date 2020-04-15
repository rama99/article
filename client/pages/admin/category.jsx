import Layout from '../../components/Layout';
import Admin from '../../components/auth/Admin';
import Category from '../../components/auth/Category';
import Link from 'next/link';

const CategoryPage = () => {
    return (
        <Layout>
            <Admin>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12 pt-5 pb-5">
                            <h2>Manage Categories</h2>
                        </div>
                        <div className="col-md-6">
                            <Category />
                        </div>
                        <div className="col-md-6">
                            
                        </div>
                    </div>
                </div>
           </Admin>
        </Layout>
    );
};

export default CategoryPage;