import React, { useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageUploader from "quill-image-uploader";
import { uploadImage } from "src/services/imageService";
import 'quill-image-uploader/dist/quill.imageUploader.min.css';

Quill.register("modules/imageUploader", ImageUploader);


class RichTextEditor extends React.Component {
  constructor(props) {
    super(props);
    this.quillRef = React.createRef();
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = (html) => {
    this.props.onChange(html);
    // this.props.onAddressesChange(this.state.addresses);
  };

  modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      [{ header: 1 }, { header: 2 }, { header: [3, 4, 5, 6] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      [{ color: [] }, { background: [] }],
      [{ font: [] }, { size: ["small", false, "large", "huge"] }],
      ["link", "image"],
      [{ script: "sub" }, { script: "super" }],
      ["blockquote", "code-block"],
      [{ direction: "rtl" }],
      ["clean"],
    ],
    imageUploader: {
      upload: (file) => {
        return new Promise(async (resolve, reject) => {
          const formData = new FormData();
          formData.append("image", file);
          
          try {
            const result = await uploadImage(formData, this.props.token);
            const newAddresses = [...this.props.addresses, result];
            this.props.onAddressesChange(newAddresses);
            resolve(result);
          } catch (error) {
            reject("Upload failed");
            console.error("Error:", error);
          }
        });
      },
    },
  };

  render() {
    return (
      <div>
        <ReactQuill
          onChange={this.handleChange}
          modules={this.modules}
          value={this.props.value}
        />
      </div>
    );
  }
}

export default RichTextEditor;
