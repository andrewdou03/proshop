import { USERS_URL } from "../constants";
import {apiSlice} from "./apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		login: builder.mutation({
			query: (data) => ({
				url: `${USERS_URL}/login`,
				method: 'POST',
				body: data,
				headers: { 'Content-Type': 'application/json' }
			}),
			keepUnusedDataFor: 5,
		}),
		logout: builder.mutation({
			query: () => ({
				url: `${USERS_URL}/logout`,
				method: 'POST',
			}),
			keepUnusedDataFor: 5,
		}),
		register: builder.mutation({
			query: (data) => ({
				url: USERS_URL,
				method: 'POST',
				body: data,
				headers: { 'Content-Type': 'application/json' }
			}),
			keepUnusedDataFor: 5,
		}),
		profile: builder.mutation({
			query:(data) => ({
				url: `${USERS_URL}/profile`,
				method: 'PUT',
				body: data,
				headers: { 'Content-Type': 'application/json'}
			}),
		}),
		getUsers: builder.query({
			query: () => ({
				url: USERS_URL,
			}),
			providesTags: ['Users'],
			keepUnusedDataFor: 5,
		}),
		getUser: builder.query({
			query: (id) => ({
				url: `${USERS_URL}/${id}`,
			}),
			providesTags: (result, error, id) => [{ type: 'User', id }],
		}),
		deleteUser: builder.mutation({
			query: (id) => ({
				url: `${USERS_URL}/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Users'],
			keepUnusedDataFor: 5,
		}),
		updateUser: builder.mutation({
			query: (data) => ({
				url: `${USERS_URL}/${data.userId}`,
				method: 'PUT',
				body: data,
				headers: { 'Content-Type': 'application/json' }
			}),
			invalidatesTags: ['Users'],
		}),
		getUserDetails: builder.query({
			query: (id) => ({
				url: `${USERS_URL}/${id}`,
			}),
			providesTags: (result, error, id) => [{ type: 'User', id }],
			keepUnusedDataFor: 5,
		}),
	})
})

export const { useLoginMutation, useLogoutMutation, useRegisterMutation, useProfileMutation, useGetUsersQuery, useGetUserQuery, useDeleteUserMutation, useUpdateUserMutation, useGetUserDetailsQuery } = usersApiSlice;