import React, { Component } from "react";
import Trix from "trix";
import axios from "axios";
import { uploadImage, getImageById } from "src/services/imageService";

class RichTextEditor extends Component {
  constructor(props) {
    super(props);
    this.trixInput = React.createRef();
  }

  componentDidMount() {
    const { token } = this.props;
    this.trixInput.current.addEventListener("trix-change", (event) => {
      this.props.onChange(event.target.innerHTML); //calling custom event
    });
    this.trixInput.current.addEventListener(
      "trix-attachment-add",
      async (event) => {
        const attachment = event.attachment;
        if (attachment.file) {
          const formData = new FormData();
          formData.append("image", attachment.file);
          const response = await uploadImage(formData, token);
          console.log("id", response.id);
          const imageUrl = await getImageById(response.id, token);
          console.log("imageUrl", imageUrl);
          console.log("response", response);

          // Get the HTML element for the attachment
          const attachmentHtml = attachment.toString();
          const imgMatch = attachmentHtml.match(/<img src="(.*?)"/);
          const imgSrc = imgMatch ? imgMatch[1] : null;

          // Set the img src attribute to the image URL from the image service
          if (imgSrc) {
            const img = new Image();
            img.onload = function () {
              attachment.setAttributes({
                url: imageUrl,
                href: imageUrl,
                width: img.width,
                height: img.height,
              });
            };
            img.src = imgSrc.replace("blob:", "");
          }
        }
      }
    );
  }

  render() {
    return (
      <div>
        <input type="hidden" id="trix" value={this.props.value} />
        <trix-editor input="trix" ref={this.trixInput} />
      </div>
    );
  }
}

export default React.memo(RichTextEditor);
