import {Link,useNavigate} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {Row, Col, ListGroup, Image, Form, Button, Card} from 'react-bootstrap'
import { FaTrash } from 'react-icons/fa'
import Message from '../components/Message'
import {addToCart, removeFromCart} from '../slices/cartSlice'

function CartPage() {
	const navigate = useNavigate()
	const dispatch = useDispatch()

	const cart = useSelector((state) => state.cart)

	const { cartItems, itemsPrice, shippingPrice, taxPrice, totalPrice } = cart

	const addToCartHandler = async(item, qty) => {
		dispatch(addToCart({ ...item, qty }))
	}
	const removeFromCartHandler = async(id) => {
		dispatch(removeFromCart(id))
	}

  return (
	<Row>
		<Col md={8}>
			<h1 style={{marginBottom: "20px"}}>Shopping Cart</h1>
			{ cartItems.length === 0 ? (
				<Message>
					Your cart is empty. <Link to="/">Go Back</Link>
				</Message>
			) : (
				<ListGroup variant="flush">
					{cartItems.map((item) => (
						<ListGroup.Item key={item._id}>
							<Row>
								<Col md={2}>
									<Image src={item.image} alt={item.name} fluid rounded />
								</Col>
								<Col md={3}>
									<Link to={`/product/${item._id}`}>{item.name}</Link>
								</Col>
								<Col md={2}>${item.price}</Col>
								<Col md={2}>
									<Form.Control
										as="select"
										value={item.qty}
										onChange={(e) => {addToCartHandler(item, Number(e.target.value))}}
									>
										{[...Array(item.countInStock).keys()].map(x => (
											<option key={x + 1} value={x + 1}>{x + 1}</option>
										))}
									</Form.Control>
								</Col>
								<Col md={2}>
									<Button
										type="button"
										variant="light"
										onClick={() => {removeFromCartHandler(item._id)}}
									>
										<FaTrash />
									</Button>
								</Col>
							</Row>
						</ListGroup.Item>))}
				</ListGroup>
			)}
		</Col>
		<Col md={4}>
			<Card>
				<ListGroup variant='flush'>
					<ListGroup.Item>
						<h2>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items</h2>
						${itemsPrice}
					</ListGroup.Item>
					<ListGroup.Item>
						<Row>
							<Col>Shipping:</Col>
							<Col>${shippingPrice}</Col>
						</Row>
					</ListGroup.Item>
					<ListGroup.Item>
						<Row>
							<Col>Tax:</Col>
							<Col>${taxPrice}</Col>
						</Row>
					</ListGroup.Item>
					<ListGroup.Item>
						<Row>
							<Col>Total:</Col>
							<Col>${totalPrice}</Col>
						</Row>
					</ListGroup.Item>
					<ListGroup.Item className='d-grid'>
						<Button
							type='button'
							className='btn-block'
							onClick={() => navigate('/login?redirect=shipping')}
							disabled={cartItems.length === 0}
						>
							Proceed to Checkout
						</Button>
					</ListGroup.Item>
				</ListGroup>
			</Card>
		</Col>
	</Row>
  )
}

export default CartPage