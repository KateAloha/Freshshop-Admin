import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCol, CCardHeader, CRow } from '@coreui/react'
import { Grid, TextField, FormLabel, Button } from '@mui/material'
import {
    CChartBar,
    CChartDoughnut,
    CChartLine,
    CChartPie,
    CChartPolarArea,
    CChartRadar,
} from '@coreui/react-chartjs'
import { useDispatch, useSelector } from 'react-redux'
import { getOrderAction } from 'src/actions/OrderAction'

const Dashboard = () => {

    const dispatch = useDispatch()
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [dayList, setDayList] = useState([])
    const [orderList, setOrderList] = useState([])
    const [revenueList, setRevenueList] = useState([])
    const [productList, setProductList] = useState([])
    const [typeList, setTypeList] = useState([])
    const [orderProductList, setOrderProductList] = useState([])
    const [orderTypeList, setOrderTypeList] = useState([])
    const [revenueProductList, setRevenueProductList] = useState([])
    const [revenueTypeList, setRevenueTypeList] = useState([])
    const { order } = useSelector((reduxData) => reduxData.orderReducer)

    const getDaysArray = function (start, end) {
        for (var arr = [], dt = new Date(start); dt <= new Date(end); dt.setDate(dt.getDate() + 1)) {
            arr.push(new Date(dt).toLocaleDateString());
        }
        return arr;
    }

    const onStartDateChange = (e) => {
        setStartDate(e.target.value)
    }

    const onEndDateChange = (e) => {
        setEndDate(e.target.value)
    }

    const onFilterClick = () => {
        let dayList = getDaysArray(new Date(startDate), new Date(endDate))

        for (var orderArr = [], revenueArr = [], orderIncludesList = [], i = 0; i < dayList.length; i++) {
            let orderSum = 0
            let revenueSum = 0
            for (var y = 0; y < order.length; y++) {
                if (dayList[i] === order[y].orderDate) {
                    orderSum += 1
                    revenueSum += Number(order[y].cost)
                    orderIncludesList.push(order[y])
                }
            }
            orderArr.push(orderSum)
            revenueArr.push(revenueSum)
        }


        for (var i = 0, productArr = [], typeArr = []; i < orderIncludesList.length; i++) {
            for (var y = 0; y < orderIncludesList[i].orderDetails.length; y++) {
                if (!(productArr.includes(orderIncludesList[i].orderDetails[y].product.name))) {
                    productArr.push(orderIncludesList[i].orderDetails[y].product.name)
                }
                if (!typeArr.includes(orderIncludesList[i].orderDetails[y].product.type.name)) {
                    typeArr.push(orderIncludesList[i].orderDetails[y].product.type.name)
                }
            }
        }


        for (var i = 0, orderProductArr = [], revenueProductArr = []; i < productArr.length; i++) {
            let orderProductSum = 0
            let revenueProductSum = 0
            for (var y = 0; y < orderIncludesList.length; y++) {
                for (var z = 0; z < orderIncludesList[y].orderDetails.length; z++) {
                    if (productArr[i] === orderIncludesList[y].orderDetails[z].product.name) {
                        orderProductSum += 1
                        revenueProductSum += Number(orderIncludesList[y].orderDetails[z].product.promotionPrice)
                    }
                }
            }
            orderProductArr.push(orderProductSum)
            revenueProductArr.push(revenueProductSum)
        }

        for (var i = 0, orderTypeArr = [], revenueTypeArr = []; i < typeArr.length; i++) {
            let orderTypeSum = 0
            let revenueTypeSum = 0
            for (var y = 0; y < orderIncludesList.length; y++) {
                for (var z = 0; z < orderIncludesList[y].orderDetails.length; z++) {
                    if (typeArr[i] === orderIncludesList[y].orderDetails[z].product.type.name) {
                        orderTypeSum += 1
                        revenueTypeSum += Number(orderIncludesList[y].orderDetails[z].product.promotionPrice)
                    }
                }
            }
            orderTypeArr.push(orderTypeSum)
            revenueTypeArr.push(revenueTypeSum)
        }

        setOrderList(orderArr)
        setRevenueList(revenueArr)
        setDayList(dayList)
        setProductList(productArr)
        setTypeList(typeArr)
        setOrderProductList(orderProductArr)
        setRevenueProductList(revenueProductArr)
        setOrderTypeList(orderTypeArr)
        setRevenueTypeList(revenueTypeArr)
    }

    useEffect(() => {
        dispatch(getOrderAction())
    }, [])


    return (
        <>
            <Grid container mt={2} mb={4} >
                <Grid item xs={2} sm={2} md={2} lg={2} pt={1}>
                    <FormLabel>Start Date :</FormLabel>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={3} pr={2}>
                    <TextField fullWidth variant="outlined" type="date" onChange={onStartDateChange} value={startDate}></TextField>
                </Grid>
                <Grid item xs={2} sm={2} md={2} lg={2} pt={1} pl={2}>
                    <FormLabel>End Date :</FormLabel>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={3}>
                    <TextField fullWidth id="outlined-basic" type="date" onChange={onEndDateChange} value={endDate} />
                </Grid>
                <Grid item xs={2} sm={2} md={2} lg={2} >
                    <Button variant="contained" style={{ float: "right" }} onClick={onFilterClick}>Filter</Button>
                </Grid>
            </Grid>
            <CRow >
                <CCol xs={6}>
                    <CCard className="mb-4">
                        <CCardHeader>REVENUE CHART</CCardHeader>
                        <CCardBody>
                            <CChartBar
                                data={{
                                    labels: dayList,
                                    datasets: [
                                        {
                                            label: 'REVENUE',
                                            backgroundColor: '#f87979',
                                            data: revenueList,
                                        },
                                    ],
                                }}
                                labels="days"
                            />
                        </CCardBody>
                    </CCard>
                </CCol>
                <CCol xs={6}>
                    <CCard className="mb-4">
                        <CCardHeader>ORDER CHART</CCardHeader>
                        <CCardBody>
                            <CChartLine
                                data={{
                                    labels: dayList,
                                    datasets: [
                                        {
                                            label: 'ORDER',
                                            backgroundColor: 'rgba(151, 187, 205, 0.2)',
                                            borderColor: 'rgba(151, 187, 205, 1)',
                                            pointBackgroundColor: 'rgba(151, 187, 205, 1)',
                                            pointBorderColor: '#fff',
                                            data: orderList,
                                        },
                                    ],
                                }}
                            />
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
            <CRow >
                <CCol xs={6}>
                    <CCard className="mb-4">
                        <CCardHeader>REVENUE PRODUCT CHART</CCardHeader>
                        <CCardBody>
                            <CChartBar
                                data={{
                                    labels: productList,
                                    datasets: [
                                        {
                                            label: 'REVENUE',
                                            backgroundColor: '#f87979',
                                            data: revenueProductList,
                                        },
                                    ],
                                }}
                                labels="days"
                            />
                        </CCardBody>
                    </CCard>
                </CCol>
                <CCol xs={6}>
                    <CCard className="mb-4">
                        <CCardHeader>ORDER PRODUCT CHART</CCardHeader>
                        <CCardBody>
                            <CChartLine
                                data={{
                                    labels: productList,
                                    datasets: [
                                        {
                                            label: 'ORDER',
                                            backgroundColor: 'rgba(151, 187, 205, 0.2)',
                                            borderColor: 'rgba(151, 187, 205, 1)',
                                            pointBackgroundColor: 'rgba(151, 187, 205, 1)',
                                            pointBorderColor: '#fff',
                                            data: orderProductList,
                                        },
                                    ],
                                }}
                            />
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
            <CRow>
                <CCol xs={6}>
                    <CCard className="mb-4">
                        <CCardHeader>REVENUE BY PRODUCT TYPES</CCardHeader>
                        <CCardBody>
                            <CChartDoughnut
                                data={{
                                    labels: typeList,
                                    datasets: [
                                        {
                                            backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
                                            data: revenueTypeList,
                                        },
                                    ],
                                }}
                            />
                        </CCardBody>
                    </CCard>
                </CCol>
                <CCol xs={6}>
                    <CCard className="mb-4">
                        <CCardHeader>ORDER BY PRODUCT TYPES</CCardHeader>
                        <CCardBody>
                            <CChartDoughnut
                                data={{
                                    labels: typeList,
                                    datasets: [
                                        {
                                            backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
                                            data: orderTypeList,
                                        },
                                    ],
                                }}
                            />
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

        </>
    )
}

export default Dashboard