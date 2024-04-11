import React, { useEffect } from 'react';
import { Modal, TextField, Button, } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

const AddEditCouponModal = ({ open, handleClose, initialValues, addCoupon, editCoupon }) => {

    const { handleSubmit, control, reset, setValue, formState: { errors } } = useForm({
        defaultValues: { code: initialValues.code || '' },
    });

    useEffect(() => {
        if (initialValues) {
            setValue("code", initialValues.code);
        }
    }, [initialValues]);




    const onSubmit = async (data) => {
        try {

            let formData = {
                code: data.code,
                offer: data.offer
            }


            // Check if editing or adding coupon
            if (initialValues.id) {
                await editCoupon(initialValues.id, formData);
            } else {
                await addCoupon(formData);
            }


            handleClose();
            reset();
        } catch (error) {
            console.error('Error:', error);
        }
    };


    return (
        <Modal open={open} onClose={() => { handleClose(); reset(); }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <form style={{ backgroundColor: '#fff', boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px', padding: '16px', borderRadius: '8px', outline: 'none' }} onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name="code"
                    control={control}
                    defaultValue={'hello'}
                    rules={{ required: 'Code is required' }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Code"
                            name='code'
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            error={!!errors.code}
                            helperText={errors.code && errors.code.message}
                        />
                    )}
                />

                <Controller
                    name="offer"
                    control={control}
                    defaultValue={'hello'}
                    rules={{ required: 'Offer is required' }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Offer"
                            name='offer'
                            type='number'
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            error={!!errors.offer}
                            helperText={errors.offer && errors.offer.message}
                        />
                    )}
                />

               
                <Button type="submit" variant="contained" color="primary" style={{ marginTop: '16px' }}>
                    Save
                </Button>
            </form>
        </Modal >
    );
};

export default AddEditCouponModal;
