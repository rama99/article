import Head from 'next/head';
import Link from 'next/link';
import { withRouter } from 'next/router';
import Layout from '../components/Layout';
import { useState } from 'react';
import { listArticlesWithCategories  } from '../actions/article';
import Card from '../components/article/Card';
import { API,  APP_NAME  } from '../config';

const Index = ({ articles, categories,  totalArticles, articlesLimit, articleSkip, router }) => {
    const head = () => (
        <Head>
            <title>Programming Articles | {APP_NAME}</title>
            <meta
                name="description"
                content="Programming blogs and tutorials on react node next vue php laravel and web developoment"
            />            
            <meta property="og:title" content={`Latest web developoment tutorials | ${APP_NAME}`} />
            <meta
                property="og:description"
                content="Programming blogs and tutorials on react node next vue php laravel and web developoment"
            />
            <meta property="og:type" content="webiste" />           
            <meta property="og:site_name" content={`${APP_NAME}`} />            
            <meta property="og:image:type" content="image/jpg" />            
        </Head>
    );

    const [limit, setLimit] = useState(articlesLimit);
    const [skip, setSkip] = useState(0);
    const [size, setSize] = useState(totalArticles);
    const [loadedArticles, setLoadedArticles] = useState([]);

    const loadMore = () => {
        let toSkip = skip + limit;
        listArticlesWithCategories(toSkip, limit).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                setLoadedArticles([...loadedArticles, ...data.articles]);
                setSize(data.size);
                setSkip(toSkip);
            }
        });
    };

    const loadMoreButton = () => {
        return (
            size > 0 &&
            size >= limit && (
                <button onClick={loadMore} className="btn btn-outline-primary btn-lg">
                    Load more
                </button>
            )
        );
    };

    const showAllArticles = () => {
        return articles.map((article, i) => {
            // ()
            return (
                <article key={i}>
                    <Card article={article} />
                    <hr />
                </article>
            );
        });
    };

    const showAllCategories = () => {
        return categories.map((c, i) => (
            <Link href={`/categories/${c.slug}`} key={i}>
                <a className="btn btn-primary mr-1 ml-1 mt-3">{c.name}</a>
            </Link>
        ));
    };


    const showLoadedArticles = () => {
        return loadedArticles.map((article, i) => (
            <article key={i}>
                <Card article={article} />
            </article>
        ));
    };

    return (
        <React.Fragment>
            {head()}
            <Layout>
                <main>
                    <div className="container-fluid">
                        <header>
                            <div className="col-md-12 pt-3">
                                <h1 className="display-4 font-weight-bold text-center">
                                    Programming articles and tutorials
                                </h1>
                            </div>
                            <section>
                                <div className="pb-5 text-center">
                                    {showAllCategories()}
                                    <br />                                    
                                </div>
                            </section>
                        </header>
                    </div>
                    <div className="container-fluid">{showAllArticles()}</div>
                    <div className="container-fluid">{showLoadedArticles()}</div>
                    <div className="text-center pt-5 pb-5">{loadMoreButton()}</div>
                </main>
            </Layout>
        </React.Fragment>
    );
};

Index.getInitialProps = () => {

    console.log(`BLOGS@@@@@@@@@@@@@@`);
    let skip = 0;
    let limit = 1;
    return listArticlesWithCategories(skip, limit).then(data => {
        if (data.error) {
            console.log(data.error);
        } else {
            return {
                articles: data.articles,
                categories: data.categories,               
                totalArticles: data.size,
                articlesLimit: limit,
                articlesSkip: skip
            };
        }
    });
};

export default withRouter(Index);
