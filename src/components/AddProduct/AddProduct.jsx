import { useEffect, useState } from "react";
import { Modal, TextField, Button, Box, IconButton, Typography, Grid, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { uploadFilesPost } from "../../httpCalls/fileUpload";
import { CloseOutlined } from "@mui/icons-material";

const AddEditProductModal = ({
  open,
  handleClose,
  initialValues,
  addProduct,
  editProduct,
  reRender,
  setReRender
}) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imageError, setImageError] = useState("");
  const [removed, setRemoved] = useState([]);
  const [topics, setTopics] = useState([]);
  const [newTopic, setNewTopic] = useState(""); // State for the new topic input

  const { handleSubmit, control, reset, setValue, formState: { errors } } = useForm({
    defaultValues: initialValues,
  });

  useEffect(() => {
    if (initialValues) {
      setValue("name", initialValues.name);
      setValue("duration", initialValues.duration);
      setValue("schedule", initialValues.schedule);
      setValue("ageGroup", initialValues.ageGroup);
      setValue("price", initialValues.price);
      setValue("description", initialValues.description); // Add description field
      setSelectedFiles(initialValues.images || []);
      setTopics(initialValues.topicsCovered || []); 
    }
  }, [initialValues]);

  const onSubmit = async (data) => {
    try {
      if (selectedFiles.length === 0) {
        return setImageError("Image is required");
      }

      let urls = [];
      if (initialValues._id) {
        urls = await uploadFilesPost(selectedFiles, "Products", removed);
      } else {
        urls = await uploadFilesPost(selectedFiles, "Products");
      }

      const { price, description, name, schedule, ageGroup, duration } = data;
      const formData = {
        name,
        description, // Include description in the form data
        images: urls,
        price,
        duration,
        schedule,
        topicsCovered: topics,
        ageGroup,
      };

      if (initialValues._id) {
        await editProduct(initialValues._id, formData);
      } else {
        await addProduct(formData);
      }
      setReRender(!reRender);
      reset();
      setSelectedFiles([]);
      setRemoved([]);
      setTopics([]);
      setNewTopic(""); // Reset the new topic input after submission
      handleClose();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    multiple: true,
    onDrop: (acceptedFiles) => {
      setSelectedFiles([
        ...selectedFiles,
        ...acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        ),
      ]);
    },
  });

  const handleRemoveImage = (indexToRemove) => {
    const updatedSelectedFiles = [...selectedFiles];
    let remove = updatedSelectedFiles.splice(indexToRemove, 1);

    if (initialValues._id) {
      setRemoved([...removed, ...remove]);
    }
    setSelectedFiles(updatedSelectedFiles);
  };

  const handleAddTopic = () => {
    if (newTopic.trim() !== "") {
      setTopics([...topics, newTopic]);
      setNewTopic(""); // Clear the input field after adding the topic
    }
  };

  const handleRemoveTopic = (index) => {
    setTopics(topics.filter((_, i) => i !== index));
  };

  const handleImageLoad = (file) => {
    // Revoke object URL after the image has loaded to avoid memory leaks.
    URL.revokeObjectURL(file.preview);
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        handleClose();
        setSelectedFiles([]);
        setImageError("");
        reset();
      }}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <form
        style={{
          backgroundColor: "#fff",
          boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
          padding: "12px", // Reduced padding further to fit more content
          borderRadius: "8px",
          outline: "none",
          maxHeight: "80vh",
          maxWidth: '80%',
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Typography variant="h6" gutterBottom>
          {initialValues._id ? "Edit Product" : "Add New Product"}
        </Typography>

        <Grid container spacing={1} sx={{ flexWrap: "wrap" }}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Name is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Product Name"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  error={!!errors.name}
                  helperText={errors.name && errors.name.message}
                  size="small" // Reduced size to save space
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Price"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  size="small" // Reduced size to save space
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal" variant="outlined" size="small">
              <InputLabel>Duration</InputLabel>
              <Controller
                name="duration"
                control={control}
                rules={{ required: "Duration is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Duration"
                    error={!!errors.duration}
                  >
                    <MenuItem value="1 week">1 week</MenuItem>
                    <MenuItem value="2 weeks">2 weeks</MenuItem>
                    <MenuItem value="1 month">1 month</MenuItem>
                    <MenuItem value="3 months">3 months</MenuItem>
                    <MenuItem value="4 months">4 months</MenuItem>
                    <MenuItem value="6 months">6 months</MenuItem>
                    <MenuItem value="1 year">1 year</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal" variant="outlined" size="small">
              <InputLabel>Age Group</InputLabel>
              <Controller
                name="ageGroup"
                control={control}
                rules={{ required: "Age Group is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Age Group"
                    error={!!errors.ageGroup}
                  >
                    <MenuItem value="Children">Children</MenuItem>
                    <MenuItem value="Teens">Teens</MenuItem>
                    <MenuItem value="Adults">Adults</MenuItem>
                    <MenuItem value="All Ages">All Ages</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="schedule"
              control={control}
              rules={{ required: "Schedule is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Schedule"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  size="small"
                  error={!!errors.schedule}
                  helperText={errors.schedule && errors.schedule.message}
                />
              )}
            />
          </Grid>

          {/* Description Section */}
          <Grid item xs={12}>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  multiline
                  rows={4} // Multiple lines for better visibility
                  size="small" // Reduced size to save space
                />
              )}
            />
          </Grid>

          {/* Topic Section */}
          <Grid item xs={12} sm={6}>
            <TextField
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              label="Add a Topic"
              fullWidth
              margin="normal"
              variant="outlined"
              size="small" // Reduced size to save space
            />
            <Button
              onClick={handleAddTopic}
              variant="contained"
              color="primary"
              style={{ marginTop: "8px", padding: "6px 16px" }} // Adjusted button size
              size="small"
            >
              Add Topic
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {topics?.map((topic, index) => (
                <Box
                  key={index}
                  sx={{
                    backgroundColor: "#f4f4f4",
                    padding: "8px 16px",
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    {topic}
                  </Typography>
                  <IconButton
                    onClick={() => handleRemoveTopic(index)}
                    sx={{
                      color: "red",
                      backgroundColor: "rgba(0, 0, 0, 0.1)",
                      padding: "4px",
                      borderRadius: "50%",
                    }}
                  >
                    <CloseOutlined />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Image Section */}
          <Grid item xs={12}>
            <div
              {...getRootProps()}
              style={{
                marginBottom: "10px",
                border: "2px dashed #ddd",
                padding: "10px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              <input {...getInputProps()} />
              <Typography>Drag & Drop images here or click to select</Typography>
            </div>
            {imageError && <Typography color="error">{imageError}</Typography>}

            {selectedFiles.length > 0 && (
              <Box sx={{ mt: 2 }}>
                {selectedFiles.map((file, i) => (
                  <Box
                    sx={{
                      width: "8rem",
                      height: "8rem",
                      position: "relative",
                      display: "inline-block",
                      marginRight: "8px",
                    }}
                    key={i}
                  >
                    <img
                      src={file.preview}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                      onLoad={() => handleImageLoad(file)} // Revoke URL once loaded
                    />
                    <IconButton
                      onClick={() => handleRemoveImage(i)}
                      sx={{
                        position: "absolute",
                        right: 0,
                        top: 0,
                        color: "white",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                      }}
                    >
                      <CloseOutlined />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}
          </Grid>
        </Grid>

        <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ padding: "8px 16px" }}
            size="small"
          >
            {initialValues._id ? "Update Product" : "Add Product"}
          </Button>
        </Box>
      </form>
    </Modal>
  );
};

export default AddEditProductModal;
