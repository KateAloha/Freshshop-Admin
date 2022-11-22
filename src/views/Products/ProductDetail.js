import { Container, Grid, TextField, FormLabel, Snackbar, Alert, Button, FormControl, Modal, Box, Typography} from "@mui/material"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom"
import { getProductTypeAction } from "src/actions/ProductTypeAction";


const ProductDetail = () => {

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

    const { paramId } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [productImage, setProductImage] = useState('')
    const [productName, setProductName] = useState('')
    const [type, setProductType] = useState('')
    const [typeId, setTypeId] = useState('')
    const [productAmount, setProductAmount] = useState(1)
    const [originalPrice, setOriginalPrice] = useState(0)
    const [promotionPrice, setPromotionPrice] = useState(0)
    const [productDescription, setProductDescription] = useState('')
    const [openDeleteModal, setOpenDeleteModal] = useState(false)

    const [alert, setAlert] = useState(false);
    const [textAlert, setTextAlert] = useState('')
    const [alertColor, setAlertColor] = useState("error")
    const [updateData, setUpdateData] = useState(0)

    const { productType } = useSelector((reduxData) => reduxData.ProductTypeReducer)

    const getAPI = async (paramId, paramBody) => {
        const response = await fetch(`https://freshop-backendcloud.herokuapp.com/productRouters/${paramId}`, paramBody)
        const data = await response.json()
        return data.product
    }

    useEffect(() => {
        dispatch(getProductTypeAction())
        getAPI(paramId).then((data) => {
            setProductImage(data.imageURl)
            setProductName(data.name)
            setProductType(data.type.name)
            setProductAmount(data.amount)
            setOriginalPrice(data.buyPrice)
            setPromotionPrice(data.promotionPrice)
            setProductDescription(data.description)
            setTypeId(data.type._id)
        }).catch((error) => {
            console.log(error)
        })
    }, [paramId, updateData])

    const onImageUrlChange = (e) => {
        setProductImage(e.target.value)
    }

    const onProductNameChange = (e) => {
        setProductName(e.target.value)
    }

    const onProductTypeChange = (e) => {
        let typeId = productType.find((value) => value.name === e.target.value)
        setProductType(e.target.value)
        setTypeId(typeId._id)
    }

    const onProductAmountChange = (e) => {
        setProductAmount(e.target.value)
    }

    const onOriginalPriceChange = (e) => {
        setOriginalPrice(e.target.value)
    }

    const onPromotionPriceChange = (e) => {
        setPromotionPrice(e.target.value)
    }

    const handleCloseAlert = () => setAlert(false)

    const onBtnEditClick = () => {
        var vProductUpdateCheck = {
            name: productName,
            description: productDescription,
            type: typeId,
            imageURl: productImage,
            buyPrice: Number(originalPrice),
            promotionPrice: Number(promotionPrice),
            amount: Number(productAmount),
        }

        const checkValidate = validate(vProductUpdateCheck)
        if (checkValidate) {
            const body = {
                method: "PUT",
                body: JSON.stringify({
                    name: vProductUpdateCheck.name,
                    type: vProductUpdateCheck.type,
                    imageURl: vProductUpdateCheck.imageURl,
                    buyPrice: vProductUpdateCheck.buyPrice,
                    promotionPrice: vProductUpdateCheck.promotionPrice,
                    amount: vProductUpdateCheck.amount
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                }
            }
            getAPI(paramId, body)
                .then((data) => {
                    setAlert(true)
                    setAlertColor("success")
                    setTextAlert("Update Product ID: " + paramId + " successfully!")
                    setUpdateData(updateData + 1)
                }).catch((error) => {
                    setAlert(true)
                    setAlertColor("error")
                    setTextAlert("Update Product ID: " + paramId + " fail!, ERROR: " + error)
                    setUpdateData(updateData + 1)
                })
        }
    }

    const validate = (paramProductUpdate) => {
        if (paramProductUpdate.name === "") {
            setAlert(true)
            setAlertColor("error")
            setTextAlert("Product name is required!")
            return false
        } else if (paramProductUpdate.type === "") {
            setAlert(true)
            setAlertColor("error")
            setTextAlert("Product type is required!")
            return false
        } else if (paramProductUpdate.imageURl === "") {
            setAlert(true)
            setAlertColor("error")
            setTextAlert("Image URL is required!")
            return false
        } else if (isNaN(paramProductUpdate.buyPrice)) {
            setAlert(true)
            setAlertColor("error")
            setTextAlert("Original price must be a number!")
            return false
        } else if (paramProductUpdate.buyPrice === "") {
            setAlert(true)
            setAlertColor("error")
            setTextAlert("Original price is required!")
            return false
        } else if (isNaN(paramProductUpdate.promotionPrice)) {
            setAlert(true)
            setAlertColor("error")
            setTextAlert("Promotion price must be a number!")
            return false
        } else if (paramProductUpdate.promotionPrice === "") {
            setAlert(true)
            setAlertColor("error")
            setTextAlert("Promotion is required!")
            return false
        } else if (isNaN(paramProductUpdate.amount)) {
            setAlert(true)
            setAlertColor("error")
            setTextAlert("Amount must be a number!")
            return false
        } else if (paramProductUpdate.amount === "") {
            setAlert(true)
            setAlertColor("error")
            setTextAlert("Amount is required!")
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
        fetch(`https://freshop-backendcloud.herokuapp.com/productRouters/` + paramId, { method: 'DELETE' })
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
                navigate('/products')
            })
            .catch((error) => {
                setAlert(true)
                setAlertColor("error");
                setTextAlert("Delete ProductType ID: " + paramId + " fail!, ERROR: " + error);
                setUpdateData(updateData + 1)
            })
    }


    return (
        <>
            <Grid container mt={2}>
                <Grid item xs={2} sm={2} md={2} lg={2} pt={1}>
                    <FormLabel>Product Image :</FormLabel>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4}>
                    <img src={productImage} style={{ width: "200px" }}></img>
                </Grid>
            </Grid>
            <Grid container mt={2}>
                <Grid item xs={2} sm={2} md={2} lg={2} pt={1}>
                    <FormLabel>Product Code :</FormLabel>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4}>
                    <TextField fullWidth variant="outlined" value={paramId} disabled></TextField>
                </Grid>

            </Grid>
            <Grid container mt={2}>
                <Grid item xs={2} sm={2} md={2} lg={2} pt={1}>
                    <FormLabel>Image URL :</FormLabel>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4}>
                    <TextField fullWidth variant="outlined" value={productImage} onChange={onImageUrlChange}></TextField>
                </Grid>
                <Grid item xs={2} sm={2} md={2} lg={2} pl={2} pt={1}>
                    <FormLabel>Product Name :</FormLabel>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4}>
                    <TextField fullWidth id="outlined-basic" variant="outlined" value={productName} onChange={onProductNameChange} />
                </Grid>
            </Grid>
            <Grid container mt={2}>
                <Grid item xs={2} sm={2} md={2} lg={2} pt={1}>
                    <FormLabel>Product Type :</FormLabel>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4}>
                    {/* <TextField fullWidth variant="outlined" value={productType}></TextField> */}
                    <FormControl fullWidth>
                        <select className="form-control" style={{ height: "60px", backgroundColor: "#ebedef" }} value={type} onChange={onProductTypeChange}>
                            {
                                productType.map((element, index) => {
                                    return <option key={index} value={element.name}>{element.name}</option>
                                })
                            }
                        </select>
                    </FormControl>
                </Grid>
                <Grid item xs={2} sm={2} md={2} lg={2} pl={2} pt={1}>
                    <FormLabel>Product Amount :</FormLabel>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4}>
                    <TextField fullWidth id="outlined-basic" variant="outlined" value={productAmount} onChange={onProductAmountChange} />
                </Grid>
            </Grid>
            <Grid container mt={2}>
                <Grid item xs={2} sm={2} md={2} lg={2} pt={1}>
                    <FormLabel>Original Price :</FormLabel>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4}>
                    <TextField fullWidth variant="outlined" value={originalPrice} onChange={onOriginalPriceChange}></TextField>
                </Grid>
                <Grid item xs={2} sm={2} md={2} lg={2} pl={2} pt={1}>
                    <FormLabel>Promotion Price :</FormLabel>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4}>
                    <TextField fullWidth id="outlined-basic" variant="outlined" value={promotionPrice} onChange={onPromotionPriceChange} />
                </Grid>
            </Grid>
            <Button variant="contained" style={{ marginTop: "20px", width: "130px", backgroundColor: "red", float: "right" }} onClick={onBtnDeleteClick}>Delete</Button>
            <Button variant="contained" style={{ marginRight: "10px", marginTop: "20px", width: "130px", backgroundColor: "green", float: "right" }} onClick={onBtnEditClick}>Edit</Button>
            <Modal
                open={openDeleteModal}
            >
                <Box sx={style}>
                    <Typography variant="h5" component="h2" textAlign={'center'}>
                        <b>DELETE PRODUCT</b>
                    </Typography>
                    <Grid container mt={4} textAlign={'center'}>
                        <p>Do you want to delete Product ID <b>{paramId}</b> ? </p>
                    </Grid>
                    <Grid container mt={4}>
                        <Grid item xs={12} textAlign="end">
                            <Button color="error" variant="contained" className="me-1" onClick={onBtnConfirmDeleteClick}>Confirm</Button>
                            <Button color="info" variant="contained" onClick={onBtnCancelDeleteClick}>Cancel</Button>
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
        </>
    )
}

export default ProductDetail