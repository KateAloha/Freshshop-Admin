import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChangeNoPage, getProductTypeAction } from "src/actions/ProductTypeAction";
import { Container, Grid, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button, Pagination, TextField, Modal, Box, Typography, FormLabel, Snackbar, Alert } from "@mui/material"
import { useNavigate } from "react-router-dom";

const ProductType = () => {

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

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [copyList, setCopyList] = useState([])
    const [createTypeName, setCreateTypeName] = useState('')
    const [openCreateModal, setOpenCreateModal] = useState(false)

    const [alert, setAlert] = useState(false);
    const [textAlert, setTextAlert] = useState('')
    const [alertColor, setAlertColor] = useState("error")
    const [updateData, setUpdateData] = useState(0)

    const { currentPage, productType, noPage } = useSelector((reduxData) => reduxData.ProductTypeReducer)
    const productTypePagination = productType.slice((currentPage - 1) * 10, currentPage * 10)

    const createAPIType = async (paramBody) => {
        const response = await fetch(`https://freshop-backendcloud.herokuapp.com/productTypeRouters`, paramBody)
        const data = await response.json()
        return data.newProductType
    }

    const changePageHandler = (event, value) => {
        dispatch(ChangeNoPage(value))
    }

    const requestSearch = (searched) => {
        setCopyList(productType.filter((item) => item.name.toLowerCase().includes(searched.toLowerCase())))
    }

    const onProductTypeDetailClick = (productType) => {
        navigate(`${productType._id}`)
    }

    const onBtnCreateTypeClick = () => {
        setOpenCreateModal(true)
    }

    const onCreateTypeNameChange = (e) => {
        setCreateTypeName(e.target.value)
    }

    const handleCloseAlert = () => setAlert(false)

    const onCreateTypeClick = () => {
        if (createTypeName != "") {
            const body = {
                method: "POST",
                body: JSON.stringify({
                    name: createTypeName
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                }
            }
            createAPIType(body).
                then((data) => {
                    setAlert(true);
                    setAlertColor("success");
                    setTextAlert("Create New product successfully!");
                    setUpdateData(updateData + 1)
                    setCreateTypeName("")
                    setOpenCreateModal(false)
                }).catch((error) => {
                    setAlert(true)
                    setAlertColor("error");
                    setTextAlert("Create New Type fail! ERROR: " + error);
                    setUpdateData(updateData + 1)
                })
        } else {
            setAlert(true)
            setAlertColor("error");
            setTextAlert("Type name is required!");
            setUpdateData(updateData + 1)
        }
    }

    const onCancelCreate = () => {
        setOpenCreateModal(false)
        setCreateTypeName("")
    }

    useEffect(() => {
        dispatch(getProductTypeAction())
    }, [currentPage, updateData])

    return (
        <>

            <Container>
                <Grid container mt={4}>
                    <Grid item xs={6} sm={6} md={6} lg={6}>
                        <Button color="success" variant="contained" onClick={onBtnCreateTypeClick}>Create Product Type</Button>
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
                                    <TableCell align="center"><b>NAME</b></TableCell>
                                    <TableCell align="center"><b># PRODUCTS</b></TableCell>
                                    <TableCell align="center"><b>DETAIL</b></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(copyList.length > 0 ? copyList : productTypePagination).map((productType, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row" align="center">
                                            {index + 1 + (currentPage - 1) * 10}
                                        </TableCell>
                                        <TableCell align="center">{productType.name}</TableCell>
                                        <TableCell align="center">{productType.products.length}</TableCell>
                                        <TableCell align="center">
                                            <Button variant="contained" style={{ marginRight: "2px" }} onClick={() => onProductTypeDetailClick(productType)}>View Detail</Button>
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
                                        <b>CREATE NEW TYPE</b>
                                    </Typography>
                                    <Grid container mt={2}>
                                        <Grid item xs={4} sm={4} md={4} lg={4} pt={1} pl={2}>
                                            <FormLabel>Type Name</FormLabel>
                                        </Grid>
                                        <Grid item xs={8} sm={8} md={8} lg={8}>
                                            <TextField fullWidth variant="outlined" label="Type Name" value={createTypeName} onChange={onCreateTypeNameChange}></TextField>
                                        </Grid>
                                    </Grid>
                                    <Grid container mt={2}>
                                        <Grid item xs={12} textAlign="end">
                                            <Button color="success" variant="contained" className="me-1" onClick={onCreateTypeClick}>Create</Button>
                                            <Button color="error" variant="contained" onClick={onCancelCreate}>Cancel</Button>
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
export default ProductType; 