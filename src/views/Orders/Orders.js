import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Grid, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button, Pagination, TextField, Snackbar, Alert, Modal, Box, Typography, FormLabel, MenuItem, FormControl, Select, InputLabel } from "@mui/material"
import { ChangeNoPageOrder, getOrderAction } from "src/actions/OrderAction";
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import { useNavigate } from "react-router-dom";
import { getCustomerAction } from "src/actions/CustomersAction";
import { getProductAction } from "src/actions/ProductAction";

const Order = () => {

    const style = {
        position: 'absolute',
        top: '50%',
        left: '60%',
        transform: 'translate(-50%, -50%)',
        width: 900,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    }

    const navigate = useNavigate()
    const today = new Date()
    const [copyList, setCopyList] = useState([])
    const [openCreateModal, setOpenCreateModal] = useState(false)
    const [openModalConfirm, setOpenModalConfirm] = useState(false)
    const [createOrderBuyer, setCreateOrderBuyer] = useState('')
    const [createOrderPayment, setCreateOrderPament] = useState('')
    const [createOrderrCity, setCreateOrderCity] = useState('')
    const [createOrderDistrict, setCreateOrderDistrict] = useState('')
    const [createOrderWard, setCreateOrderWard] = useState('')
    const [createOrderAddress, setCreateOrderAddress] = useState('')
    const [createOrderShippingMethod, setCreateOrderShippingMethod] = useState('')
    const [createOrderProductDetail, setCreateOrderProductDetail] = useState('')
    const [createOrderQuantity, setCreateOrderQuantity] = useState(0)
    const [createOrderShippFee, setCreateOrderShipFee] = useState(0)
    const [createShipDate, setCreateShipDate] = useState('')
    const [createOrderCost, setCreateOrderCost] = useState(0)

    const [addressData, setAddressData] = useState([])
    const [districtData, setDistrictData] = useState([])
    const [wardData, setWardData] = useState([])

    const [alert, setAlert] = useState(false);
    const [textAlert, setTextAlert] = useState('')
    const [alertColor, setAlertColor] = useState("error")
    const [updateData, setUpdateData] = useState(0)

    const { currentPage_order, order, noPage_order } = useSelector((reduxData) => reduxData.orderReducer)
    const { product } = useSelector((reduxData) => reduxData.ProductReducer)
    const { customer } = useSelector((reduxData) => reduxData.customerReducer)
    const orderPagination = order.slice((currentPage_order - 1) * 10, currentPage_order * 10)

    const addressAPI = "https://raw.githubusercontent.com/sunshine-tech/VietnamProvinces/master/vietnam_provinces/data/nested-divisions.json"

    const createAPIOrder = async (paramUrl, paramBody) => {
        const response = await fetch(paramUrl, paramBody)
        const data = await response.json()
        return data
    }

    const getAPIAddress = async (url) => {
        const response = await fetch(url)
        const data = await response.json()
        setAddressData(data)
        return data
    }

    const shippingDateValue = (dayAdd) => {
        // let today = new Date().toLocaleDateString()
        let result = new Date()
        result.setDate(result.getDate() + dayAdd);
        let finalResult = result.toLocaleDateString()
        return finalResult
    }

    const handleCloseAlert = () => setAlert(false)

    const changePageHandler = (event, value) => {
        dispatch(ChangeNoPageOrder(value))
    }

    const requestSearch = (searched) => {
        setCopyList(order.filter((item) => item.buyer.email.toLowerCase().includes(searched.toLowerCase())))
    }

    const onOrderDetailClick = (order) => {
        navigate(`/orders/${order._id}`)
    }

    const onCreateOrderBuyerChange = (e) => {
        setCreateOrderBuyer(e.target.value)
        const customerData = customer.find((value) => value._id === e.target.value)
        setCreateOrderCity(customerData.city)
        setCreateOrderDistrict(customerData.district)
        setCreateOrderWard(customerData.ward)
        setCreateOrderAddress(customerData.address)
    }

    const onCreateOrderPaymentChange = (e) => {
        setCreateOrderPament(e.target.value)
    }

    const onCreateOrderCityChange = (e) => {
        setCreateOrderCity(e.target.value)
        let cityName = e.target.value
        if (cityName) {
            const districtData = addressData.find((value) => value.name == cityName)
            setDistrictData(districtData.districts)
        }
    }

    const onCreateOrderDistrictChange = (e) => {
        setCreateOrderDistrict(e.target.value)
        let districtName = e.target.value
        if (districtName) {
            const wardData = districtData.find((value) => value.name == districtName)
            setWardData(wardData.wards)
        }
    }

    const onCreateOrderWardChange = (e) => {
        setCreateOrderWard(e.target.value)
    }

    const onCreateOrderAddressChange = (e) => {
        setCreateOrderAddress(e.target.value)
    }

    const onCreateOrderProductDetailChange = (e) => {
        setCreateOrderProductDetail(e.target.value)

    }

    const onCreateOrderQuantityChange = (e) => {
        setCreateOrderQuantity(e.target.value)

    }

    const onCreateOrderShippingMethodChange = (e) => {
        setCreateOrderShippingMethod(e.target.value)
        if (e.target.value === "Express Delivery - (2-4 business day)") {
            setCreateOrderShipFee(20000)
            let shipDate = shippingDateValue(4)
            setCreateShipDate(shipDate)
        } else if (e.target.value === "Next Business day") {
            setCreateOrderShipFee(40000)
            let shipDate = shippingDateValue(1)
            setCreateShipDate(shipDate)
        } else if (e.target.value === "Standard Delivery - (3-7 business days)") {
            setCreateOrderShipFee(0)
            let shipDate = shippingDateValue(7)
            setCreateShipDate(shipDate)
        }
    }

    const onCreateOrderClick = () => {
        setOpenCreateModal(true)
    }

    const onBtnCreateOrderClick = () => {
        let productData = product.find((value) => value._id === createOrderProductDetail)
        let totalCost = (productData.promotionPrice * createOrderQuantity) + (productData.promotionPrice * createOrderQuantity) * 0.1 + createOrderShippFee
        setCreateOrderCost(totalCost)
        var vCheckValidate = validate()
        if (vCheckValidate) {
            setOpenCreateModal(false)
            setOpenModalConfirm(true)
        }

    }

    const onBtnCancelClick = () => {
        setCreateOrderBuyer("")
        setCreateOrderPament("")
        setCreateOrderCity('')
        setCreateOrderDistrict('')
        setCreateOrderWard('')
        setCreateOrderAddress('')
        setCreateOrderShippingMethod('')
        setCreateOrderProductDetail('')
        setCreateOrderQuantity(0)
        setCreateOrderShipFee(0)
        setCreateShipDate("")
        setCreateOrderCost(0)
        setUpdateData(updateData + 1)
        setOpenCreateModal(false)
    }

    const onBtnCancelConfirmClick = () => {
        setCreateOrderBuyer("")
        setCreateOrderPament("")
        setCreateOrderCity('')
        setCreateOrderDistrict('')
        setCreateOrderWard('')
        setCreateOrderAddress('')
        setCreateOrderShippingMethod('')
        setCreateOrderProductDetail('')
        setCreateOrderQuantity(0)
        setCreateOrderShipFee(0)
        setCreateShipDate("")
        setCreateOrderCost(0)
        setUpdateData(updateData + 1)
        setOpenCreateModal(false)
        setOpenModalConfirm(false)
    }

    const onBtnConfirmCreateClick = () => {
        var createOrderCheck = {
            orderDate: new Date().toLocaleDateString(),
            shippedDate: createShipDate,
            city: createOrderrCity,
            district: createOrderDistrict,
            ward: createOrderWard,
            address: createOrderAddress,
            buyer: createOrderBuyer,
            payment: createOrderPayment,
            shipping: createOrderShippingMethod,
            cost: createOrderCost
        }

        // if orderCheck is valid, call API to post new orderModel
        const orderNewBody = {
            method: 'POST',
            body: JSON.stringify({
                orderDate: createOrderCheck.orderDate,
                shippedDate: createOrderCheck.shippedDate,
                city: createOrderCheck.city,
                district: createOrderCheck.district,
                ward: createOrderCheck.ward,
                address: createOrderCheck.address,
                buyer: createOrderCheck.buyer,
                payment: createOrderCheck.payment,
                shipping: createOrderCheck.shipping,
                cost: Number(createOrderCheck.cost)

            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        }
        createAPIOrder('https://freshop-backendcloud.herokuapp.com/orders', orderNewBody)
            .then((orderData) => {

                //Create each orderDetail in the products list, call API to post orderDetail
                const orderDetailBody = {
                    method: 'POST',
                    body: JSON.stringify({
                        product: createOrderProductDetail,
                        quantity: Number(createOrderQuantity),
                        order: orderData.newOrderInput._id
                    }),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8'
                    }

                }
                createAPIOrder('https://freshop-backendcloud.herokuapp.com/order-details', orderDetailBody)
                    .then((orderDataDetail) => {
                    }).catch((error) => {
                        setAlert(true);
                        setTextAlert(`Can not load your Order Detail, error : `, error);
                        setAlertColor("error");
                    })
                setAlert(true);
                setTextAlert("Create order successfully!");
                setAlertColor("success")
                setCreateOrderBuyer("")
                setCreateOrderPament("")
                setCreateOrderCity('')
                setCreateOrderDistrict('')
                setCreateOrderWard('')
                setCreateOrderAddress('')
                setCreateOrderShippingMethod('')
                setCreateOrderProductDetail('')
                setCreateOrderQuantity(0)
                setCreateOrderShipFee(0)
                setCreateShipDate("")
                setCreateOrderCost(0)
                setUpdateData(updateData + 1)
                setOpenCreateModal(false)
                setOpenModalConfirm(false)
            }).catch((error) => {
                setAlert(true);
                setTextAlert(`Can not load your Order, error: ${error}`,);
                setAlertColor("error")
            })

    }

    const validate = () => {
        if (createOrderBuyer === "") {
            setAlert(true)
            setAlertColor("error")
            setTextAlert("Please select your Buyer")
            return false
        } else if (createOrderProductDetail == "") {
            setAlert(true)
            setAlertColor("error")
            setTextAlert("Please select your product")
            return false
        } else if (createOrderQuantity === 0) {
            setAlert(true)
            setAlertColor("error")
            setTextAlert("Please select your quantity")
            return false
        } else if (createOrderShippingMethod === "") {
            setAlert(true)
            setAlertColor("error")
            setTextAlert("Please select your shipping method")
            return false
        } else if (createOrderPayment === "") {
            setAlert(true)
            setAlertColor("error")
            setTextAlert("Please select your payment")
            return false
        }
        return true
    }

    const dispatch = useDispatch()
    useEffect(() => {
        getAPIAddress(addressAPI)
        dispatch(getOrderAction())
        dispatch(getCustomerAction())
        dispatch(getProductAction())
    }, [currentPage_order, updateData])

    return (
        <>

            <Container>
                <Grid container mt={4}>
                    <Grid item xs={6} sm={6} md={6} lg={6}>
                        <Button color="success" variant="contained" onClick={onCreateOrderClick}>Create Order</Button>
                    </Grid>
                    <Grid item xs={6} sm={6} md={6} lg={6}>
                        <TextField style={{ float: "right" }}
                            variant='outlined'
                            placeholder='search...'
                            type='search'
                            onInput={(e) => requestSearch(e.target.value)}
                        />
                    </Grid>

                </Grid>
                <Grid container mt={4}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow >
                                    <TableCell align="center"><b>STT</b></TableCell>
                                    <TableCell align="center"><b>BUYER</b></TableCell>
                                    <TableCell align="center"><b>ORDER DATE</b></TableCell>
                                    <TableCell align="center"><b>SHIP DATE</b></TableCell>
                                    <TableCell align="center"><b>SHIPPING METHOD</b></TableCell>
                                    <TableCell align="center"><b>PAYMENT</b></TableCell>
                                    <TableCell align="center"><b>TOTAL COST</b></TableCell>
                                    <TableCell align="center"><b>STATUS</b></TableCell>
                                    <TableCell align="center"><b>DETAIL</b></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(copyList.length > 0 ? copyList : orderPagination).map((order, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row" align="center">
                                            {index + 1 + (currentPage_order - 1) * 10}
                                        </TableCell>
                                        <TableCell align="center">{order.buyer.email.split("@")[0]}</TableCell>
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
                                            <Button variant="contained" style={{ marginRight: "2px", width: "130px" }} onClick={() => { onOrderDetailClick(order) }}>View Detail</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>

                <Grid container mt={3} justifyContent="flex-end">
                    <Grid item>
                        <Pagination count={noPage_order} defaultPage={currentPage_order} onChange={changePageHandler} color="primary" variant="outlined" shape="rounded" />
                    </Grid>
                </Grid>

                <Snackbar
                    open={alert}
                    autoHideDuration={5000}
                    onClose={handleCloseAlert}
                >
                    <Alert onClose={handleCloseAlert} severity={alertColor}>{textAlert}</Alert>
                </Snackbar>

                <Container>
                    <Grid container>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <Modal open={openCreateModal}>
                                <Box sx={style}>
                                    <Typography variant="h5" component="h2" textAlign={'center'}>
                                        <b>CREATE NEW ORDER</b>
                                    </Typography>
                                    <Grid container mt={1}>
                                        <Grid item xs={2} sm={2} md={2} lg={2} pt={1}>
                                            <FormLabel>Buyer</FormLabel>
                                        </Grid>
                                        <Grid item xs={4} sm={4} md={4} lg={4}>
                                            <FormControl fullWidth>
                                                <InputLabel>-- Select Buyer --</InputLabel>
                                                <Select
                                                    value={createOrderBuyer}
                                                    label="City"
                                                    onChange={onCreateOrderBuyerChange}
                                                >
                                                    {customer.map((value, index) => {
                                                        return <MenuItem key={index} value={value._id}>{value.email}</MenuItem>
                                                    })}

                                                </Select>
                                            </FormControl>
                                        </Grid>

                                    </Grid>
                                    <Grid container mt={2}>
                                        <Grid item xs={2} sm={2} md={2} lg={2} pt={1}>
                                            <FormLabel>City</FormLabel>
                                        </Grid>
                                        <Grid item xs={4} sm={4} md={4} lg={4}>
                                            <FormControl fullWidth>
                                                <InputLabel>-- Select Your City --</InputLabel>
                                                <Select
                                                    value={createOrderrCity}
                                                    label="City"
                                                    onChange={onCreateOrderCityChange}
                                                >
                                                    <MenuItem value={createOrderrCity}>{createOrderrCity}</MenuItem>
                                                    {addressData.map((value, index) => {
                                                        return <MenuItem key={index} value={value.name}>{value.name}</MenuItem>
                                                    })}

                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={2} sm={2} md={2} lg={2} pt={1} pl={2}>
                                            <FormLabel>District</FormLabel>
                                        </Grid>
                                        <Grid item xs={4} sm={4} md={4} lg={4}>
                                            <FormControl fullWidth>
                                                <InputLabel>-- Select Your District --</InputLabel>
                                                <Select
                                                    value={createOrderDistrict}
                                                    label="District"
                                                    onChange={onCreateOrderDistrictChange}
                                                >
                                                    <MenuItem value={createOrderDistrict}>{createOrderDistrict}</MenuItem>
                                                    {districtData.map((value, index) => {
                                                        return <MenuItem key={index} value={value.name}>{value.name}</MenuItem>
                                                    })}

                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                    <Grid container mt={2}>
                                        <Grid item xs={2} sm={2} md={2} lg={2} pt={1}>
                                            <FormLabel>Product</FormLabel>
                                        </Grid>
                                        <Grid item xs={4} sm={4} md={4} lg={4}>
                                            <FormControl fullWidth>
                                                <InputLabel>-- Select product Ward --</InputLabel>
                                                <Select
                                                    value={createOrderWard}
                                                    label="Ward"
                                                    onChange={onCreateOrderWardChange}
                                                >
                                                    <MenuItem value={createOrderWard}>{createOrderWard}</MenuItem>
                                                    {wardData.map((value, index) => {
                                                        return <MenuItem key={index} value={value.name}>{value.name}</MenuItem>
                                                    })}

                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={2} sm={2} md={2} lg={2} pt={1} pl={2}>
                                            <FormLabel>Address</FormLabel>
                                        </Grid>
                                        <Grid item xs={4} sm={4} md={4} lg={4}>
                                            <TextField fullWidth variant="outlined" label="Address" value={createOrderAddress} onChange={onCreateOrderAddressChange}></TextField>
                                        </Grid>
                                    </Grid>
                                    <Grid container mt={1}>
                                        <Grid item xs={2} sm={2} md={2} lg={2} pt={1}>
                                            <FormLabel>Product</FormLabel>
                                        </Grid>
                                        <Grid item xs={4} sm={4} md={4} lg={4}>
                                            <FormControl fullWidth>
                                                <InputLabel>-- Select Your Product --</InputLabel>
                                                <Select
                                                    value={createOrderProductDetail}
                                                    label="Ward"
                                                    onChange={onCreateOrderProductDetailChange}
                                                >
                                                    {product.map((value, index) => {
                                                        return <MenuItem key={index} value={value._id}>{value.name} - {value.promotionPrice}</MenuItem>
                                                    })}

                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={2} sm={2} md={2} lg={2} pl={2} pt={1}>
                                            <FormLabel>Order Quantity</FormLabel>
                                        </Grid>
                                        <Grid item xs={4} sm={4} md={4} lg={4}>
                                            <TextField fullWidth variant="outlined" lable="quantity" value={createOrderQuantity} onChange={onCreateOrderQuantityChange}></TextField>
                                        </Grid>
                                    </Grid>
                                    <Grid container mt={1}>
                                        <Grid item xs={2} sm={2} md={2} lg={2} pt={1}>
                                            <FormLabel>Shipping Method</FormLabel>
                                        </Grid>
                                        <Grid item xs={4} sm={4} md={4} lg={4}>
                                            <FormControl fullWidth>
                                                <InputLabel>-- Select Your Shipping --</InputLabel>
                                                <Select
                                                    value={createOrderShippingMethod}
                                                    label="Shipping Method"
                                                    onChange={onCreateOrderShippingMethodChange}
                                                >
                                                    <MenuItem value="Standard Delivery - (3-7 business days)">Standard Delivery - (3-7 business days)</MenuItem>
                                                    <MenuItem value="Express Delivery - (2-4 business day)">Express Delivery - (2-4 business day)</MenuItem>
                                                    <MenuItem value="Next Business day">Next Business day</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={2} sm={2} md={2} lg={2} pt={1} pl={2}>
                                            <FormLabel>Payment</FormLabel>
                                        </Grid>
                                        <Grid item xs={4} sm={4} md={4} lg={4}>
                                            <FormControl fullWidth>
                                                <InputLabel>-- Select Your Payment --</InputLabel>
                                                <Select
                                                    value={createOrderPayment}
                                                    label="District"
                                                    onChange={onCreateOrderPaymentChange}
                                                >
                                                    <MenuItem value="Zalo">Zalo</MenuItem>
                                                    <MenuItem value="Momo">Momo</MenuItem>
                                                    <MenuItem value="Cash">COD</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                    <Grid container mt={2}>
                                        <Grid item xs={12} textAlign="end">
                                            <Button color="success" variant="contained" className="me-1" onClick={onBtnCreateOrderClick}>Create</Button>
                                            <Button color="error" variant="contained" onClick={onBtnCancelClick}>Cancel</Button>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Modal>
                        </Grid>
                    </Grid>
                </Container>

                <Modal
                    open={openModalConfirm}
                >
                    <Box sx={style}>
                        <Typography variant="h5" component="h2" textAlign={'center'}>
                            <b>YOUR ORDER</b>
                        </Typography>
                        <Grid container mt={4} textAlign={'center'}>
                            <p>Thank you for your order, your order cost <b>{createOrderCost}</b>. Please check your detail information. If there are any issues raising in the shipping process, please contact us at the number 0333142287 </p>
                        </Grid>
                        <Grid container mt={4}>
                            <Grid item xs={12} textAlign="end">
                                <Button color="error" variant="contained" className="me-1" onClick={onBtnConfirmCreateClick}>Confirm</Button>
                                <Button color="info" variant="contained" onClick={onBtnCancelConfirmClick}>Cancel</Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Modal>
            </Container>

        </>
    )
}
export default Order; 