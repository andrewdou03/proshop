import {useCreateOrderMutation} from "../slices/ordersApiSlice";
import {clearCartItems} from "../slices/cartSlice";
import {useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Row, Col, ListGroup, Image, Card, Button} from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import CheckoutSteps from "../components/CheckoutSteps";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import Message from "../components/Message";


const PlaceOrderPage = () => {

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const cart = useSelector((state) => state.cart);
	const { shippingAddress, paymentMethod, cartItems } = cart;

	const [ createOrder, { isLoading, error }] = useCreateOrderMutation();

	useEffect(() => {
		if (!shippingAddress.address) {
			navigate('/shipping');
		} else if (!paymentMethod) {
			navigate('/payment');
		}
	}
	, [shippingAddress, paymentMethod, navigate]);

	const placeOrderHandler = async () => {
		const order = {
			orderItems: cartItems,
			shippingAddress,
			paymentMethod,
			itemsPrice: cart.itemsPrice,
			shippingPrice: cart.shippingPrice,
			taxPrice: cart.taxPrice,
			totalPrice: cart.totalPrice
		};
		try {
			const res = await createOrder(order).unwrap();
			dispatch(clearCartItems());
			navigate(`/order/${res._id}`);
		} catch (error) {
			toast.error(error?.data?.message || error.error);
		}
	}

  return (
	<> 
	<CheckoutSteps step1 step2 step3 step4 />
	<Row>
		<Col md={8}>
			<ListGroup variant="flush">
				<ListGroup.Item>
					<h2>Shipping</h2>
					<p>
						<strong>Address: </strong>
						{shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
					</p>
				</ListGroup.Item>
				<ListGroup.Item>
					<h2>Payment Method</h2>
					<strong>Method: </strong>
					{paymentMethod}
				</ListGroup.Item>
				<ListGroup.Item>
					<h2>Order Items</h2>
					{cartItems.length === 0 ? (
						<Message>Your cart is empty</Message>
					) : (
						<ListGroup variant="flush">
							{cartItems.map((item, index) => (
								<ListGroup.Item key={index}>
									<Row>
										<Col md={1}>
											<Image src={item.image} alt={item.name} fluid rounded />
										</Col>
										<Col>
											<Link to={`/product/${item._id}`}>{item.name}</Link>
										</Col>
										<Col md={4}>
											{item.qty} x ${item.price} = ${item.qty * item.price}
										</Col>
									</Row>
								</ListGroup.Item>
							))}
						</ListGroup>
					)}
				</ListGroup.Item>
			</ListGroup>
		</Col>
		<Col md={4}>
			<Card>
				<ListGroup variant="flush">
					<ListGroup.Item>
						<h2>Order Summary</h2>
					</ListGroup.Item>
					<ListGroup.Item>
						<Row>
							<Col>Items:</Col>
							<Col>${cart.itemsPrice}</Col>
						</Row>
					</ListGroup.Item>
					<ListGroup.Item>
						<Row>
							<Col>Shipping:</Col>
							<Col>${cart.shippingPrice}</Col>
						</Row>
					</ListGroup.Item>
					<ListGroup.Item>
						<Row>
							<Col>Tax:</Col>
							<Col>${cart.taxPrice}</Col>
						</Row>
					</ListGroup.Item>
					<ListGroup.Item>
						<Row>
							<Col>Total:</Col>
							<Col>${cart.totalPrice}</Col>
						</Row>
					</ListGroup.Item>

					<ListGroup.Item>
						{error && <Message variant="danger">{error}</Message>}
					</ListGroup.Item>

					<ListGroup.Item className="d-grid">
						<Button type="button" className="btn-block" disabled={cart.cartItems.length === 0} onClick={placeOrderHandler}>
							Order Now
						</Button>
						{isLoading && <Loader />}
					</ListGroup.Item>

				</ListGroup>
			</Card>
		</Col>
	</Row>
	</>
  )
}

export default PlaceOrderPage