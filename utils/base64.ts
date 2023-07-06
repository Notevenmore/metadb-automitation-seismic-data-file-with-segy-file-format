export const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    if (reader.result) {
      resolve(reader.result.toString());
    } else {
      reject(reader.result);
    }
  };
  reader.onerror = error => reject(error);
});