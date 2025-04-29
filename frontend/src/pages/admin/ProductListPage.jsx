import { Link } from 'react-router-dom';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetProductsQuery, useCreateProductMutation, useDeleteProductMutation } from '../../slices/productApiSlice';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import Paginate from '../../components/Paginate';

const ProductListPage = () => {
	const {pageNumber} = useParams();

	const { data, isLoading, error, refetch } = useGetProductsQuery({pageNumber});

	const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();

	const [deleteProduct, {isLoading: loadingDelete}] = useDeleteProductMutation();

	const deleteHandler = async (id) => {
		if (window.confirm('Are you sure you want to delete this product?')) {
			try{
				await deleteProduct(id).unwrap()
				refetch()
				toast.success('Product deleted successfully');
			} catch (error) {
				toast.error(error?.data?.message || error.error);
			}
		}
	}

	const createHandler = async () => { 
		if (window.confirm('Are you sure you want to create a new product?')) {
			try {
				await createProduct();
				refetch();
			} catch (error) {
				alert(error?.data?.message || error.error);
			}
		}
	}

  return (
	<>
	<Row className='align-items-center'>
		<Col>
			<h1>Products</h1>
		</Col>
		<Col className='text-end'>
			<Button className='btn-sm m-3' onClick={createHandler}>
				<FaEdit/> Create Product
			</Button>
		</Col>
	</Row>
	{isCreating && <Loader />}
	{loadingDelete && <Loader />}
	{isLoading ? <Loader /> : error ? (<Message variant='danger'>{error?.data?.message || error.error}</Message>) : (
		<>
		<Table>
			<thead>
				<tr>
					<th>ID</th>
					<th>NAME</th>
					<th>PRICE</th>
					<th>CATEGORY</th>
					<th>BRAND</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{data.products.map((product) => (
					<tr key={product._id}>
						<td>{product._id}</td>
						<td>{product.name}</td>
						<td>${product.price}</td>
						<td>{product.category}</td>
						<td>{product.brand}</td>
						<td>
							<Button as={Link} to={`/admin/product/${product._id}/edit`} className='btn-sm mx-2'>
								<FaEdit />
							</Button>
							<Button className='btn-sm' variant='danger' onClick={()=>deleteHandler(product._id)}>
								<FaTrash style={{color:'white'}}/>
							</Button>
						</td>
					</tr>
				))}
			</tbody>
		</Table>
		<Paginate pages={data.pages} page={data.page} isAdmin={true} />
		</>
	)}
	</>
  )
}

export default ProductListPage