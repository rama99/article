import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { useState, useEffect } from 'react';
import { singleArticle } from '../../actions/article';
import { API,  APP_NAME} from '../../config';
import renderHTML from 'react-render-html';
import moment from 'moment';

const SingleArticle = ({ article , query }) => {
    const [related, setRelated] = useState([]);
    
    useEffect(() => {
        
    }, []);

    const head = () => (
        <Head>
            <title>
                {article.title} | {APP_NAME}
            </title>
            <meta name="description" content={article.mdesc} />         
            <meta property="og:title" content={`${article.title}| ${APP_NAME}`} />
            <meta property="og:description" content={article.mdesc} />
            <meta property="og:type" content="webiste" />           
            <meta property="og:site_name" content={`${APP_NAME}`} />

            <meta property="og:image" content={`${API}/articles/photo/${article.slug}`} />
            <meta property="og:image:secure_url" ccontent={`${API}/articles/photo/${article.slug}`} />
            <meta property="og:image:type" content="image/jpg" />           
        </Head>
    );

    const showArticleCategories = article =>
    article.categories.map((a, i) => (
            <Link key={i} href={`/categories/${a.slug}`}>
                <a className="btn btn-primary mr-1 ml-1 mt-3">{a.name}</a>
            </Link>
        ));
    

    return (
        <React.Fragment>
            {head()}
            <Layout>
                <main>
                    <article>
                        <div className="container-fluid">
                            <section>
                                <div className="row" style={{ marginTop: '-30px' }}>
                                    <img
                                        src={`${API}/articles/photo/${article.slug}`}
                                        alt={article.title}
                                        className="img img-fluid featured-image"
                                    />
                                </div>
                            </section>

                            <section>
                                <div className="container">
                                    <h1 className="display-2 pb-3 pt-3 text-center font-weight-bold">{article.title}</h1>
                                    <p className="lead mt-3 mark">
                                        Written by {article.postedBy.name} | Published {moment(article.updatedAt).fromNow()}
                                    </p>

                                    <div className="pb-3">
                                        {showArticleCategories(article)}                                        
                                        <br />
                                        <br />
                                    </div>
                                </div>
                            </section>
                        </div>

                        <div className="container">
                            <section>
                                <div className="col-md-12 lead">{renderHTML(article.body)}</div>
                            </section>
                        </div>                        

                        <div className="container pb-5">
                            <p>show comments</p>
                        </div>
                    </article>
                </main>
            </Layout>
        </React.Fragment>
    );
};

SingleArticle.getInitialProps = ({ query }) => {
    return singleArticle(query.slug).then(data => {
        if (data.error) {
            console.log(data.error);
        } else {            
            return { article: data, query };
        }
    });
};

export default SingleArticle;
