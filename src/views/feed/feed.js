import React, { useEffect, useState } from "react"
import { getNews, createNews, updateNews, deleteNewsById } from "../../services/newsService"
import { CButton, CListGroup, CModalTitle, CListGroupItem, CModal, CModalHeader, CModalBody, CModalFooter, CFormTextarea, CFormInput, CFormLabel } from "@coreui/react"
import { useMsal } from "@azure/msal-react"
import { loginRequest } from "../../authConfig"
import RichTextEditor from "../../components/RichTextEditor"
import RichTextListItem from "../../components/RichTextListItem"
import { deleteImageById } from "../../services/imageService";

const Feed = () => {
  const { instance, accounts } = useMsal()
  const [accessToken, setAccessToken] = useState(null)
  const [data, setData] = useState([])
  const [deleteData, setDeleteData] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [editData, setEditData] = useState("")
  const [textField1, setTextField1] = useState("")
  const [textField2, setTextField2] = useState("")
  const [textEditField1, setTextEditField1] = useState("")
  const [textEditField2, setTextEditField2] = useState("")
  const [textEditId, setTextEditId] = useState("")
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [addresses, setAddresses] = useState([]);

  const handleAddressesChange = (addresses) => {
    setAddresses(addresses);
  };

  const ListItem = (item) => {
    return (
      <CListGroupItem>
        <h4>{item.item.title}</h4>
        <RichTextListItem item={{ __html: item.item.description }} />
        <p>{item.item.url}</p>
        <div style={buttons} className="d-grid gap-2 d-md-flex justify-content-md-end">
          <CButton color="dark" variant="outline" className="float-right" onClick={() => onEdit(item)}>Edit</CButton>
          <CButton color="warning" className="float-right" onClick={() => onDelete(item)}>Delete</CButton>
        </div>
      </CListGroupItem>
    )
  }

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
    setEditData(item)

    setTextEditField1(item.item.title)
    setTextEditField2(item.item.description)
    setTextEditId(item.item.id)
    setAddresses(getBlobImageUrls(item.item.description))
    setEditModalVisible(true)
  }
  const onDelete = (item) => {
    setDeleteData(item)
    setDeleteModalVisible(true)
  }
  const deleteItem = async (item) => {
    await deleteNewsById(item.id, accessToken)

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

    setDeleteModalVisible(false)
    handleActivities()
  }
  const DeleteModal = () => {
    const item = deleteData.item
    return (
      <CModal
        visible={deleteModalVisible}
        onClose={handleCancel}
        backdrop="static"
      >
        <CModalHeader>
          <CModalTitle>Are you sure you want to delete this item?</CModalTitle>
        </CModalHeader>
        <CModalFooter>
          <CButton color="dark" variant="outline" onClick={() => handleCancel()}>Cancel</CButton>
          <CButton color="warning" onClick={() => deleteItem(item)}>Delete</CButton >
        </CModalFooter>
      </CModal>)
  }

  const handleSave = async () => {
    const imageUrls = getBlobImageUrls(textField2)

    const postData = {
      title: textField1,
      description: textField2,
    }
    try {
      await createNews(postData, accessToken)

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

      setIsOpen(false)
      setTextField1("")
      setTextField2("")
      setAddresses([]);
      handleActivities()
    } catch (error) {
      console.error("Error:", error)
    }
  }
  const handleCancel = () => {
    setTextField1("")
    setTextField2("")
    setAddresses([]);
    setIsOpen(false)
    setDeleteModalVisible(false)
    setEditModalVisible(false)
  }

  const handleUpdate = async () => {
    const imageUrls = getBlobImageUrls(textEditField2)

    const UpdateNews = {

      id: textEditId,
      title: textEditField1,
      description: textEditField2
    }
    try {
      await updateNews(UpdateNews, accessToken)

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

      setIsOpen(false)
      handleCancel()
      await handleActivities()
    } catch (error) {
      console.error("Error:", error)
    }
  }

  useEffect(() => {
    requestAccestoken()
  }, [accessToken])

  const requestAccestoken = async () => {
    const request = {
      ...loginRequest,
      account: accounts[0]
    }

    // Silently acquires an access token which is then attached to a request for Microsoft Graph data
    await instance.acquireTokenSilent(request).then((response) => {
      setAccessToken(response.accessToken)
    }).then(() => {
      if (accessToken) {
        handleActivities()
      }
      // eslint-disable-next-line no-unused-vars
    }).catch((e) => {
      instance.acquireTokenPopup(request).then((response) => {
        setAccessToken(response.accessToken)
      }).then(() => {
        if (accessToken) {
          handleActivities()
        }
      })
    })

  }

  const handleActivities = async () => {
    var news = await getNews(accessToken)
    setData(await news.data)
  }

  return (
    <>
      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
        <CButton color="dark" style={buttons} onClick={() => setIsOpen(true)}>New item</CButton>
      </div>
      <CModal visible={isOpen} onClose={handleCancel} backdrop="static" className="modal-xl">
        <CModalHeader closeButton>
          <h5>New Item</h5>
        </CModalHeader>
        <CModalBody>
          <form>
            <CFormLabel htmlFor="exampleFormControlTextarea1">Title</CFormLabel>
            <CFormInput placeholder="" value={textField1} id="exampleFormControlTextarea1" maxLength="50" onChange={(e) => setTextField1(e.target.value)} addresses={addresses} onAddressesChange={handleAddressesChange}></CFormInput>
            <CFormLabel htmlFor="exampleFormControlTextarea2">Description</CFormLabel>
            <RichTextEditor value={textField2} onChange={(value) => setTextField2(value)} />
          </form>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={handleSave}>Save</CButton>
          <CButton color="secondary" onClick={handleCancel}>Cancel</CButton>
        </CModalFooter>
      </CModal>
      {/* Begin Edit */}
      <CModal visible={editModalVisible} onClose={handleCancel} backdrop="static" className="modal-xl">
        <CModalHeader closeButton>
          <h5>Edit news item</h5>
        </CModalHeader>
        <CModalBody>
          <form>
            <CFormLabel htmlFor="exampleFormControlTextarea1">
              Title
            </CFormLabel>
            <CFormInput
              placeholder=""
              maxLength="50"
              value={textEditField1}
              id="exampleFormControlTextarea1"
              onChange={(e) => setTextEditField1(e.target.value)}
              addresses={addresses}
              onAddressesChange={handleAddressesChange}
            ></CFormInput>
            <CFormLabel htmlFor="exampleFormControlTextarea1">
              Description
            </CFormLabel>
            <RichTextEditor value={textEditField2} onChange={(value) => setTextEditField2(value)} />
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
  )
}

const buttons = { margin: "10px" }

export default Feed
