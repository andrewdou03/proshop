import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { useGetUserDetailsQuery, useUpdateUserMutation } from '../../slices/usersApiSlice';
import { toast } from 'react-toastify';

const UserEditPage = () => {
	const { id: userId } = useParams();
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [isAdmin, setIsAdmin] = useState(false);

	const navigate = useNavigate();

	const { data: user, isLoading, refetch, error } = useGetUserDetailsQuery(userId);

	const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

	useEffect(() => {
		if (user) {
			setName(user.name);
			setEmail(user.email);
			setIsAdmin(user.isAdmin);
		}
	}, [user]);

	const submitHandler = async (e) => {
		console.log('trying');
		e.preventDefault();
		try {
			await updateUser({
				userId,
				name,
				email,
				isAdmin,
			}).unwrap();
			refetch();
			toast.success('User updated successfully');
			navigate('/admin/userlist');
		} catch (error) {
			toast.error(error?.data?.message || error.error);
		}
	}

  return (
	<>
	<Link to='/admin/userlist' className='btn btn-light my-3'>Go Back</Link>
	<FormContainer>
		<h1>Edit User</h1>
		{loadingUpdate && <Loader />}
		{isLoading ? (<Loader />) : error ? (<Message variant='danger'>{error?.data?.message || error.error}</Message>) : (
			<Form onSubmit={submitHandler}>
				<Form.Group controlId='name' className="my-4">
					<Form.Label>Name</Form.Label>
					<Form.Control 
						type="name"
						placeholder="Enter user's name"
						value={name}
						onChange={(e) => setName(e.target.value)}
					>
					</Form.Control>
				</Form.Group>
				<Form.Group controlId='email' className="my-4">
					<Form.Label>Email</Form.Label>
					<Form.Control 
						type="email"
						placeholder='Enter email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					>
					</Form.Control>
				</Form.Group>
				<Form.Group controlId='isAdmin' className="my-4">
					<Form.Label>Admin</Form.Label>
					<Form.Check
						type="checkbox"
						placeholder='Is Admin'
						checked={isAdmin}
						onChange={(e) => setIsAdmin(e.target.checked)}
					>
					</Form.Check>
				</Form.Group>
				<Button 
					type='submit' 
					variant='primary'
					className='my-3'
				>
					Update
				</Button>
			</Form>
		)}
	</FormContainer>
	</>
  )
}

export default UserEditPage