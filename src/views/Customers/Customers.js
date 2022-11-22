import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Grid, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button, Pagination, TextField, Modal, Box, Typography, FormLabel, Snackbar, Alert, FormControl, InputLabel, Select, MenuItem } from "@mui/material"
import { ChangeNoPagecustomer, getCustomerAction } from "src/actions/CustomersAction";
import { useNavigate } from "react-router-dom";

const Product = () => {

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
    const dispatch = useDispatch()

    const [copyList, setCopyList] = useState([])
    const [openCreateModal, setOpenCreateModal] = useState(false)
    const [createCustomerName, setCreateCustomerName] = useState('')
    const [createCustomerEmail, setCreateCustomerEmail] = useState('')
    const [createCustomerPhone, setCreateCustomerPhone] = useState('')
    const [createCustomerPassword, setCreateCustomerPassword] = useState('')
    const [createCustomerCity, setCreateCustomerCity] = useState('')
    const [createCustomerDistrict, setCreateCustomerDistrict] = useState('')
    const [createCustomerWard, setCreateCustomerWard] = useState('')
    const [createCustomerAddress, setCreateCustomerAddress] = useState('')

    const [addressData, setAddressData] = useState([])
    const [districtData, setDistrictData] = useState([])
    const [wardData, setWardData] = useState([])

    const [alert, setAlert] = useState(false);
    const [textAlert, setTextAlert] = useState('')
    const [alertColor, setAlertColor] = useState("error")
    const [updateData, setUpdateData] = useState(0)

    const { currentPage_customer, customer, noPage_customer } = useSelector((reduxData) => reduxData.customerReducer)
    const customerPagination = customer.slice((currentPage_customer - 1) * 10, currentPage_customer * 10)

    const addressAPI = "https://raw.githubusercontent.com/sunshine-tech/VietnamProvinces/master/vietnam_provinces/data/nested-divisions.json"

    const createAPICustomer = async (paramBody) => {
        const response = await fetch(`https://freshop-backendcloud.herokuapp.com/customers`, paramBody)
        const data = await response.json()
        return data.newCustomer
    }

    const getAPIAddress = async (url) => {
        const response = await fetch(url)
        const data = await response.json()
        setAddressData(data)
        return data
    }

    const handleCloseAlert = () => setAlert(false)

    const changePageHandler = (event, value) => {
        dispatch(ChangeNoPagecustomer(value))
    }

    const requestSearch = (searched) => {
        setCopyList(customer.filter((item) => item.email.toLowerCase().includes(searched.toLowerCase())))
    }

    const onCustomerDetailClick = (customer) => {
        navigate(`/customers/${customer._id}`)
    }

    const onCreateCustomerNameChange = (e) => {
        setCreateCustomerName(e.target.value)
    }

    const onCreateCustomerEmailChange = (e) => {
        setCreateCustomerEmail(e.target.value)
    }

    const onCreateCustomerPhoneChange = (e) => {
        setCreateCustomerPhone(e.target.value)
    }

    const onCreateCustomerPasswordChange = (e) => {
        setCreateCustomerPassword(e.target.value)
    }

    const onCreateCustomerCityChange = (e) => {
        setCreateCustomerCity(e.target.value)
        let cityName = e.target.value
        if (cityName) {
            const districtData = addressData.find((value) => value.name == cityName)
            setDistrictData(districtData.districts)
        }
    }

    const onCreateCustomerDistrictChange = (e) => {
        setCreateCustomerDistrict(e.target.value)
        let districtName = e.target.value
        if (districtName) {
            const wardData = districtData.find((value) => value.name == districtName)
            setWardData(wardData.wards)
        }
    }

    const onCreateCustomerWardChange = (e) => {
        setCreateCustomerWard(e.target.value)
    }

    const onCreateCustomerAddressChange = (e) => {
        setCreateCustomerAddress(e.target.value)
    }

    const onBtnCreateCustomer = () => {
        setOpenCreateModal(true)
    }

    const onCreateCustomerClick = () => {
        var customerCreateCheck = {
            fullName: createCustomerName,
            email: createCustomerEmail,
            phone: Number(createCustomerPhone) ,
            password: createCustomerPassword,
            city: createCustomerCity,
            district: createCustomerDistrict,
            ward: createCustomerWard,
            address: createCustomerAddress
        }

        const customerValidateCheck = validateCustomer(customerCreateCheck)
        if (customerValidateCheck) {
            const body = {
                method: "POST",
                body: JSON.stringify({
                    fullName: customerCreateCheck.fullName,
                    email: customerCreateCheck.email,
                    phone: customerCreateCheck.phone,
                    password: customerCreateCheck.password,
                    city: customerCreateCheck.city,
                    district: customerCreateCheck.district,
                    ward: customerCreateCheck.ward,
                    address: customerCreateCheck.address
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                }
            }
            createAPICustomer(body)
                .then((data) => {
                    setAlert(true);
                    setAlertColor("success");
                    setTextAlert("Create New Customer successfully!")
                    setCreateCustomerName('')
                    setCreateCustomerEmail('')
                    setCreateCustomerPhone('')
                    setCreateCustomerPassword('')
                    setCreateCustomerCity('')
                    setCreateCustomerDistrict('')
                    setCreateCustomerWard('')
                    setCreateCustomerAddress('')
                    setOpenCreateModal(false)
                    setUpdateData(updateData + 1)
                }).catch((error) => {
                    console.log(error)
                    setAlert(true)
                    setAlertColor("error");
                    setTextAlert("Create New Customer fail!");
                    setUpdateData(updateData + 1)
                })
        }
    }

    const validateCustomer = (paramCreateCustomer) => {
        const checkNewCustomerEmail = customer.some(customer =>
            customer.email === paramCreateCustomer.email
        )
        // var phoneRegex = /^\d{10}$/
        var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        var passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/
        if (paramCreateCustomer.fullName === "") {
            setAlert(true)
            setAlertColor("error")
            setTextAlert("Please enter your Full Name")
            return false
        } else if ((isNaN(paramCreateCustomer.phone)) || (paramCreateCustomer.length < 9)) {
            setAlert(true)
            setAlertColor("error")
            setTextAlert("Your Phone Number is invalid! Please try again")
            return false
        } else if (paramCreateCustomer.phone.length === 0) {
            setAlert(true)
            setAlertColor("error")
            setTextAlert("Your Phone Number is invalid! Please try again")
            return false
        } else if (checkNewCustomerEmail) {
            setAlert(true)
            setAlertColor("error")
            setTextAlert("Your email account already exists! Please Login!")
            return false
        } else if (!emailRegex.test(paramCreateCustomer.email)) {
            setAlert(true)
            setAlertColor("error")
            setTextAlert("Your Email is invalid! Please try again")
            return false
        } else if (paramCreateCustomer.email === "") {
            setAlert(true)
            setAlertColor("error")
            setTextAlert("Please enter your Email")
            return false
        }  else if (paramCreateCustomer.city === "") {
            setAlert(true)
            setAlertColor("error")
            setTextAlert("Please enter your City")
            return false
        } else if (paramCreateCustomer.district === "") {
            setAlert(true)
            setAlertColor("error")
            setTextAlert("Please enter your District")
            return false
        } else if (paramCreateCustomer.ward === "") {
            setAlert(true)
            setAlertColor("error")
            setTextAlert("Please enter your Ward")
            return false
        } else if (paramCreateCustomer.address === "") {
            setAlert(true)
            setAlertColor("error")
            setTextAlert("Please enter your Address")
            return false
        } else if (!passRegex.test(paramCreateCustomer.password)) {
            setAlert(true)
            setAlertColor("error")
            setTextAlert("Your password must between 6 to 20 characters which contain at least one numeric digit, one uppercase and one lowercase letter")
            return false
        } else if (paramCreateCustomer.password.length === 0) {
            setAlert(true)
            setAlertColor("error")
            setTextAlert("Please enter your Password")
            return false
        }
        return true
    }

    const onBtnCancelClick = () => {
        setOpenCreateModal(false)
        setCreateCustomerName('')
        setCreateCustomerEmail('')
        setCreateCustomerPhone('')
        setCreateCustomerPassword('')
        setCreateCustomerCity('')
        setCreateCustomerDistrict('')
        setCreateCustomerWard('')
        setCreateCustomerAddress('')
        setUpdateData(updateData + 1)
    }

    useEffect(() => {
        dispatch(getCustomerAction())
        getAPIAddress(addressAPI)
    }, [currentPage_customer, updateData])

    return (
        <>

            <Container>
                <Grid container mt={4}>
                    <Grid item xs={6} sm={6} md={6} lg={6}>
                        <Button color="success" variant="contained" onClick={onBtnCreateCustomer}>Create Customer</Button>
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
                                    <TableCell align="center"><b>FULL NAME</b></TableCell>
                                    <TableCell align="center"><b>PHONE</b></TableCell>
                                    <TableCell align="center"><b>EMAIL</b></TableCell>
                                    <TableCell align="center"><b># ORDERS</b></TableCell>
                                    <TableCell align="center"><b>DETAIL</b></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(copyList.length > 0 ? copyList : customerPagination).map((customer, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row" align="center">
                                            {index + 1 + (currentPage_customer - 1) * 10}
                                        </TableCell>
                                        <TableCell align="center">{customer.fullName}</TableCell>
                                        <TableCell align="center">{customer.phone}</TableCell>
                                        <TableCell align="center">{customer.email}</TableCell>
                                        <TableCell align="center">{customer.orders.length}</TableCell>
                                        <TableCell align="center">
                                            <Button variant="contained" style={{ marginRight: "2px" }} onClick={() => { onCustomerDetailClick(customer) }}>View Detail</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid container mt={3} justifyContent="flex-end">
                    <Grid item>
                        <Pagination count={noPage_customer} defaultPage={currentPage_customer} onChange={changePageHandler} color="primary" variant="outlined" shape="rounded" />
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
                                        <b>CREATE NEW CUSTOMER</b>
                                    </Typography>
                                    <Grid container mt={1}>
                                        <Grid item xs={2} sm={2} md={2} lg={2} pt={1}>
                                            <FormLabel>Full Name</FormLabel>
                                        </Grid>
                                        <Grid item xs={4} sm={4} md={4} lg={4}>
                                            <TextField fullWidth variant="outlined" label="Full Name" value={createCustomerName} onChange={onCreateCustomerNameChange} ></TextField>
                                        </Grid>
                                        <Grid item xs={2} sm={2} md={2} lg={2} pl={2} pt={1}>
                                            <FormLabel>Email</FormLabel>
                                        </Grid>
                                        <Grid item xs={4} sm={4} md={4} lg={4}>
                                            <TextField fullWidth variant="outlined" label="Email" value={createCustomerEmail} onChange={onCreateCustomerEmailChange} ></TextField>
                                        </Grid>
                                    </Grid>
                                    <Grid container mt={1}>
                                        <Grid item xs={2} sm={2} md={2} lg={2} pt={1}>
                                            <FormLabel>Phone</FormLabel>
                                        </Grid>
                                        <Grid item xs={4} sm={4} md={4} lg={4}>
                                            <TextField fullWidth variant="outlined" label="Phone" value={createCustomerPhone} onChange={onCreateCustomerPhoneChange}></TextField>
                                        </Grid>
                                        <Grid item xs={2} sm={2} md={2} lg={2} pl={2} pt={1}>
                                            <FormLabel>Password</FormLabel>
                                        </Grid>
                                        <Grid item xs={4} sm={4} md={4} lg={4}>
                                            <TextField fullWidth variant="outlined" type="password" label="Password" value={createCustomerPassword} onChange={onCreateCustomerPasswordChange}></TextField>
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
                                                    value={createCustomerCity}
                                                    label="City"
                                                    onChange={onCreateCustomerCityChange}
                                                >
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
                                                    value={createCustomerDistrict}
                                                    label="District"
                                                    onChange={onCreateCustomerDistrictChange}
                                                >
                                                    {districtData.map((value, index) => {
                                                        return <MenuItem key={index} value={value.name}>{value.name}</MenuItem>
                                                    })}

                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                    <Grid container mt={2}>
                                        <Grid item xs={2} sm={2} md={2} lg={2} pt={1}>
                                            <FormLabel>Ward</FormLabel>
                                        </Grid>
                                        <Grid item xs={4} sm={4} md={4} lg={4}>
                                            <FormControl fullWidth>
                                                <InputLabel>-- Select product Ward --</InputLabel>
                                                <Select
                                                    value={createCustomerWard}
                                                    label="Ward"
                                                    onChange={onCreateCustomerWardChange}
                                                >
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
                                            <TextField fullWidth variant="outlined" label="Address" value={createCustomerAddress} onChange={onCreateCustomerAddressChange}></TextField>
                                        </Grid>
                                    </Grid>
                                    <Grid container mt={2}>
                                        <Grid item xs={12} textAlign="end">
                                            <Button color="success" variant="contained" className="me-1" onClick={onCreateCustomerClick}>Create</Button>
                                            <Button color="error" variant="contained" onClick={onBtnCancelClick}>Cancel</Button>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Modal>
                        </Grid>
                    </Grid>
                </Container>

            </Container>

        </>
    )
}
export default Product; 