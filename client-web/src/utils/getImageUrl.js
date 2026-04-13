export const getImageUrl = (imagePath) => {
  // Block localhost images completely
  if (imagePath?.includes('localhost') || imagePath?.includes('127.0.0.1')) {
    return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop';
  }
  
  // Handle full HTTPS URLs
  if (imagePath?.startsWith('https://') || imagePath?.startsWith('data:')) {
    return imagePath;
  }
  
  // Handle relative paths - use production backend
  if (imagePath && !imagePath.startsWith('http')) {
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `https://himilocoffee.onrender.com${cleanPath}`;
  }
  
  // Default fallback
  return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop';
};
