import { Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Paginate = ({ pages, page, isAdmin = false, keyword = '' }) => {
  return (
    pages > 1 && (
      <Pagination>
        {[...Array(pages).keys()].map((x) => (
          <Pagination.Item active={x + 1 === page} key={x + 1}>
            <Link
              to={
                !isAdmin
                  ? keyword ? `/search/${keyword}/page/${x+1}` : `/page/${x + 1}`
                  : `/admin/productlist/${x + 1}`
              }
              style={{
                textDecoration: 'none',
                color: x + 1 === page ? '#fff' : '#000', // Optional styling for active/non-active links
              }}
            >
              {x + 1}
            </Link>
          </Pagination.Item>
        ))}
      </Pagination>
    )
  );
};

export default Paginate;
