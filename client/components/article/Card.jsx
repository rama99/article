import Link from 'next/link';
import renderHTML from 'react-render-html';
import moment from 'moment';
import { API } from '../../config';

const Card = ({ article }) => {


    const showArticleCategories = article =>
        article.categories.map((c, i) => (
            <Link key={i} href={`/categories/${c.slug}`}>
                <a className="btn btn-primary mr-1 ml-1 mt-3">{c.name}</a>
            </Link>
        ));
  

    return (
        <div className="lead pb-4">
            <header>
                <Link href={`/articles/${article.slug}`}>
                    <a>
                        <h2 className="pt-3 pb-3 font-weight-bold">{article.title}</h2>
                    </a>
                </Link>
            </header>
            <section>
                <p className="mark ml-1 pt-2 pb-2">
                    Written by {article.postedBy.name} | Published {moment(article.updatedAt).fromNow()}
                </p>
            </section>
            <section>
                {showArticleCategories(article)}               
                <br />
                <br />
            </section>

            <div className="row">
                <div className="col-md-4">
                    <section>
                        <img
                            className="img img-fluid"
                            style={{ maxHeight: '150px', width: 'auto' }}
                            src={`${API}/articles/photo/${article.slug}`}
                            alt={article.title}
                        />
                    </section>
                </div>
                <div className="col-md-8">
                    <section>
                        <div className="pb-3">{renderHTML(article.excerpt)}</div>
                        <Link href={`/articles/${article.slug}`}>
                            <a className="btn btn-primary pt-2">Read more</a>
                        </Link>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Card;
