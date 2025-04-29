import { PRODUCTS_URL } from "../constants";
import {apiSlice} from "./apiSlice";



export const productSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getProducts: builder.query({
			query: ({keyword, pageNumber}) => ({
				url: PRODUCTS_URL,
				params: {keyword, pageNumber},
			}),
			keepUnusedDataFor: 5,
			providesTags: ['Products'],
		}),
		getProductDetails: builder.query({
			query: (id) => ({
				url: `${PRODUCTS_URL}/${id}`,
			}),
			keepUnusedDataFor: 5,
		}),
		createProduct: builder.mutation({
			query: () => ({
				url: PRODUCTS_URL,
				method: 'POST',
				invalidateTags: ['Product'],
			})
		}),
		updateProduct: builder.mutation({
			query: (data) => ({
				url: `${PRODUCTS_URL}/${data.productId}`,
				method: 'PUT',
				body: data,
				invalidateTags: ['Products'],
			})
		}),
		uploadProductImage: builder.mutation({
			query: (data) => ({
				url: '/api/upload',
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['Products'],
		}),
		deleteProduct: builder.mutation({
			query: (id) => ({
				url: `${PRODUCTS_URL}/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Products'],
		}),
		createReview: builder.mutation({
			query: ({productId, rating, comment}) => ({
				url: `${PRODUCTS_URL}/${productId}/reviews`,
				method: 'POST',
				body: {rating, comment},
				headers: { 'Content-Type': 'application/json' }
			}),
			invalidatesTags: ['Product'],
		}),
		getTopProducts: builder.query({
			query: () => ({
				url: `${PRODUCTS_URL}/top`,
			}),
			providesTags: ['Products'],
			keepUnusedDataFor: 5,
		}),
	})
})

export const { 
	useGetProductsQuery, 
	useGetProductDetailsQuery, 
	useCreateProductMutation, 
	useUpdateProductMutation, 
	useUploadProductImageMutation, 
	useDeleteProductMutation, 
	useCreateReviewMutation, 
	useGetTopProductsQuery 
} = productSlice;