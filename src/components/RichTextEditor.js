import React, { Component } from "react";
import "trix/dist/trix.css";
import Trix from "trix";
import axios from "axios";
import { uploadImage, getImageById } from "src/services/imageService";

class RichTextEditor extends Component {
  constructor(props) {
    super(props);
    this.trixInput = React.createRef();
  }

  // componentDidMount() {
  //   this.trixInput.current.addEventListener("trix-change", (event) => {
  //     console.log("trix-change");
  //     this.props.onChange(event.target.innerHTML); //calling custom event
  //   });

  //   // Add event listener for image uploads
  //   this.trixInput.current.addEventListener("trix-attachment-add", (event) => {
  //     if (event.attachment.file) {
  //       console.log("trix-attachment");
  //       this.uploadFileAttachment(event.attachment);
  //     }
  //   });
  // }

  componentDidMount() {
    this.trixInput.current.addEventListener("trix-change", event => {
      this.props.onChange(event.target.innerHTML); //calling custom event
    });

    // Add event listener for trix-attachment-add
    this.trixInput.current.addEventListener("trix-attachment-add", this.handleAttachmentAdd);
  }

  handleAttachmentAdd = (event) => {
    const attachment = event.attachment;
    if (attachment.file) {
      this.uploadFileAttachment(attachment);
    }
  };

  async uploadFileAttachment(attachment) {
    const file = attachment.file;
    const formData = new FormData();

    formData.append("Content-Type", file.type);
    formData.append("image", file);


    let responseData = await uploadImage(formData, this.props.token);
    console.log(responseData);
    // const url = responseData.url;
    // const attributes = {
    //   url: url,
    //   href: url + "?content-disposition=attachment",
    // };

    const url = responseData.url;
    console.log("url", url);
    //const id = responseData.id;
    //let url = "http:localhost:5010/image/" + id;
    attachment.setAttributes({
      url: url,
      href: `\${url}?content-disposition=attachment`,
      src: url, // Set the correct src attribute
    });

    // Force Trix to re-render the attachment with the updated attributes
    const editor = this.trixInput.current.editor;
    editor.updateContents((delta) => delta.retain(editor.getDocument().length));

    // Replace the image src in the editor
    const imgElement = editor.element.querySelector(`img[data-trix-store-key^="imageElement/\${attachment.attachmentId}"]`);
    if (imgElement) {
      imgElement.setAttribute("src", url);
      imgElement.setAttribute("data-trix-store-key", `imageElement/\${attachment.attachmentId}/\${url}`);
    }

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