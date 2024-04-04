import React, { useEffect, useState } from 'react';
import { Modal, TextField, Button, Box, IconButton, Select, MenuItem } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import {  uploadFilesPost } from '../../httpCalls/fileUpload';
import { Close } from '@mui/icons-material';
import { getAllCategories } from '../../httpCalls/category';

const AddEditProductModal = ({ open, handleClose, initialValues, addProduct, editProduct }) => {


    const [selectedFiles, setSelectedFiles] = useState([]);
    const [imageError, setImageError] = useState('');
    const [sizes, setSizes] = useState([]);
    const [sizeError, setSizeError] = useState('');
    const [categories, setCategories] = useState([]);


    const { handleSubmit, control, reset, setValue, formState: { errors } } = useForm({
        defaultValues: initialValues,
    });


    useEffect(() => {
        if (initialValues) {
            setValue("name", initialValues.name);
            setValue("quantityPerSize", initialValues.quantityPerSize);
            setValue("description", initialValues.description);
            setValue("rating", initialValues.rating);
            setValue("code", initialValues.code);
            setValue("price", initialValues.price);
            setValue("category", initialValues.category);
            setSizes(initialValues.sizes ?? []);
        }
    }, [initialValues]);


    const onSubmit = async (data) => {
        try {
            if (selectedFiles.length === 0) {
                return setImageError('Image is required');
            }

            if (sizes.length === 0) {
                return setSizeError('Sizes is required');
            }

            setSizeError('');

            const urls = await uploadFilesPost(selectedFiles, 'Products');

            const formData = {
                name: data.name,
                sizes: sizes,
                description: data.description,
                images: urls,
                code: data.code,
                price: data.price,
                offer: data.offer,
                category: data.category
            };

            if (initialValues.id) {
                await editProduct(initialValues.id, formData);
            } else {
                await addProduct(formData);
            }

            handleClose();
            setSelectedFiles([]);
            setSizes([]);
            reset();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // React Dropzone configuration
    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/*': [],
        },
        multiple: true,
        onDrop: (acceptedFiles) => {
            setSelectedFiles(acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));
        },
    });


    const handleAddSize = () => {
        setSizes([...sizes, { name: '', quantity: '' }]);
    };

    const handleRemoveSize = (index) => {
        const newSizes = [...sizes];
        newSizes.splice(index, 1);
        setSizes(newSizes);
    };

    const handleSizeChange = (index, property, value) => {
        const newSizes = [...sizes];
        newSizes[index][property] = value;
        setSizes(newSizes);
    };

    const getAllCategory = async () => {
        try {
            const data = await getAllCategories();
            setCategories(data);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getAllCategory();
    },[])

    return (
        <Modal open={open} onClose={() => { handleClose(); setSelectedFiles([]); setImageError(''); reset(); setSizes([]); setSizeError(''); }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <form style={{
                backgroundColor: '#fff',
                boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
                padding: '16px',
                borderRadius: '8px',
                outline: 'none',
                maxHeight: '95vh', // Set maximum height
                overflowY: 'auto' // Enable vertical scrolling
            }} onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name="name"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Name is required' }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Name"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            error={!!errors.name}
                            helperText={errors.name && errors.name.message}
                        />
                    )}
                />
                <Controller
                    name="description"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Description is required' }}
                    render={({ field }) => (
                        <TextField
                            multiline
                            rows={3}
                            {...field}
                            label="Description"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            error={!!errors.description}
                            helperText={errors.description && errors.description.message}
                        />
                    )}
                />

                <Controller
                    name="category"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Category is required' }}
                    render={({ field }) => (
                        <>
                            <Select
                                {...field}
                                displayEmpty
                                defaultValue=""
                                margin="normal"
                                fullWidth
                                variant="outlined"
                                error={!!errors.doctor}
                            >

                                <MenuItem value="" disabled>
                                    Select Category
                                </MenuItem>
                                {
                                    categories?.map((catg) => (
                                        <MenuItem key={catg._id} value={catg._id}>{catg.category}</MenuItem>
                                    ))
                                }

                            </Select>
                            {errors.doctor && (
                                <Typography variant="body2" color="error">
                                    {errors.doctor.message}
                                </Typography>
                            )}
                        </>
                    )}

                />

                <Controller
                    name="code"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Code is required' }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Code"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            error={!!errors.code}
                            helperText={errors.code && errors.code.message}
                        />
                    )}
                />

                <Box sx={{
                    display: 'flex',
                    gap:3,
                }}>
                    <Controller
                        name="price"
                        control={control}
                        defaultValue=""
                        rules={{ required: 'Price is required' }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                type='number'
                                label="Price"
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                error={!!errors.price}
                                helperText={errors.price && errors.price.message}
                            />
                        )}
                    />

                    <Controller
                        name="offer"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
                                {...field}
                                type='number'
                                label="Offer"
                                fullWidth
                                margin="normal"
                                variant="outlined"
                            />
                        )}
                    />

                </Box>
                
                {/* Sizes */}
                {sizes.map((size, index) => (
                    <div style={{
                        display: 'flex',
                        gap: 2,
                        alignItems:'center'
                    }} key={index}>
                        <TextField
                            label={`Size Name ${index + 1}`}
                            value={size.name}
                            onChange={(e) => handleSizeChange(index, 'name', e.target.value)}
                            
                            margin="normal"
                            variant="outlined"
                            style={{ marginBottom: '8px', width:'80%' }}
                        />
                        <TextField
                            label={`Quantity ${index + 1}`}
                            value={size.quantity}
                            onChange={(e) => handleSizeChange(index, 'quantity', e.target.value)}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            style={{ marginBottom: '8px', width: '80%' }}
                        />
                        <IconButton onClick={() => handleRemoveSize(index)} color="secondary"><Close/></IconButton>
                    </div>
                ))}
                <Button onClick={handleAddSize}>Add Size</Button>
                {sizeError && (
                    <p style={{ color: 'red' }}>
                        {sizeError}
                    </p>
                )}

                

                <div {...getRootProps()} style={{ marginTop: '16px', border: imageError ? '2px dashed red' : '2px dashed #ccc', borderRadius: '4px', padding: '16px', cursor: 'pointer' }}>
                    <input {...getInputProps()} />
                    <p>Drag 'n' drop images here, or click to select images</p>
                </div>
                {selectedFiles.length > 0 && (
                    <Box>
                        {selectedFiles.map(file => (
                            <img
                                key={file.name}
                                src={URL.createObjectURL(file)}
                                alt=''
                                style={{ width: "10rem", height: "10rem", objectFit: "cover" }}
                                onLoad={() => { URL.revokeObjectURL(URL.createObjectURL(file)) }}
                            />
                        ))}
                    </Box>
                )}
                {imageError && (
                    <p style={{ color: 'red' }}>
                        {imageError}
                    </p>
                )}
                <Button type="submit" variant="contained" color="primary" style={{ marginTop: '16px' }}>
                    Save
                </Button>
            </form>
        </Modal>
    );
};

export default AddEditProductModal;
