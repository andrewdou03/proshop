import {apiSlice} from './apiSlice';
import {ORDERS_URL, PAYPAL_URL} from '../constants';

export const ordersApiSlice = apiSlice.injectEndpoints({
	  endpoints: (builder) => ({
		getOrders: builder.query({
		query: () => ({
			url: ORDERS_URL,
		}),
		keepUnusedDataFor: 5,
		}),
		getOrderDetails: builder.query({
		query: (orderId) => ({
			url: `${ORDERS_URL}/${orderId}`,
		}),
		keepUnusedDataFor: 5,
		}),
		createOrder: builder.mutation({
		query: (order) => ({
			url: ORDERS_URL,
			method: 'POST',
			body: {...order},
			headers: { 'Content-Type': 'application/json' },
		}),
		keepUnusedDataFor: 5,
		}),
		updateOrderToPaid: builder.mutation({
		query: (orderId) => ({
			url: `${ORDERS_URL}/${orderId}/pay`,
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
		}),
		keepUnusedDataFor: 5,
		}),
		payOrder: builder.mutation({
		query: ({orderId, details}) => ({
			url: `${ORDERS_URL}/${orderId}/pay`,
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: { ...details },
		}),
		keepUnusedDataFor: 5,
		}),
		getPaypalClientId: builder.query({
		query: () => ({
			url: PAYPAL_URL,
		}),
		keepUnusedDataFor: 5,
		}),
		getMyOrders: builder.query({
			query: () => ({
				url: `${ORDERS_URL}/myorders`,
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			}),
			keepUnusedDataFor: 5,
		}),
		updateToDelivered: builder.mutation({
			query: (orderId) => ({
				url: `${ORDERS_URL}/${orderId}/deliver`,
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
			}),
			keepUnusedDataFor: 5,
		}),
	}),
});

export const { useGetOrdersQuery, useGetOrderDetailsQuery, useCreateOrderMutation, usePayOrderMutation, useGetPaypalClientIdQuery, useGetMyOrdersQuery, useUpdateToDeliveredMutation } = ordersApiSlice;