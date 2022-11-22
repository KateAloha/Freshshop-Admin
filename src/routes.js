import React from 'react'


const ProductTypes = React.lazy(() => import('./views/ProductTypes/ProductTypes'))
const Products = React.lazy(() => import('./views/Products/Products'))
const Customers = React.lazy(() => import('./views/Customers/Customers'))
const Orders = React.lazy(() => import('./views/Orders/Orders'))
const ProductTypeDetail = React.lazy(() => import('./views/ProductTypes/ProductTypeDetail'))
const ProductDetail = React.lazy(() => import('./views/Products/ProductDetail'))
const OrderDetail = React.lazy(() => import('./views/Orders/OrderDetail'))
const CustomerDetail = React.lazy(() => import('./views/Customers/CustomerDetail'))
const Dashboard = React.lazy(() => import('./views/Dashboards/Dashboard'))

const routes = [
  { path: '/producttypes', name: 'PRODUCT TYPES', element: ProductTypes },
  { path: '/products', name: 'PRODUCTS', element: Products },
  { path: '/customers', name: 'CUSTOMERS', element: Customers },
  { path: '/orders', name: 'ORDERS', element: Orders },
  { path: '/dashboard', name: 'PERFORMANCE CHART', element: Dashboard },
  { path: '/producttypes/:paramId', name: 'PRODUCT TYPES DETAIL', element: ProductTypeDetail},
  { path: '/products/:paramId', name: 'PRODUCT TYPES DETAIL', element: ProductDetail},
  { path: '/orders/:paramId', name: 'PRODUCT TYPES DETAIL', element: OrderDetail},
  { path: '/customers/:paramId', name: 'CUSTOMERS', element: CustomerDetail},
]

export default routes
