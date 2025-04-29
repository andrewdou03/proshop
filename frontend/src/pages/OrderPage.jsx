import { Link, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useGetOrderDetailsQuery } from '../slices/ordersApiSlice';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { usePayOrderMutation, useGetPaypalClientIdQuery } from '../slices/ordersApiSlice';
import { useUpdateToDeliveredMutation } from '../slices/ordersApiSlice';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

const OrderPage = () => {
	const { id: orderId } = useParams();
	const { data: order, isLoading, error, refetch } = useGetOrderDetailsQuery(orderId);
	console.log(order);
	const [ payOrder, { isLoading: isPaying }] = usePayOrderMutation();
	const [ updateToDelivered, { isLoading: isDelivering }] = useUpdateToDeliveredMutation();
	const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
	const { userInfo } = useSelector((state) => state.auth);
	const { data: paypal, isLoading: loadingPaypal, error:errorPaypal } = useGetPaypalClientIdQuery();

	useEffect(() => {
		clg('trying')
		if (!errorPaypal && !loadingPaypal && paypal.clientId) {
			console.log(paypal.clientId);
			const loadPaypalScript = async () => {
			paypalDispatch({
				type: 'resetOptions',
				value: {
					'client-id': paypal.clientId,
					currency: 'USD',
				},
				'data-client-token': 'true', // add this for debugging
			});
			paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
			}
			if (order && !order.isPaid) {
				if (!window.paypal) {
					loadPaypalScript();
				}
			}
		} else {
			console.error('Error loading PayPal client ID:', errorPaypal);
		}
	}
	, [order, paypal, errorPaypal, loadingPaypal, paypalDispatch]);

	const onApprove = async (data, actions) => {
		return actions.order.capture().then(async (details) => {
			try {
				await payOrder({ orderId, details }).unwrap();
				toast.success('Order Paid Successfully');
			} catch (error) {
				toast.error(error?.data?.message || error.error);
			}
		})
	}
	const onError = (error) => {
		toast.error('Error with PayPal: ' + error.message);
	}
	const createOrder = async (data, actions) => {
		return actions.order.create({
			purchase_units: [{
				amount: {
					value: order.totalPrice,
				},
			}],
		}).then((orderId) => {
			return orderId;
		})
	}

	const deliverHandler = async () => {
			try {
				await updateToDelivered(orderId).unwrap();
				refetch();
				toast.success('Order marked as delivered');
			} catch (error) {
				toast.error(error?.data?.message || error.error);
			}
	}

  return isLoading ? ( <Loader /> ) : error ? (<Message variant='danger'>{error?.data?.message || 'Something went wrong'}</Message>) : (
	<>
		<h1>
			Order {order._id}
		</h1>
		<Row>
			<Col md={8}>
				<ListGroup>
					<ListGroup.Item>
						<h2>Shipping</h2>
						<p>
							<strong>Name:</strong> {order.user.name}
						</p>
						<p>
							<strong>Email:</strong> <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
						</p>
						<p>
							<strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
						</p>
						{order.isDelivered ? (
							<Message variant='success'>Delivered on {order.deliveredAt}</Message>
						) : (
							<Message variant='danger'>Not Delivered</Message>
						)}
					</ListGroup.Item>

					<ListGroup.Item>
						<h2>Payment Method</h2>
						<p><strong>Method:</strong> {order.paymentMethod}</p>
						{order.isPaid ? (
							<Message variant='success'>Paid on {order.paidAt}</Message>
						) : (
							<Message variant='danger'>Not Paid</Message>
						)}
					</ListGroup.Item>

					<ListGroup.Item>
						<h2>Order Items</h2>
						{order.orderItems.length === 0 ? <Message>Your order is empty</Message> : (
							<ListGroup variant='flush'>
								{order.orderItems.map((item, index) => (
									<ListGroup.Item key={index}>
										<Row>
											<Col md={1}>
												<Image src={item.image} alt={item.name} fluid rounded />
											</Col>
											<Col>
												<Link to={`/product/${item.product}`}>{item.name}</Link>
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
					<ListGroup variant='flush'>
						<ListGroup.Item>
							<h2>Order Summary</h2>
						</ListGroup.Item>
						<ListGroup.Item>
							<Row>
								<Col>Items:</Col>
								<Col>${order.itemsPrice}</Col>
							</Row>
						</ListGroup.Item>
						<ListGroup.Item>
							<Row>
								<Col>Shipping:</Col>
								<Col>${order.shippingPrice}</Col>
							</Row>
						</ListGroup.Item>
						<ListGroup.Item>
							<Row>
								<Col>Tax:</Col>
								<Col>${order.taxPrice}</Col>
							</Row>
						</ListGroup.Item>
						<ListGroup.Item>
							<Row>
								<Col>Total:</Col>
								<Col>${order.totalPrice}</Col>
							</Row>
						</ListGroup.Item>
						{!order.isPaid && (
							<ListGroup.Item>
								{isPaying && <Loader/>}
								{isPending ? (<Loader/>) : (
									<div>
										{/* <Button onClick={onApproveTest} style={{marginBottom:"10px"}}>
											Test Pay Order
										</Button> */}
										<div>
											<PayPalButtons 
												createOrder={createOrder}
												onApprove={onApprove}
												onErrorHandler={onError}>
											</PayPalButtons>
										</div>
									</div>
								)}
							</ListGroup.Item>
						)}

						{isDelivering && <Loader />}
						{userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
							<ListGroup.Item>
								<Button
									type='button'
									className='btn btn-block'
									onClick={deliverHandler}
								>
									Mark as Delivered
								</Button>
							</ListGroup.Item>
						)}
					</ListGroup>
				</Card>
			</Col>
		</Row>
	</>
  )
}

export default OrderPage