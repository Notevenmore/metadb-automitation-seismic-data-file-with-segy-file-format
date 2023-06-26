const types = {
  jpg: 'Image',
  png: 'Image',
  pdf: 'PDF',
  pptx: 'PPTX',
  csv: 'CSV',
  xlsx: 'XLSX',
  las: 'LAS',
};

const getFileType = (filename: string) => {
  const fileExtension = filename.split('.').pop()?.toLowerCase();

  return types[fileExtension];
};

export default getFileType