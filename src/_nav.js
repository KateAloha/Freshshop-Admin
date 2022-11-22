import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavTitle,
    name: 'Shop 24h Admin Page',
  },
  {
    component: CNavItem,
    name: 'PRODUCT TYPES',
    to: '/producttypes',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'PRODUCTS',
    to: '/products',
    icon: <CIcon icon={cilBell} customClassName="nav-icon" />,

  },
  {
    component: CNavItem,
    name: 'CUSTOMERS',
    to: '/customers',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'ORDERS',
    to: '/orders',
    icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'PERFORMANCE CHART',
    to: '/dashboard',
    icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
  }
]

export default _nav
