import {Row, Col} from 'react-bootstrap'
import Product from '../components/Product'
import { useParams } from 'react-router-dom'
import { useGetProductsQuery } from '../slices/productApiSlice'
import { Link } from 'react-router-dom'
import Paginate from '../components/Paginate'
import Loader from '../components/Loader'
import Message from '../components/Message'
import ProductCarousel from '../components/ProductCarousel'


const Home = () => {
	const { pageNumber, keyword } = useParams()

	const {data, isLoading, error} = useGetProductsQuery({keyword, pageNumber})

  return (
	<>
	{!keyword ? <ProductCarousel/> : <Link to='/' className='btn btn-light'>Go Back</Link>}
	{isLoading ? (<h2><Loader/></h2>) : error ? (<Message variant='danger'>{error?.data?.message || error.error}</Message>) :(<>
		<h1>Latest Products</h1>
		<Row>
			{data.products.map ((product) => (
				<Col sm={12} md={6} lg={4} xl={3}>
					<div className="product">
						<Product product={product} key={product._id} />
					</div>
				</Col>
			)
			)}
		</Row>
		<Paginate pages={data.pages} page={data.page} keyword={keyword ? keyword : ''}/>
	</>)}
	</>
  )
}

export default Home