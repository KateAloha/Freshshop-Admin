import { Container, Grid, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button, Pagination, TextField, FormLabel, Snackbar, Alert, FormControl, Modal, Box, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';

const CustomerDetail = () => {

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

    const [orderList, setOrderList] = useState([])
    const [customerPhone, setCustomerPhone] = useState(0)
    const [customerEmail, setCustomerEmail] = useState('')
    const [customerName, setCustomerName] = useState('')
    const [customerCity, setCustomerCity] = useState('')
    const [customerDistrict, setCustomerDistrict] = useState('')
    const [customerWard, setCustomerWard] = useState('')
    const [customerAddress, setCustomerAddress] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [openDeleteModal, setOpenDeleteModal] = useState(false)

    const [addressData, setAddressData] = useState([])
    const [districtData, setDistrictData] = useState([])
    const [wardData, setWardData] = useState([])
    const [updateData, setUpdateData] = useState(0)

    const [alert, setAlert] = useState(false);
    const [textAlert, setTextAlert] = useState('');
    const [alertColor, setAlertColor] = useState("error")

    const noPage = Math.ceil(orderList.length / 10)
    const orderListPag = orderList.slice((currentPage - 1) * 10, currentPage * 10)

    const addressAPI = "https://raw.githubusercontent.com/sunshine-tech/VietnamProvinces/master/vietnam_provinces/data/nested-divisions.json"

    const getAPICustomer = async (paramId, paramBody) => {
        const response = await fetch(`https://freshop-backendcloud.herokuapp.com/customers/${paramId}`, paramBody)
        const data = await response.json()
        return data.Customer
    }

    const getAPIAddress = async (url) => {
        const response = await fetch(url)
        const data = await response.json()
        setAddressData(data)
        return data
    }


    useEffect(() => {
        getAPIAddress(addressAPI)
        getAPICustomer(paramId).then((data) => {
            setOrderList(data.orders)
            setCustomerPhone(data.phone)
            setCustomerEmail(data.email)
            setCustomerName(data.fullName)
            setCustomerCity(data.city)
            setCustomerDistrict(data.district)
            setCustomerWard(data.ward)
            setCustomerAddress(data.address)
        }).catch((error) => {
            console.log(error)
        })
    }, [paramId, updateData])

    const onCustomerPhoneChange = (e) => {
        setCustomerPhone(e.target.value)
    }

    const onCustomerEmailChange = (e) => {
        setCustomerEmail(e.target.value)
    }

    const onCustomerNameChange = (e) => {
        setCustomerName(e.target.value)
    }

    const onCustomerCityChange = (e) => {
        setCustomerCity(e.target.value)
        let cityName = e.target.value
        if (cityName) {
            const districtData = addressData.find((value) => value.name == cityName)
            setDistrictData(districtData.districts)
        }
    }

    const onCustomerDistrictChange = (e) => {
        setCustomerDistrict(e.target.value)
        let districtName = e.target.value
        if (districtName) {
            const wardData = districtData.find((value) => value.name == districtName)
            setWardData(wardData.wards)
        }
    }

    const onCustomerWardChange = (e) => {
        setCustomerWard(e.target.value)
    }

    const onCustomerAddressChange = (e) => {
        setCustomerAddress(e.target.value)
    }

    const changePageHandler = (event, value) => {
        setCurrentPage(value)
    }

    const onOrderDetailClick = (order) => {
        navigate(`/orders/${order._id}`)
    }

    const handleCloseAlert = () => setAlert(false);

    const onBtnEditClick = () => {
        var customerUpdateCheck = {
            fullName: customerName,
            phone: customerPhone,
            email: customerEmail,
            address: customerAddress,
            city: customerCity,
            district: customerDistrict,
            ward: customerWard,
        }

        const customerCheck = validateCustomer(customerUpdateCheck)
        if (customerCheck) {
            const body = {
                method: "PUT",
                body: JSON.stringify({
                    fullName: customerUpdateCheck.fullName,
                    phone: Number(customerUpdateCheck.phone),
                    email: customerUpdateCheck.email,
                    address: customerUpdateCheck.address,
                    city: customerUpdateCheck.city,
                    district: customerUpdateCheck.district,
                    ward: customerUpdateCheck.ward
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                }
            }
            getAPICustomer(paramId, body)
                .then((data) => {
                    console.log(data)
                    setAlert(true)
                    setAlertColor("success")
                    setTextAlert("Update Customer ID: " + paramId + " successfully!")
                    setUpdateData(updateData + 1)
                }).catch((error) => {
                    console.log(error)
                    setAlert(true)
                    setAlertColor("error")
                    setTextAlert("Update Customer ID: " + paramId + " fail!, ERROR: " + error)
                    setUpdateData(updateData + 1)
                })

        }
    }

    const validateCustomer = (paramCustomerUpdate) => {
        if (paramCustomerUpdate.fullName === "") {
            setAlert(true)
            setAlertColor("error")
            setTextAlert("Customer name is required!")
            return false
        } else if ((paramCustomerUpdate.phone.length == 0) || (paramCustomerUpdate.phone.length < 9) || (isNaN(paramCustomerUpdate.phone))) {
            setAlert(true)
            setAlertColor("error")
            setTextAlert("Your Phone number is invalid, please try again!")
            return false
        } else if (paramCustomerUpdate.city == "") {
            setAlert(true)
            setAlertColor("error")
            setTextAlert("Customer City is required!")
            return false
        } else if (paramCustomerUpdate.district == "") {
            setAlert(true)
            setAlertColor("error")
            setTextAlert("Customer District is required!")
            return false
        } else if (paramCustomerUpdate.ward == "") {
            setAlert(true)
            setAlertColor("error")
            setTextAlert("Customer Ward is required!")
            return false
        } else if (paramCustomerUpdate.address == "") {
            setAlert(true)
            setAlertColor("error")
            setTextAlert("Customer Address is required!")
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
        fetch(`https://freshop-backendcloud.herokuapp.com/customers/` + paramId, { method: 'DELETE' })
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
                navigate('/customers')
            })
            .catch((error) => {
                setAlert(true)
                setAlertColor("error");
                setTextAlert("Delete Customer ID: " + paramId + " fail!, ERROR: " + error);
                setUpdateData(updateData + 1)
            })
    }


    return (
        <>
            <Grid container mt={2} >
                <Grid item xs={2} sm={2} md={2} lg={2} pt={1}>
                    <FormLabel>Customer Code :</FormLabel>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4}>
                    <TextField fullWidth variant="outlined" value={paramId} disabled></TextField>
                </Grid>
                <Grid item xs={2} sm={2} md={2} lg={2} pl={2} pt={1}>
                    <FormLabel>Customer Phone :</FormLabel>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4}>
                    <TextField fullWidth id="outlined-basic" variant="outlined" value={customerPhone} onChange={onCustomerPhoneChange} />
                </Grid>
            </Grid>
            <Grid container mt={2} >
                <Grid item xs={2} sm={2} md={2} lg={2} pt={1}>
                    <FormLabel>Customer Name :</FormLabel>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4}>
                    <TextField fullWidth variant="outlined" value={customerName} onChange={onCustomerNameChange} ></TextField>
                </Grid>
                <Grid item xs={2} sm={2} md={2} lg={2} pl={2} pt={1}>
                    <FormLabel>Customer Email :</FormLabel>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4}>
                    <TextField fullWidth id="outlined-basic" variant="outlined" value={customerEmail} onChange={onCustomerEmailChange} disabled />
                </Grid>
            </Grid>
            <Grid container mt={2} >
                <Grid item xs={2} sm={2} md={2} lg={2} pt={1}>
                    <FormLabel>Customer City :</FormLabel>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4}>
                    <FormControl fullWidth>
                        <select className="form-control" value={customerCity} style={{ height: "60px", backgroundColor: "#ebedef" }} onChange={onCustomerCityChange}>
                            {
                                addressData.map((element, index) => {
                                    return <option key={index} value={element.name}>{element.name}</option>
                                })
                            }
                        </select>
                    </FormControl>
                </Grid>
                <Grid item xs={2} sm={2} md={2} lg={2} pl={2} pt={1}>
                    <FormLabel>Customer District :</FormLabel>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4}>
                    <FormControl fullWidth>
                        <select className="form-control" value={customerDistrict} style={{ height: "60px", backgroundColor: "#ebedef" }} onChange={onCustomerDistrictChange}>
                            <option value={customerDistrict}>{customerDistrict}</option>
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
                    <FormLabel>Customer Ward :</FormLabel>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4}>
                    <FormControl fullWidth>
                        <select className="form-control" value={customerWard} style={{ height: "60px", backgroundColor: "#ebedef" }} onChange={onCustomerWardChange}>
                            <option value={customerWard}>{customerWard}</option>
                            {
                                wardData.map((element, index) => {
                                    return <option key={index} value={element.name}>{element.name}</option>
                                })
                            }
                        </select>
                    </FormControl>
                </Grid>
                <Grid item xs={2} sm={2} md={2} lg={2} pl={2} pt={1}>
                    <FormLabel>Customer Address :</FormLabel>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4}>
                    <TextField fullWidth id="outlined-basic" variant="outlined" value={customerAddress} onChange={onCustomerAddressChange} />
                </Grid>
            </Grid>
            <Container>
                <Grid container mt={4}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow >
                                    <TableCell align="center"><b>STT</b></TableCell>
                                    <TableCell align="center"><b>ORDER DATE</b></TableCell>
                                    <TableCell align="center"><b>SHIP DATE</b></TableCell>
                                    <TableCell align="center"><b>SHIPPING METHOD</b></TableCell>
                                    <TableCell align="center"><b>PAYMENT</b></TableCell>
                                    <TableCell align="center"><b>TOTAL COST</b></TableCell>
                                    <TableCell align="center"><b>STATUS</b></TableCell>
                                    <TableCell align="center"><b>ORDER DETAIL</b></TableCell>
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
                                        <TableCell align="center">{order.orderDate}</TableCell>
                                        <TableCell align="center">{order.shippedDate}</TableCell>
                                        <TableCell align="center">{order.shipping.split("-")[0]}</TableCell>
                                        <TableCell align="center">{order.payment}</TableCell>
                                        <TableCell align="center">{order.cost}</TableCell>
                                        <TableCell align="center">
                                            {(today > new Date(order.shippedDate) || today == new Date(order.shippedDate))
                                                ?
                                                <p style={{ color: "green", fontWeight: "bold", width: "150px" }}><CheckCircleOutlineOutlinedIcon></CheckCircleOutlineOutlinedIcon> Done </p>
                                                :
                                                <p style={{ color: "red", fontWeight: "bold", width: "150px" }}><LocalShippingOutlinedIcon></LocalShippingOutlinedIcon> Process ...</p>
                                            }
                                        </TableCell>
                                        <TableCell align="center">
                                            <Button variant="contained" style={{ marginRight: "2px", width: "130px" }} onClick={() => onOrderDetailClick(order)}>Detail</Button>
                                        </TableCell>
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
                            <b>DELETE CUSTOMER</b>
                        </Typography>
                        <Grid container mt={4} textAlign={'center'}>
                            {orderList.length > 0
                                ?
                                <p>System can not delete customer having orders data. This action will create data vulnerability</p>
                                :
                                <p>Do you want to delete Customer ID <b>{paramId}</b> ? </p>
                            }

                        </Grid>
                        <Grid container mt={4}>
                            <Grid item xs={12} textAlign="end">
                                {orderList.length > 0
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

export default CustomerDetail