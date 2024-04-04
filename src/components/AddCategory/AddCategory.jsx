import React, { useEffect, useState } from 'react';
import { Modal, TextField, Button, Box } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { uploadFilePost } from '../../httpCalls/fileUpload';

const AddEditCategoryModal = ({ open, handleClose, initialValues, addCategory, editCategory }) => {
    const { handleSubmit, control, reset, setValue, formState: { errors } } = useForm({
        defaultValues: { category: initialValues.category || '' },
    });

    useEffect(() => {
        if (initialValues) {
            setValue("category", initialValues.category);
        }
    }, [initialValues]);

    const [selectedFile, setSelectedFile] = useState('');
    const [imageError, setImageError] = useState('');


    const onSubmit = async (data) => {
        try {


            if (selectedFile.length == 0) {
                return setImageError('Image is required');
            }

            let url = await uploadFilePost(selectedFile[0], 'Category');



            let formData = {
                category: data.category,
                image: url
            }


            // Check if editing or adding category
            if (initialValues.id) {
                await editCategory(initialValues.id, formData);
            } else {
                await addCategory(formData, selectedFile[0]);
            }


            handleClose();
            setSelectedFile('');
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
        multiple: false,
        onDrop: (acceptedFiles) => {
            setSelectedFile(acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));
        },
    });

    return (
        <Modal open={open} onClose={() => { handleClose(); setSelectedFile(''); setImageError(''); reset(); }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <form style={{ backgroundColor: '#fff', boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px', padding: '16px', borderRadius: '8px', outline: 'none' }} onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name="category"
                    control={control}
                    defaultValue={'hello'} 
                    rules={{ required: 'Category is required' }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Category"
                            name='category'
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            error={!!errors.category}
                            helperText={errors.category && errors.category.message}
                        />
                    )}
                />

                {
                    selectedFile.length > 0 ?
                        <Box>
                            <img src={selectedFile[0]?.preview} alt='' style={{
                                width: "10rem",
                                height: "10rem",
                                objectFit: "cover"
                            }}
                                onLoad={() => { URL.revokeObjectURL(selectedFile[0]?.preview) }} />
                        </Box> :
                        <>
                            < div {...getRootProps()} style={{ marginTop: '16px', border: imageError ? '2px dashed red' : '2px dashed #ccc', borderRadius: '4px', padding: '16px', cursor: 'pointer' }}>
                            <input {...getInputProps()} />
                            <p>Drag 'n' drop an image here, or click to select an image</p>
                            </div>
                            {
                                imageError &&
                                <p style={{color:'red'}}>
                                      {imageError}  
                                </p>
                            }
                        </>
                        
                }
                <Button type="submit" variant="contained" color="primary" style={{ marginTop: '16px' }}>
                    Save
                </Button>
            </form>
        </Modal >
    );
};

export default AddEditCategoryModal;
