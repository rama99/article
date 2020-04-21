import Layout from '../../components/Layout';
import Admin from '../../components/auth/Admin';
import CreateArticle  from '../../components/auth/CreateArticle';
import Link from 'next/link';

const ArticlePage = () => {
    return (
        <Layout>
            <Admin>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12 pt-5 pb-5">
                            <h2>Create a new Article</h2>
                        </div>
                        <div className="col-md-12">
                            <CreateArticle />
                        </div>
                    </div>
                </div>
           </Admin>
        </Layout>
    );
};

export default ArticlePage;