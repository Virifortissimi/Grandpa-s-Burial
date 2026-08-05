export const optimizeCloudinaryImage = (url, width) =>
  url.replace('/image/upload/', `/image/upload/f_auto,q_auto:good,w_${width},c_limit/`);

export const shuffleImages = (images) => {
  const shuffled = [...images];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled;
};
