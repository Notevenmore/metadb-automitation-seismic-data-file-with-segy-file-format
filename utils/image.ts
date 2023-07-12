export const uploadIMG = (callback: (final: string) => void) => {
  let reader = new FileReader();
  let input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = _this => {
    let files = Array.from(input.files)[0];
    reader.onload = () => {
      if (reader.readyState === 2) {
        if (/^image\/[\w]+$/.exec(files.type)) {
          const result = reader.result as string;
          const final = (result).replace(
            /^(.+)(?=,)/.exec(result)[0] + ',',
            '',
          );
          callback(final);
        } else {
          alert('Please upload only image formatted file (JPG/PNG)');
          return;
        }
      }
    };
    reader.readAsDataURL(files);
  };
  input.click();
};