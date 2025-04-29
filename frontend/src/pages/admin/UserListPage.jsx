import { Link } from 'react-router-dom';
import { Table, Button } from 'react-bootstrap';
import { FaTimes, FaTrash, FaEdit, FaCheck } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetUsersQuery, useDeleteUserMutation } from '../../slices/usersApiSlice';
import { toast } from 'react-toastify';

const UserListPage = () => {

  const { data: users, isLoading, refetch, error } = useGetUsersQuery();
  const [ deleteUser ] = useDeleteUserMutation();

  const deleteHandler = async (userId) => {
	if (window.confirm('Are you sure you want to delete this user?')) {
	  try {
		await deleteUser(userId);
		refetch();
	  } catch (error) {
		toast.error(error?.data?.message || error.error);
	  }
	}
  }

  return (
	<>
    <h1>Users</h1>
    {isLoading? <Loader /> : error ? (<Message variant='danger'>{error?.data?.message || error.error}</Message>) : (
      <Table striped hover responsive className='table-sm'>
        <thead>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>EMAIL</th>
            <th>ADMIN</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
			  <td>{user._id}</td>
              <td>{user.name}</td>
              <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
              <td>
                {user.isAdmin ? (
                  <FaCheck style={{color:'green'}}></FaCheck>
                ) : (
                  <FaTimes style={{color:'red'}}></FaTimes>
                )}
              </td>
              <td>
                <Button as={Link} to={`/admin/user/${user._id}/edit`} className='btn-sm mx-2'>
                  <FaEdit />
                </Button>
				<Button variant='danger' className='btn-sm' onClick={() => deleteHandler(user._id)}>
				  <FaTrash style={{color:'white'}}/>
				</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    )}
    </>
  )
}

export default UserListPage