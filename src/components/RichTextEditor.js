import React, { Component } from "react";
import Trix from "trix";

document.addEventListener("trix-before-initialize", () => {
    // Change Trix.config if you need
  })

const RichTextEditor = () => {
    return (
        <div>
            <input
                type="hidden"
                id="trix"
            />
            <trix-editor input="trix" />
        </div>
    );
}

export default React.memo(RichTextEditor)
