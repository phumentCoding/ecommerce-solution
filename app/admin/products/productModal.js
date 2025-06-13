import React, { useRef } from 'react';
import {
  Dialog, DialogContent, DialogActions,
  Box, Typography, IconButton, Button,
  TextField, Grid, Alert, Fade, Avatar
} from '@mui/material';
import { Add, Close, UploadFile } from '@mui/icons-material';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

const ProductModal = ({
  open,
  handleClose,
  handleSubmit,
  formData,
  handleChange,
  error,
  editingProduct,
  handleImageUpload
}) => {
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  const fileInputRef = useRef();

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleImageUpload(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          bgcolor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          maxWidth: 700,
          width: '100%',
          p: 0,
          overflow: 'visible',
          animation: 'modalPop 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          '@keyframes modalPop': {
            from: { opacity: 0, transform: 'scale(0.9) translateY(50px)' },
            to: { opacity: 1, transform: 'scale(1) translateY(0)' }
          }
        }
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          opacity: 0.1
        }}
      >
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            particles: {
              number: { value: 30 },
              color: { value: ['#2563eb', '#06b6d4'] },
              shape: { type: 'circle' },
              size: { value: { min: 1, max: 5 } },
              move: {
                enable: true,
                speed: 0.5,
                direction: 'none',
                random: true,
                outModes: { default: 'out' }
              },
              opacity: { value: 0.3 }
            },
            interactivity: { events: { onHover: { enable: true, mode: 'repulse' } } }
          }}
        />
      </Box>

      <Box
        sx={{
          position: 'relative',
          background: 'linear-gradient(90deg, #3b82f6 0%, #22d3ee 100%)',
          px: 4,
          py: 3,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
          zIndex: 1
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            left: 24,
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#fff',
            fontSize: 36,
            animation: 'pulseIcon 2s infinite',
            '@keyframes pulseIcon': {
              '0%': { transform: 'translateY(-50%) scale(1)' },
              '50%': { transform: 'translateY(-50%) scale(1.2)' },
              '100%': { transform: 'translateY(-50%) scale(1)' }
            }
          }}
        >
          <Add />
        </Box>
        <Typography
          variant="h5"
          sx={{
            color: '#fff',
            fontWeight: 800,
            letterSpacing: 1.2,
            textAlign: 'center',
            mx: 'auto',
            textTransform: 'uppercase',
            background: 'linear-gradient(45deg, #fff 30%, #e0f2fe 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          {editingProduct ? 'Edit Product' : 'Create New Product'}
        </Typography>
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 12,
            top: 12,
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            color: '#fff',
            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.4)' },
            transition: 'all 0.2s',
            zIndex: 2
          }}
          size="large"
        >
          <Close fontSize="medium" />
        </IconButton>
      </Box>

      <DialogContent sx={{ px: 5, pt: 2, pb: 0, zIndex: 1 }}>
        <Fade in={!!error}>
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            {error}
          </Alert>
        </Fade>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Product Name *"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              variant="outlined"
              InputProps={{
                sx: {
                  borderRadius: 3,
                  bgcolor: 'rgba(255, 255, 255, 0.8)',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 1)' },
                  transition: 'all 0.2s',
                  fontWeight: 500
                }
              }}
              InputLabelProps={{ sx: { color: '#64748b', fontWeight: 600 } }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Price *"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              inputProps={{ step: 0.01, min: 0 }}
              required
              variant="outlined"
              InputProps={{
                sx: {
                  borderRadius: 3,
                  bgcolor: 'rgba(255, 255, 255, 0.8)',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 1)' },
                  transition: 'all 0.2s',
                  fontWeight: 500
                }
              }}
              InputLabelProps={{ sx: { color: '#64748b', fontWeight: 600 } }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description *"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              variant="outlined"
              multiline
              minRows={3}
              InputProps={{
                sx: {
                  borderRadius: 3,
                  bgcolor: 'rgba(255, 255, 255, 0.8)',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 1)' },
                  transition: 'all 0.2s'
                }
              }}
              InputLabelProps={{ sx: { color: '#64748b', fontWeight: 600 } }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Stock *"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              inputProps={{ min: 0 }}
              required
              variant="outlined"
              InputProps={{
                sx: {
                  borderRadius: 3,
                  bgcolor: 'rgba(255, 255, 255, 0.8)',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 1)' },
                  transition: 'all 0.2s',
                  fontWeight: 500
                }
              }}
              InputLabelProps={{ sx: { color: '#64748b', fontWeight: 600 } }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Category *"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              variant="outlined"
              InputProps={{
                sx: {
                  borderRadius: 3,
                  bgcolor: 'rgba(255, 255, 255, 0.8)',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 1)' },
                  transition: 'all 0.2s',
                  fontWeight: 500
                }
              }}
              InputLabelProps={{ sx: { color: '#64748b', fontWeight: 600 } }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Image URL (optional)"
              name="image"
              value={formData.image}
              onChange={handleChange}
              variant="outlined"
              helperText="Or upload from folder below"
              InputProps={{
                sx: {
                  borderRadius: 3,
                  bgcolor: 'rgba(255, 255, 255, 0.8)',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 1)' },
                  transition: 'all 0.2s'
                }
              }}
              InputLabelProps={{ sx: { color: '#64748b', fontWeight: 600 } }}
            />
            <Box mt={2}>
              <Button
                variant="outlined"
                fullWidth
                component="label"
                startIcon={<UploadFile />}
                sx={{ fontWeight: 600 }}
              >
                Upload Image
                <input hidden accept="image/*" type="file" onChange={handleFileSelect} ref={fileInputRef} />
              </Button>
              {formData.image && (
                <Avatar
                  src={formData.image}
                  alt="Preview"
                  variant="rounded"
                  sx={{ width: 80, height: 80, mt: 2 }}
                />
              )}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions
        sx={{
          justifyContent: 'flex-end',
          px: 5,
          pb: 3,
          pt: 2,
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
          background: 'rgba(250, 250, 250, 0.9)',
          backdropFilter: 'blur(5px)'
        }}
      >
        <Button onClick={handleClose} sx={{ fontWeight: 600, color: '#3b82f6', px: 4, py: 1.5 }}>CANCEL</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            fontWeight: 700,
            px: 4,
            py: 1.5,
            borderRadius: 2,
            background: 'linear-gradient(90deg, #3b82f6 0%, #22d3ee 100%)',
            color: '#fff',
            '&:hover': {
              background: 'linear-gradient(90deg, #2563eb 0%, #06b6d4 100%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 12px rgba(0,0,0,0.3)'
            },
            transition: 'all 0.2s'
          }}
        >
          {editingProduct ? 'UPDATE PRODUCT' : 'ADD PRODUCT'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductModal;
