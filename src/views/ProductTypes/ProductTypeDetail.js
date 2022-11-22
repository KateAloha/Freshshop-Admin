import { Container, Grid, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button, Pagination, TextField, FormLabel, Snackbar, Alert, Modal, Box, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"

const ProductTypeDetail = () => {

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
    const navigate = useNavigate()

    const [productList, setProductList] = useState([])
    const [typeName, setTypeName] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [openDeleteModal, setOpenDeleteModal] = useState(false)

    const [alert, setAlert] = useState(false);
    const [textAlert, setTextAlert] = useState('')
    const [alertColor, setAlertColor] = useState("error")
    const [updateData, setUpdateData] = useState(0)

    const noPage = Math.ceil(productList.length / 10)
    const productListPagination = productList.slice((currentPage - 1) * 10, currentPage * 10)

    const getAPI = async (paramId, paramBody) => {
        const response = await fetch(`https://freshop-backendcloud.herokuapp.com/productTypeRouters/${paramId}`, paramBody)
        const data = await response.json()
        return data.productType
    }

    useEffect(() => {
        getAPI(paramId).then((data) => {
            setProductList(data.products)
            setTypeName(data.name)

        }).catch((error) => {
            console.log(error)
        })
    }, [paramId, updateData])

    const onTypeNameChange = (e) => {
        setTypeName(e.target.value)
    }

    const changePageHandler = (event, value) => {
        setCurrentPage(value)
    }

    const onProductDetailClick = (product) => {
        navigate(`/products/${product._id}`)
    }

    const handleCloseAlert = () => setAlert(false) 

    const onBtnEditClick = () => {
        if (typeName != "") {
            const body = {
                method: 'PUT',
                body: JSON.stringify({
                    name: typeName
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                }
            }

            getAPI(paramId, body)
                .then((data) => {
                    console.log(data)
                    setAlert(true);
                    setAlertColor("success");
                    setTextAlert("Update ProductType ID: " + paramId + " successfully!");
                    setUpdateData(updateData + 1)
                }).catch((error) => {
                    setAlert(true)
                    setAlertColor("error");
                    setTextAlert("Update ProductType ID: " + paramId + " fail!, ERROR: " + error);
                    setUpdateData(updateData + 1)
                })
        } else {
            setAlert(true);
            setAlertColor("error");
            setTextAlert("Product Type name is required")
            setUpdateData(updateData + 1)
        }
    }

    const onBtnDeleteClick = () => {
        setOpenDeleteModal(true)
    }

    const onBtnCancelDeleteClick = () => {
        setOpenDeleteModal(false)
    }

    const onBtnConfirmDeleteClick = () => {
        fetch(`https://freshop-backendcloud.herokuapp.com/productTypeRouters/` + paramId, { method: 'DELETE' })
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
                navigate('/producttypes')
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
            <Grid container mt={2} >
                <Grid item xs={2} sm={2} md={2} lg={2} pt={1}>
                    <FormLabel>Type Code :</FormLabel>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4}>
                    <TextField fullWidth variant="outlined" value={paramId} disabled></TextField>
                </Grid>
                <Grid item xs={2} sm={2} md={2} lg={2} pl={2} pt={1}>
                    <FormLabel>Type Name :</FormLabel>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4}>
                    <TextField fullWidth id="outlined-basic" variant="outlined" value={typeName} onChange={onTypeNameChange} />
                </Grid>
            </Grid>
            <Container>
                <Grid container mt={4}>
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow >
                                    <TableCell align="center"><b>STT</b></TableCell>
                                    <TableCell align="center"><b>IMAGE</b></TableCell>
                                    <TableCell align="center"><b>NAME</b></TableCell>
                                    <TableCell align="center"><b>ORIGINAL PRICE</b></TableCell>
                                    <TableCell align="center"><b>PROMOTION PRICE</b></TableCell>
                                    <TableCell align="center"><b>DETAIL</b></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {productListPagination.map((product, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row" align="center">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell align="center"><img src={product.imageURl} style={{ width: "80px" }}></img></TableCell>
                                        <TableCell align="center">{product.name}</TableCell>
                                        <TableCell align="center">{product.buyPrice}</TableCell>
                                        <TableCell align="center">{product.promotionPrice}</TableCell>
                                        <TableCell align="center">
                                            <Button variant="contained" style={{ marginRight: "2px" }} onClick={() => onProductDetailClick(product)}>Detail</Button>
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
                            <b>DELETE PRODUCT TYPE</b>
                        </Typography>
                        <Grid container mt={4} textAlign={'center'}>
                            <p>Do you want to delete Product Type ID <b>{paramId}</b> ? </p>
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
            </Container>
        </>
    )
}

export default ProductTypeDetail