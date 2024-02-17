import React, { useState } from 'react';


const App = () => {
  const [imageSrc, setImageSrc] = useState('');
  const [asciiText, setAsciiText] = useState('');

  const convertToAscii = () => {
    const asciiChars = ['@', '#', 'S', '%', '?', '*', '+', ';', ':', ',', '.'];
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.src = imageSrc;

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      const maxImageSize = 200; 
      if (width > maxImageSize || height > maxImageSize) {
        if (width > height) {
          height = Math.round((height / width) * maxImageSize);
          width = maxImageSize;
        } else {
          width = Math.round((width / height) * maxImageSize);
          height = maxImageSize;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      const imageData = ctx.getImageData(0, 0, width, height);
      let ascii = '';

      for (let i = 0; i < imageData.data.length; i += 4) {
        const avg = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
        const index = Math.round((avg * (asciiChars.length - 1)) / 255);
        ascii += asciiChars[index];
        if ((i + 4) % (width * 4) === 0) ascii += '\n';
      }

      setAsciiText(ascii);
    };
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setImageSrc(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(asciiText);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="mb-4"
      />
      {imageSrc && (
        <>
          <button
            onClick={convertToAscii}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Convert to ASCII
          </button>
          <div className="mt-4 border border-gray-300 p-4 rounded">
            <pre>{asciiText}</pre>
          </div>
          <button
            onClick={copyToClipboard}
            className="mt-4 flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Copy ASCII Art
          </button>
        </>
      )}
    </div>
  );
};

export default App;

