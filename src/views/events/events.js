import React, { useEffect, useState } from "react";
import { getEvents, updateEvent, deleteEventById, createEvent } from "../../services/eventService";
import {CButton, CListGroup, CModalTitle, CListGroupItem, CModal, CModalHeader, CModalBody, CModalFooter, CFormInput, CFormLabel, CFormFeedback} from "@coreui/react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../authConfig";
import RichTextEditor from "../../components/RichTextEditor";
import RichTextListItem from "../../components/RichTextListItem";
import { deleteImageById } from "../../services/imageService";

const Feed = () => {
  const { instance, accounts } = useMsal();
  const [accessToken, setAccessToken] = useState(null);
  const [data, setData] = useState([]);
  const [deleteData, setDeleteData] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [textField1, setTextField1] = useState("");
  const [textField2, setTextField2] = useState("");
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [textEditField1, setTextEditField1] = useState("");
  const [textEditField2, setTextEditField2] = useState("");
  const [textEditId, setTextEditId] = useState("");
  const [editData, setEditData] = useState("");
  const [field1Error, setField1Error] = useState(false);
  const [field2Error, setField2Error] = useState(false);
  const [addresses, setAddresses] = useState([]);

  const handleAddressesChange = (addresses) => {
    setAddresses(addresses);
  };

  let newArray = new Array();
  const ListItem = (item) => {
    return (
      <CListGroupItem>
        <h4>{item.item.title}</h4>
        <RichTextListItem item={{ __html: item.item.description }} />
        <p>{item.item.url}</p>
        <div
          style={buttons}
          className="d-grid gap-2 d-md-flex justify-content-md-end"
        >
          {newArray.map((item, index) => (
            <p key={index}>{item.name}</p>
          ))}
          <CButton
            color="dark"
            variant="outline"
            className="float-right"
            onClick={() => onEdit(item)}
          >
            Edit
          </CButton>
          <CButton
            color="warning"
            className="float-right"
            onClick={() => onDelete(item)}
          >
            Delete
          </CButton>
        </div>
      </CListGroupItem>
    );
  };

  const getBlobImageUrls = (itemDescription) => {
    const regex = /<img.*?src="(https:\/\/csb100320022a0453ef.blob.core.windows.net\/vitafilestorage\/[a-zA-Z0-9-]+)"/g;
    const imageUrls = [];
    let match;
    while ((match = regex.exec(itemDescription))) {
      imageUrls.push(match[1]);
    }
    return imageUrls;
  }

  // eslint-disable-next-line no-unused-vars
  const onEdit = (item) => {
    setEditData(item);

    setTextEditField1(item.item.title);
    setTextEditField2(item.item.description);
    setTextEditId(item.item.id);
    setAddresses(getBlobImageUrls(item.item.description))

    setEditModalVisible(true);
  };
  const onDelete = (item) => {
    setDeleteData(item);
    setDeleteModalVisible(true);
  };
  const deleteEvent = async (item) => {
    await deleteEventById(item.id, accessToken);
    const imageUrls = getBlobImageUrls(item.description)
    await Promise.all(
      imageUrls.map(async (imageUrl) => {
          try {
            await deleteImageById(imageUrl, accessToken)

          } catch (error) {
            console.error("Error deleting image:", error);
          }
      })
    );

    setDeleteModalVisible(false);
    handleActivities();
  };
  const DeleteModal = () => {
    const item = deleteData.item;
    return (
      <CModal
        visible={deleteModalVisible}
        onClose={handleCancel}
        backdrop="static"
      >
        <CModalHeader>
          <CModalTitle>Are you sure you want to delete this event?</CModalTitle>
        </CModalHeader>
        <CModalFooter>
          <CButton
            color="dark"
            variant="outline"
            onClick={() => handleCancel()}
          >
            Cancel
          </CButton>
          <CButton color="warning" onClick={() => deleteEvent(item)}>
            Delete
          </CButton>
        </CModalFooter>
      </CModal>
    );
  };

  const handleSave = async () => {
    const imageUrls = getBlobImageUrls(textField2)
    if (!textField1) {
      setField1Error(true);
      return;
    }
    if (!textField2) {
      setField2Error(true);
      return;
    }
    const postData = {
      title: textField1,
      description: textField2,
    };
    try {
      // eslint-disable-next-line no-unused-vars
      var events = await createEvent(postData, accessToken);

      // Delete unused images
      // TODO: make one function and use that instead of having the function declared again
      await Promise.all(
        addresses.map(async (imageUrl) => {
          if (!imageUrls.includes(imageUrl)) {
            try {
              await deleteImageById(imageUrl, accessToken)

            } catch (error) {
              console.error("Error deleting image:", error);
            }
          }
        })
      );
      setIsOpen(false);
      setTextField1("");
      setTextField2("");
      setAddresses([]);
      handleActivities();
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleCancel = () => {
    setTextField1("");
    setTextField2("");
    setAddresses([]);
    setIsOpen(false);
    setDeleteModalVisible(false);
    setEditModalVisible(false);
    setField1Error(false);
    setField2Error(false);
  };

  const handleUpdate = async () => {
    const imageUrls = getBlobImageUrls(textEditField2)

    if (!textEditField1) {
      setField1Error(true);
      return;
    }
    if (!textEditField2) {
      setField2Error(true);
      return;
    }

    const UpdateEvent = {
      id: textEditId,
      title: textEditField1,
      description: textEditField2,
    };

    try {
      await updateEvent(UpdateEvent, accessToken);

      // Delete unused images
      // TODO: make one function and use that instead of having the function declared again
      await Promise.all(
        addresses.map(async (imageUrl) => {
          if (!imageUrls.includes(imageUrl)) {
            try {
              await deleteImageById(imageUrl, accessToken)

            } catch (error) {
              console.error("Error deleting image:", error);
            }
          }
        })
      );

      setIsOpen(false);
      handleCancel();
      await handleActivities();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    requestAccessToken();
  }, [accessToken]);

  const requestAccessToken = async () => {
    const request = {
      ...loginRequest,
      account: accounts[0],
    };

    // Silently acquires an access token which is then attached to a request for Microsoft Graph data
    await instance
      .acquireTokenSilent(request)
      .then((response) => {
        setAccessToken(response.accessToken);
      })
      .then(() => {
        if (accessToken) {
          handleActivities();
        }
        // eslint-disable-next-line no-unused-vars
      })
      .catch((e) => {
        instance
          .acquireTokenPopup(request)
          .then((response) => {
            setAccessToken(response.accessToken);
          })
          .then(() => {
            if (accessToken) {
              handleActivities();
            }
          });
      });
  };

  const handleActivities = async () => {
    var events = await getEvents(accessToken);
    setData(await events.data);
  };
  return (
    <>
      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
        <CButton color="dark" style={buttons} onClick={() => setIsOpen(true)}>
          New event
        </CButton>
      </div>
      <CModal
        visible={isOpen}
        onClose={handleCancel}
        backdrop="static"
        className="modal-xl"
      >
        <CModalHeader closeButton>
          <h5>New event</h5>
        </CModalHeader>
        <CModalBody>
          <form>
            <CFormLabel htmlFor="exampleFormControlTextarea1">Title</CFormLabel>
            <CFormInput
              placeholder=""
              value={textField1}
              id="exampleFormControlTextarea1"
              required
              maxLength="50"
              onChange={(e) => setTextField1(e.target.value)}
              isInvalid={field1Error}
            ></CFormInput>
            {field1Error && (
              <CFormFeedback>Field is required</CFormFeedback>
            )}
            <CFormLabel htmlFor="exampleFormControlTextarea2">
              Description
            </CFormLabel>
            <RichTextEditor
              value={textField2}
              onChange={(value) => setTextField2(value)}
              token={accessToken}
              isInvalid={field2Error}
              addresses={addresses}
              onAddressesChange={handleAddressesChange}
            />
            {field2Error && (
              <CFormFeedback>Field is required</CFormFeedback>
            )}
          </form>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={handleSave}>
            Save
          </CButton>
          <CButton color="secondary" onClick={handleCancel}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>
      {/* Begin Edit */}
      <CModal
        visible={editModalVisible}
        onClose={handleCancel}
        backdrop="static"
        className="modal-xl"
      >
        <CModalHeader closeButton>
          <h5>Edit event item</h5>
        </CModalHeader>
        <CModalBody>
          <form>
            <CFormLabel htmlFor="exampleFormControlTextarea1">Title</CFormLabel>
            <CFormInput
              placeholder=""
              maxLength="50"
              required
              value={textEditField1}
              id="exampleFormControlTextarea1"
              onChange={(e) => setTextEditField1(e.target.value)}
              isInvalid={field1Error}
            ></CFormInput>
            {field1Error && (
              <CFormFeedback>Field is required</CFormFeedback>
            )}
            <CFormLabel htmlFor="exampleFormControlTextarea2">
              Description
            </CFormLabel>
            <RichTextEditor
              value={textEditField2}
              onChange={(value) => setTextEditField2(value)}
              token={accessToken}
              isInvalid={field2Error}
              addresses={addresses}
              onAddressesChange={handleAddressesChange}
            />
            {field2Error && (
              <CFormFeedback>Field is required</CFormFeedback>
            )}
          </form>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={handleUpdate}>
            Save
          </CButton>
          <CButton color="secondary" onClick={handleCancel}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>
      {/* End Edit */}
      <DeleteModal />
      <CListGroup>
        {data.map((item, index) => (
          <ListItem key={index} item={item} />
        ))}
      </CListGroup>
    </>
  );
};

const buttons = {
  marginBottom: "20px",
};

export default Feed;
