// src/utils/imageOptimizer.js
export const getOptimizedImageUrl = (url, options = {}) => {
  if (!url || !url.includes('cloudinary.com')) return url;

  if (url.includes('/upload/w_')) return url;

  const {
    width = 800,
    height = 800,
    crop = 'limit',
    quality = 'auto',
    format = 'auto'
  } = options;

  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) return url;

  const beforeUpload = url.substring(0, uploadIndex);
  const afterUpload = url.substring(uploadIndex + 8);

  const transformations = `w_${width},h_${height},c_${crop},q_${quality},f_${format}`;
  return `${beforeUpload}/upload/${transformations}/${afterUpload}`;
};


export const getThumbnail = (url) => getOptimizedImageUrl(url, {
  width: 400,
  height: 400,
  crop: 'fill'
});

export const getCardImage = (url) => getOptimizedImageUrl(url, {
  width: 600,
  height: 600
});


export const getFullImage = (url) => getOptimizedImageUrl(url, {
  width: 1200,
  height: 1200
});


export const getIcon = (url) => getOptimizedImageUrl(url, {
  width: 100,
  height: 100,
  crop: 'fill'
});
