import { Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const CheckoutSteps = ({step1, step2, step3, step4}) => {
  return (
	<Nav className="justify-content-center mb-4">
	  <Nav.Item>
		<Nav.Link as={Link} to="/login" disabled={!step1}>
		  Sign In
		</Nav.Link>
	  </Nav.Item>
	  <Nav.Item>
		<Nav.Link as={Link} to="/shipping" disabled={!step2}>
		  Shipping
		</Nav.Link>
	  </Nav.Item>
	  <Nav.Item>
		<Nav.Link as={Link} to="/payment" disabled={!step3}>
		  Payment
		</Nav.Link>
	  </Nav.Item>
	  <Nav.Item>
		<Nav.Link as={Link} to="/placeorder" disabled={!step4}>
		  Place Order
		</Nav.Link>
	  </Nav.Item>
	</Nav>
  )
}

export default CheckoutSteps