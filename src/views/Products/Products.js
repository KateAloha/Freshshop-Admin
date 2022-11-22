import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Grid, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button, Pagination, TextField, Modal, Box, Typography, FormLabel, Snackbar, Alert, FormControl, InputLabel, Select, MenuItem } from "@mui/material"
import { ChangeNoPageProduct, getProductAction } from "src/actions/ProductAction";
import { useNavigate } from "react-router-dom";
import { getProductTypeAction } from "src/actions/ProductTypeAction";

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

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [copyList, setCopyList] = useState([])
    const [openCreateModal, setOpenCreateModal] = useState(false)

    const [createProductType, setCreateProductType] = useState("")
    const [createProductName, setCreateProductName] = useState("")
    const [createImageURL, setCreateImageURL] = useState("")
    const [createProductAmount, setCreateProductAmount] = useState("")
    const [createOriginalPrice, setCreateOriginalPrice] = useState("")
    const [createPromotionPrice, setCreatePromotionPrice] = useState("")

    const [alert, setAlert] = useState(false);
    const [textAlert, setTextAlert] = useState('')
    const [alertColor, setAlertColor] = useState("error")
    const [updateData, setUpdateData] = useState(0)

    const { currentPage_product, product, noPage_product } = useSelector((reduxData) => reduxData.ProductReducer)
    const { productType } = useSelector((reduxData) => reduxData.ProductTypeReducer)

    const productPagination = product.slice((currentPage_product - 1) * 10, currentPage_product * 10)

    const createAPIProduct = async (paramBody) => {
        const response = await fetch(`https://freshop-backendcloud.herokuapp.com/productRouters`, paramBody)
        const data = await response.json()
        return data.newProduct
    }

    const handleCloseAlert = () => setAlert(false)

    const changePageHandler = (event, value) => {
        dispatch(ChangeNoPageProduct(value))
    }

    const requestSearch = (searched) => {
        setCopyList(product.filter((item) => item.name.toLowerCase().includes(searched.toLowerCase())))
    }

    const onProductDetailClick = (product) => {
        navigate(`/products/${product._id}`)
    }

    const onProductTypeChange = (e) => {
        setCreateProductType(e.target.value)
    }

    const onCreateProductNameChange = (e) => {
        setCreateProductName(e.target.value)
    }

    const onCreateImageURLChange = (e) => {
        setCreateImageURL(e.target.value)
    }

    const onCreateAmountChange = (e) => {
        setCreateProductAmount(e.target.value)
    }

    const onCreateOrginalPriceChange = (e) => {
        setCreateOriginalPrice(e.target.value)
    }

    const onCreatePromotionPriceChange = (e) => {
        setCreatePromotionPrice(e.target.value)
    }

    const onBtnCreateProductClick = () => {
        setOpenCreateModal(true)
    }

    const onCreateProductClick = () => {
        var productCreateCheck = {
            name: createProductName,
            type: createProductType,
            imageURl:  createImageURL,
            buyPrice: Number(createOriginalPrice) ,
            promotionPrice: Number(createPromotionPrice) ,
            amount: Number(createProductAmount) ,
            imageChild: ""
        }

        const validateCheck = validateCreateProduct(productCreateCheck)
        if (validateCheck) {
            const body = {
                method: "POST",
                body: JSON.stringify({
                    name: productCreateCheck.name,
                    type: productCreateCheck.type,
                    imageURl: productCreateCheck.imageURl,
                    buyPrice: productCreateCheck.buyPrice,
                    promotionPrice: productCreateCheck.promotionPrice,
                    amount: productCreateCheck.amount,
                    imageChild: productCreateCheck.imageChild
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                }
            }
            createAPIProduct(body)
                .then((data) => {
                    setAlert(true);
                    setAlertColor("success");
                    setTextAlert("Create New product successfully!");
                    setCreateProductType("")
                    setCreateProductName("")
                    setCreateImageURL("")
                    setCreateProductAmount("")
                    setCreateOriginalPrice("")
                    setCreatePromotionPrice("")
                    setUpdateData(updateData + 1)
                    setOpenCreateModal(false)
                }).catch((error) => {
                    setAlert(true)
                    setAlertColor("error");
                    setTextAlert("Create New Type fail!");
                    setUpdateData(updateData + 1)
                })
        }
    }

    const validateCreateProduct = (paramCreateProduct) => {
        if (paramCreateProduct.type === "") {
            setAlert(true)
            setAlertColor("error")
            setTextAlert("Product type is required!")
            return false
        } else if (paramCreateProduct.name === "") {
            setAlert(true)
            setAlertColor("error")
            setTextAlert("Product name is required!")
            return false
        } else if (paramCreateProduct.imageURl === "") {
            setAlert(true)
            setAlertColor("error")
            setTextAlert("Product image URL is required!")
            return false
        } else if (paramCreateProduct.amount == "") {
            setAlert(true)
            setAlertColor("error")
            setTextAlert("Product amount is required!")
            return false
        } else if (isNaN(paramCreateProduct.amount)) {
            setAlert(true)
            setAlertColor("error")
            setTextAlert("Product amount must be a number!")
            return false
        } else if (paramCreateProduct.buyPrice == "") {
            setAlert(true)
            setAlertColor("error")
            setTextAlert("Product Original is required!")
            return false
        } else if (isNaN(paramCreateProduct.buyPrice)) {
            setAlert(true)
            setAlertColor("error")
            setTextAlert("Product Original Price must be a number!")
            return false
        } else if (paramCreateProduct.promotionPrice == "") {
            setAlert(true)
            setAlertColor("error")
            setTextAlert("Product Promotion Price is required!")
            return false
        } else if (isNaN(paramCreateProduct.promotionPrice)) {
            setAlert(true)
            setAlertColor("error")
            setTextAlert("Product Promotion Price must be a number!")
            return false
        }
        return true
    }


    const onBtnCancelClick = () => {
        setOpenCreateModal(false)
        setCreateProductType("")
        setCreateProductName("")
        setCreateImageURL("")
        setCreateProductAmount("")
        setCreateOriginalPrice("")
        setCreatePromotionPrice("")
    }


    useEffect(() => {
        dispatch(getProductAction())
        dispatch(getProductTypeAction())
    }, [currentPage_product, updateData])

    return (
        <>

            <Container>
                <Grid container mt={4}>
                    <Grid item xs={6} sm={6} md={6} lg={6}>
                        <Button color="success" variant="contained" onClick={onBtnCreateProductClick}>Create Product</Button>
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
                                    <TableCell align="center"><b>IMAGE</b></TableCell>
                                    <TableCell align="center"><b>NAME</b></TableCell>
                                    <TableCell align="center"><b>CATEGORY</b></TableCell>
                                    <TableCell align="center"><b>ORIGINAL PRICE</b></TableCell>
                                    <TableCell align="center"><b>PROMOTION PRICE</b></TableCell>
                                    <TableCell align="center"><b>DETAIL</b></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(copyList.length > 0 ? copyList : productPagination).map((product, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row" align="center">
                                            {index + 1 + (currentPage_product - 1) * 10}
                                        </TableCell>
                                        <TableCell align="center"><img src={product.imageURl} style={{ width: "80px" }}></img></TableCell>
                                        <TableCell align="center">{product.name}</TableCell>
                                        <TableCell align="center">{(product.type) ? (product.type.name) : (<>Undefined</>)}</TableCell>
                                        <TableCell align="center">{product.buyPrice}</TableCell>
                                        <TableCell align="center">{product.promotionPrice}</TableCell>
                                        <TableCell align="center">
                                            <Button variant="contained" style={{ marginRight: "2px" }} onClick={() => onProductDetailClick(product)}>View Detail</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid container mt={3} justifyContent="flex-end">
                    <Grid item>
                        <Pagination count={noPage_product} defaultPage={currentPage_product} onChange={changePageHandler} color="primary" variant="outlined" shape="rounded" />
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
                                        <b>CREATE NEW PRODUCT</b>
                                    </Typography>
                                    <Grid container mt={2}>
                                        <Grid item xs={2} sm={2} md={2} lg={2} pt={1}>
                                            <FormLabel>Product Type</FormLabel>
                                        </Grid>
                                        <Grid item xs={4} sm={4} md={4} lg={4}>
                                            <FormControl fullWidth>
                                                <InputLabel>-- Select product Type --</InputLabel>
                                                <Select
                                                    value={createProductType}
                                                    label="Product Type"
                                                    onChange={onProductTypeChange}
                                                >
                                                    {productType.map((value, index) => {
                                                        return <MenuItem key={index} value={value._id}>{value.name}</MenuItem>
                                                    })}

                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={2} sm={2} md={2} lg={2} pt={1} pl={2}>
                                            <FormLabel>Name</FormLabel>
                                        </Grid>
                                        <Grid item xs={4} sm={4} md={4} lg={4}>
                                            <TextField fullWidth variant="outlined" label="Product Name" value={createProductName} onChange={onCreateProductNameChange}></TextField>
                                        </Grid>
                                    </Grid>
                                    <Grid container mt={1}>
                                        <Grid item xs={2} sm={2} md={2} lg={2} pt={1}>
                                            <FormLabel>Image URl</FormLabel>
                                        </Grid>
                                        <Grid item xs={4} sm={4} md={4} lg={4}>
                                            <TextField fullWidth variant="outlined" label="Image URl" value={createImageURL} onChange={onCreateImageURLChange} ></TextField>
                                        </Grid>
                                        <Grid item xs={2} sm={2} md={2} lg={2} pl={2} pt={1}>
                                            <FormLabel>Amount</FormLabel>
                                        </Grid>
                                        <Grid item xs={4} sm={4} md={4} lg={4}>
                                            <TextField fullWidth variant="outlined" label="Product Amount" value={createProductAmount} onChange={onCreateAmountChange} ></TextField>
                                        </Grid>
                                    </Grid>
                                    <Grid container mt={1}>
                                        <Grid item xs={2} sm={2} md={2} lg={2} pt={1}>
                                            <FormLabel>Original price</FormLabel>
                                        </Grid>
                                        <Grid item xs={4} sm={4} md={4} lg={4}>
                                            <TextField fullWidth variant="outlined" label="Original Price" value={createOriginalPrice} onChange={onCreateOrginalPriceChange}></TextField>
                                        </Grid>
                                        <Grid item xs={2} sm={2} md={2} lg={2} pl={2} pt={1}>
                                            <FormLabel>Promotion Price</FormLabel>
                                        </Grid>
                                        <Grid item xs={4} sm={4} md={4} lg={4}>
                                            <TextField fullWidth variant="outlined" label="Promotion Price" value={createPromotionPrice} onChange={onCreatePromotionPriceChange}></TextField>
                                        </Grid>
                                    </Grid>
                                    <Grid container mt={2}>
                                        <Grid item xs={12} textAlign="end">
                                            <Button color="success" variant="contained" className="me-1" onClick={onCreateProductClick}>Create</Button>
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