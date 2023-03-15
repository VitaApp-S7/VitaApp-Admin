import React from "react";

function RichTextListItem(props) {
    return (
      <div className="trix-content" dangerouslySetInnerHTML={props.item} />
    );
  }
  

export default RichTextListItem;
