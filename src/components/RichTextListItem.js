import React from "react";

function RichTextListItem(props) {
    return (
      <div dangerouslySetInnerHTML={props.item} />
    );
  }
  

export default RichTextListItem;
