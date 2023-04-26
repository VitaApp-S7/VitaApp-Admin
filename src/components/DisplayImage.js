import React, { useState, useEffect } from "react";
import { getImageById } from "../services/imageService";

function DisplayImage(props) {
  const [image, setImage] = useState(null);

  useEffect(() => {
    async function fetchImage() {
      try {
        const imageData = await getImageById(props.id, props.token);
        setImage(imageData);
      } catch (error) {
        console.error(error);
      }
    }
    fetchImage();
  }, [props.id, props.token]);

  return (
    <div>
      {image ? (
        <img src={image.data} alt={image.name} />
      ) : (
        <p>Loading image...</p>
      )}
    </div>
  );
}

export default DisplayImage;
