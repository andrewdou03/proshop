import {Container, Row, Col} from 'react-bootstrap'

function Footer() {
	const currentYear = new Date().getFullYear();
  return (
	<footer>
		<Container>
			<Row>
				<Col className="text-center py-3">
					<p>&copy; {currentYear} ProShop. All Rights Reserved.</p>
				</Col>
			</Row>
		</Container>
	</footer>
  )
}

export default Footer