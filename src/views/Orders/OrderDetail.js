import { Container, Grid, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button, Pagination, TextField, FormLabel, Snackbar, Alert, FormControl, Modal, Box, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { json, useNavigate, useParams } from "react-router-dom"


const OrderDetail = () => {
    
    const style = {
        position: 'absolute',
        top: '50%',
        left: '60%',
        transform: 'translate(-50%, -50%)',
        width: 500,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    }

    const today = new Date()
    const { paramId } = useParams()
    const navigate = useNavigate()

    const [orderDetailList, setOrderDetailList] = useState([])
    const [buyer, setBuyer] = useState('')
    const [buyerId, setBuyerId] = useState('')
    const [orderDate, setOrderDate] = useState('')
    const [shippedDate, setShippedDate] = useState('')
    const [shippingMethod, setShippingMethod] = useState('')
    const [payment, setPayment] = useState('')
    const [totalCost, setTotalCost] = useState(0)
    const [orderCity, setOrderCity] = useState('')
    const [orderDistrict, setOrderDistrict] = useState('')
    const [orderWard, setOrderWard] = useState('')
    const [orderAddress, setOrderAddress] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [openDeleteModal, setOpenDeleteModal] = useState(false)

    const [addressData, setAddressData] = useState([])
    const [districtData, setDistrictData] = useState([])
    const [wardData, setWardData] = useState([])
    const [updateData, setUpdateData] = useState(0)

    const [alert, setAlert] = useState(false);
    const [textAlert, setTextAlert] = useState('');
    const [alertColor, setAlertColor] = useState('error');

    const noPage = Math.ceil(orderDetailList.length / 10)
    const orderListPag = orderDetailList.slice((currentPage - 1) * 10, currentPage * 10)

    const addressAPI = "https://raw.githubusercontent.com/sunshine-tech/VietnamProvinces/master/vietnam_provinces/data/nested-divisions.json"

    const getAPIOrder = async (paramId, paramBody) => {
        const response = await fetch(`https://freshop-backendcloud.herokuapp.com/orders/${paramId}`, paramBody)
        const data = await response.json()
        return data.order
    }

    const getAPIAddress = async (url) => {
        const response = await fetch(url)
        const data = await response.json()
        setAddressData(data)
        return data
    }

    useEffect(() => {
        getAPIAddress(addressAPI)
        getAPIOrder(paramId).then((data) => {
            setOrderDetailList(data.orderDetails)
            setBuyer(data.buyer.email)
            setOrderDate(data.orderDate)
            setShippedDate(data.shippedDate)
            setShippingMethod(data.shipping)
            setPayment(data.payment)
            setTotalCost(data.cost)
            setOrderCity(data.city)
            setOrderDistrict(data.district)
            setOrderWard(data.ward)
            setOrderAddress(data.address)
            setBuyerId(data.buyer._id)
        }).catch((error) => {
            console.log(error)
        })
    }, [paramId, updateData])

    const changePageHandler = (event, value) => {
        setCurrentPage(value)
    }

    const onOrderShipDateChange = (e) => {
        setShippedDate(e.target.value)

    }

    const onOrderPaymentChange = (e) => {
        setPayment(e.target.value)
    }

    const onOrderCityChange = (e) => {
        setOrderCity(e.target.value)
        let cityName = e.target.value
        if (cityName) {
            const districtData = addressData.find((value) => value.name == cityName)
            setDistrictData(districtData.districts)
        }
    }

    const onOrderDistrictChange = (e) => {
        setOrderDistrict(e.target.value)
        let districtName = e.target.value
        if (districtName) {
            const wardData = districtData.find((value) => value.name == districtName)
            setWardData(wardData.wards)
        }
    }

    const onOrderWardChange = (e) => {
        setOrderWard(e.target.value)
    }

    const onOrderAddressChange = (e) => {
        setOrderAddress(e.target.value)
    }

    const handleCloseAlert = () => setAlert(false);

    const onBtnEditClick = () => {
        var orderDetailUpdateCheck = {
            orderDate: orderDate,
            shippedDate: shippedDate,
            city: orderCity,
            district: orderDistrict,
            ward: orderWard,
            address: orderAddress,
            buyer: buyerId,
            payment: payment,
            shipping: shippingMethod,
            cost: totalCost
        }

        const checkValidate = validateOrder(orderDetailUpdateCheck)
        if (checkValidate) {
            const body = {
                method: "PUT",
                body: JSON.stringify({
                    orderDate: orderDetailUpdateCheck.orderDate,
                    shippedDate: orderDetailUpdateCheck.shippedDate,
                    city: orderDetailUpdateCheck.city,
                    district: orderDetailUpdateCheck.district,
                    ward: orderDetailUpdateCheck.ward,
                    address: orderDetailUpdateCheck.address,
                    buyer: orderDetailUpdateCheck.buyer,
                    payment: orderDetailUpdateCheck.payment,
                    shipping: orderDetailUpdateCheck.shipping,
                    cost: orderDetailUpdateCheck.cost
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                }
            }
            getAPIOrder(paramId, body)
                .then((data) => {
                    setAlert(true)
                    setAlertColor("success")
                    setTextAlert("Update Order ID: " + paramId + " successfully!")
                    setUpdateData(updateData + 1)
                }).catch((error) => {
                    console.log(error)
                    setAlert(true)
                    setAlertColor("error")
                    setTextAlert("Update Order ID: " + paramId + " fail!, ERROR: " + error)
                    setUpdateData(updateData + 1)
                })
        }
    }

    const validateOrder = (paramOrderDetail) => {
        var date_regex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
        if (paramOrderDetail.shippedDate === "") {
            setAlert(true)
            setAlertColor("error")
            setTextAlert("Ship Date is required!")
            return false
        } else if (!(date_regex.test(paramOrderDetail.shippedDate))) {
            setAlert(true)
            setAlertColor("error")
            setTextAlert("Ship Date is invalid, Please follow the format MM/DD/YYYY!")
            return false
        } else if (new Date(paramOrderDetail.orderDate) > new Date(paramOrderDetail.shippedDate)) {
            setAlert(true)
            setAlertColor("error")
            setTextAlert("Order Date is over Ship Date, please check again!")
            return false
        } else if (paramOrderDetail.address === "") {
            setAlert(true)
            setAlertColor("error")
            setTextAlert("Order Address is required!")
            return false
        }
        return true
    }


    const onBtnDeleteClick = () => {
        setOpenDeleteModal(true)
    }

    const onBtnCancelDeleteClick = () => {
        setOpenDeleteModal(false)
    }

    const onBtnConfirmDeleteClick = () => {
        fetch(`https://freshop-backendcloud.herokuapp.com/orders/` + paramId, { method: 'DELETE' })
            .then(async res => {
                const isJson = res.headers.get('content-type')?.includes('application/json');
                const data = isJson && await res.json();
                // Check for response error
                if (!res.ok) {
                    // get error message from body or default to response status
                    const error = (data && data.message) || res.status;
                    return Promise.reject(error);
                }
                setAlert(true);
                setAlertColor("success");
                setTextAlert("Delete successfully!")
                navigate('/orders')
            })
            .catch((error) => {
                setAlert(true)
                setAlertColor("error");
                setTextAlert("Delete Order ID: " + paramId + " fail!, ERROR: " + error);
                setUpdateData(updateData + 1)
            })
    }

    return (
        <>
            <Grid container mt={2} >
                <Grid item xs={2} sm={2} md={2} lg={2} pt={1}>
                    <FormLabel>Order Code : </FormLabel>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4}>
                    <TextField fullWidth variant="outlined" value={paramId} disabled></TextField>
                </Grid>
            </Grid>
            <Grid container mt={2} >
                <Grid item xs={2} sm={2} md={2} lg={2} pt={1}>
                    <FormLabel>Total Cost : </FormLabel>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4}>
                    <TextField fullWidth variant="outlined" value={totalCost} disabled></TextField>
                </Grid>
                <Grid item xs={2} sm={2} md={2} lg={2} pt={1} pl={2}>
                    <FormLabel>Customer : </FormLabel>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4}>
                    <TextField fullWidth id="outlined-basic" variant="outlined" value={buyer} disabled />
                </Grid>
            </Grid>
            <Grid container mt={2}>
                <Grid item xs={2} sm={2} md={2} lg={2} pt={1}>
                    <FormLabel>Order Date :</FormLabel>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4}>
                    <TextField fullWidth variant="outlined" value={orderDate} disabled></TextField>
                </Grid>
                <Grid item xs={2} sm={2} md={2} lg={2} pt={1} pl={2}>
                    <FormLabel>Ship Date :</FormLabel>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4}>
                    <TextField fullWidth id="outlined-basic" value={shippedDate} onChange={onOrderShipDateChange} />
                </Grid>
            </Grid>
            <Grid container mt={2} >
                <Grid item xs={2} sm={2} md={2} lg={2} pt={1}>
                    <FormLabel>Shipping :</FormLabel>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4}>
                    <TextField fullWidth variant="outlined" value={shippingMethod.split("@")[0]} disabled></TextField>
                </Grid>
                <Grid item xs={2} sm={2} md={2} lg={2} pt={1} pl={2}>
                    <FormLabel>Order Payment :</FormLabel>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4}>
                    <FormControl fullWidth>
                        <select className="form-control" value={payment} style={{ height: "60px", backgroundColor: "#ebedef" }} onChange={onOrderPaymentChange}>
                            <option value="Momo" >Momo</option>
                            <option value="Zalo" >Zalo</option>
                            <option value="Cash" >COD</option>

                        </select>
                    </FormControl>
                </Grid>
            </Grid>
            <Grid container mt={2} >
                <Grid item xs={2} sm={2} md={2} lg={2} pt={1}>
                    <FormLabel>Order City :</FormLabel>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4}>
                    <FormControl fullWidth>
                        <select className="form-control" value={orderCity} style={{ height: "60px", backgroundColor: "#ebedef" }} onChange={onOrderCityChange}>
                            <option defaultValue="" ></option>
                            {
                                addressData.map((element, index) => {
                                    return <option key={index} value={element.name}>{element.name}</option>
                                })
                            }
                        </select>
                    </FormControl>
                </Grid>
                <Grid item xs={2} sm={2} md={2} lg={2} pt={1} pl={2}>
                    <FormLabel>Order District :</FormLabel>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4}>
                    <FormControl fullWidth>
                        <select className="form-control" value={orderDistrict} style={{ height: "60px", backgroundColor: "#ebedef" }} onChange={onOrderDistrictChange}>
                            <option value={orderDistrict}>{orderDistrict}</option>
                            {
                                districtData.map((element, index) => {
                                    return <option key={index} value={element.name}>{element.name}</option>
                                })
                            }
                        </select>
                    </FormControl>
                </Grid>
            </Grid>
            <Grid container mt={2} >
                <Grid item xs={2} sm={2} md={2} lg={2} pt={1}>
                    <FormLabel>Order Ward :</FormLabel>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4}>
                    <FormControl fullWidth>
                        <select className="form-control" value={orderWard} style={{ height: "60px", backgroundColor: "#ebedef" }} onChange={onOrderWardChange}>
                            <option value={orderWard}>{orderWard}</option>
                            {
                                wardData.map((element, index) => {
                                    return <option key={index} value={element.name}>{element.name}</option>
                                })
                            }
                        </select>
                    </FormControl>
                </Grid>
                <Grid item xs={2} sm={2} md={2} lg={2} pl={2} pt={1}>
                    <FormLabel>Order Address :</FormLabel>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4}>
                    <TextField fullWidth id="outlined-basic" variant="outlined" value={orderAddress} onChange={onOrderAddressChange} />
                </Grid>
            </Grid>
            <Container>
                <Grid container mt={4}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow >
                                    <TableCell align="center"><b>STT</b></TableCell>
                                    <TableCell align="center"><b>IMAGE</b></TableCell>
                                    <TableCell align="center"><b>NAME</b></TableCell>
                                    <TableCell align="center"><b>PROMOTION PRICE</b></TableCell>
                                    <TableCell align="center"><b>QUANTITY</b></TableCell>
                                    <TableCell align="center"><b>TOTAL COST</b></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orderListPag.map((order, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row" align="center">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell align="center">
                                            <img src={order.product.imageURl} style={{ width: "80px" }}></img>
                                        </TableCell>
                                        <TableCell align="center">{order.product.name}</TableCell>
                                        <TableCell align="center">{order.product.promotionPrice}</TableCell>
                                        <TableCell align="center">{order.quantity}</TableCell>
                                        <TableCell align="center">{Number(order.product.promotionPrice) * Number(order.quantity)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                    </TableContainer>
                </Grid>
                <Grid container mt={3} justifyContent="flex-end">
                    <Grid item>
                        <Pagination count={noPage} defaultPage={currentPage} onChange={changePageHandler} color="primary" variant="outlined" shape="rounded" />
                    </Grid>
                </Grid>
                <Button variant="contained" style={{ marginTop: "20px", width: "130px", backgroundColor: "red", float: "right" }} onClick={onBtnDeleteClick}>Delete</Button>
                <Button variant="contained" style={{ marginRight: "10px", marginTop: "20px", width: "130px", backgroundColor: "green", float: "right" }} onClick={onBtnEditClick}>Edit</Button>
                <Modal
                    open={openDeleteModal}
                >
                    <Box sx={style}>
                        <Typography variant="h5" component="h2" textAlign={'center'}>
                            <b>DELETE ORDER</b>
                        </Typography>
                        <Grid container mt={4} textAlign={'center'}>
                            {(today > new Date(shippedDate) || today == new Date(shippedDate))
                                ?
                                <p>System can not delete shipped order. This action will create data vulnerability</p>
                                :
                                <p>Do you want to delete Order ID <b>{paramId}</b> ? </p>
                            }

                        </Grid>
                        <Grid container mt={4}>
                            <Grid item xs={12} textAlign="end">
                                {(today > new Date(shippedDate) || today == new Date(shippedDate))
                                    ?
                                    <>
                                        <Button color="info" variant="contained" onClick={onBtnCancelDeleteClick}>Cancel</Button>
                                    </>
                                    :
                                    <>
                                        <Button color="error" variant="contained" className="me-1" onClick={onBtnConfirmDeleteClick}>Confirm</Button>
                                        <Button color="info" variant="contained" onClick={onBtnCancelDeleteClick}>Cancel</Button>
                                    </>
                                }
                            </Grid>
                        </Grid>
                    </Box>
                </Modal>
                <Snackbar
                    open={alert}
                    autoHideDuration={5000}
                    onClose={handleCloseAlert}
                >
                    <Alert onClose={handleCloseAlert} severity={alertColor}>{textAlert}</Alert>
                </Snackbar>
            </Container>
        </>
    )
}

export default OrderDetail