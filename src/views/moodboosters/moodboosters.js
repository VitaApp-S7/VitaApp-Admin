import React, { useEffect, useState } from "react"
import {
  createActivity,
  deleteActivityById,
  getAllActivities,
  updateActivity,
  getAllCategories
} from "../../services/moodboosterService"
import {
  CButton,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CListGroup,
  CListGroupItem,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle
} from "@coreui/react"
import { useMsal } from "@azure/msal-react"
import { loginRequest } from "../../authConfig"

const Moodboosters = () => {
  const { instance, accounts } = useMsal()
  const [ accessToken, setAccessToken ] = useState(null)
  const [ data, setData ] = useState([])
  const [ catagories, setCatagories ] = useState([])
  const [ deleteData, setDeleteData ] = useState("")
  const [ editData, setEditData ] = useState("")
  const [ isOpen, setIsOpen ] = useState(false)
  const [ textField1, setTextField1 ] = useState("")
  const [ textField2, setTextField2 ] = useState("")
  const [ textField3, setTextField3 ] = useState("")
  const [ textField4, setTextField4 ] = useState("")
  const [ textEditField1, setTextEditField1 ] = useState("")
  const [ textEditField2, setTextEditField2 ] = useState("")
  const [ textEditField3, setTextEditField3 ] = useState("")
  const [ textEditField4, setTextEditField4 ] = useState("")
  const [ textEditId, setTextEditId ] = useState("")
  const [ deleteModalVisible, setDeleteModalVisible ] = useState(false)
  const [ editModalVisible, setEditModalVisible ] = useState(false)

  const ListItem = (item) => {

    return (
      <CListGroupItem>
        <b>{item.item.title}</b>
        <p>{item.item.description}</p>
        <div
          style={buttons}
          className="d-grid gap-2 d-md-flex justify-content-md-end"
        >
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
    )
  }
  // eslint-disable-next-line no-unused-vars
  const onEdit = (item) => {
    setEditData(item)

    setTextEditField1(item.item.title)
    setTextEditField2(item.item.description)
    setTextEditField3(item.item.category.id)
    setTextEditField4(item.item.points)
    setTextEditId(item.item.id)
    setEditModalVisible(true)
  }
  const onDelete = (item) => {
    setDeleteData(item)
    setDeleteModalVisible(true)
  }
  const deleteMoodbooster = async (item) => {
    await deleteActivityById(item.id, accessToken)
    setDeleteModalVisible(false)
    handleActivities()
  }
  const DeleteModal = () => {
    const item = deleteData.item
    return (
      <CModal visible={deleteModalVisible} onClose={handleCancel} backdrop="static">
        <CModalHeader>
          <CModalTitle>
            Are you sure you want to delete this moodbooster?
          </CModalTitle>
        </CModalHeader>
        <CModalFooter>
          <CButton
            color="dark"
            variant="outline"
            onClick={() => handleCancel()}
          >
            Cancel
          </CButton>
          <CButton color="warning" onClick={() => deleteMoodbooster(item)}>
            Delete
          </CButton>
        </CModalFooter>
      </CModal>
    )
  }

  const handleSave = async () => {
    const postData = {
      title: textField1,
      description: textField2,
      category: catagories.find(x => x.id == textField3),
      points: textField4
    }
    try {
      await createActivity(postData, accessToken)
      setIsOpen(false)
      handleCancel()
      await handleCatagory()
      await handleActivities()
    } catch (error) {
      console.error("Error:", error)
    }
  }
  const handleUpdate = async () => {

    const postData = {
      id: textEditId,
      title: textEditField1,
      description: textEditField2,
      category: catagories.find(x => x.id == textEditField3),
      points: textEditField4,
      status: "ACTIVE"
    }

    console.log(postData)
    try {
      await updateActivity(postData, accessToken)
      setIsOpen(false)
      handleCancel()
      await handleActivities()
      await handleCatagory()
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const handleCancel = () => {
    setTextField1("")
    setTextField2("")
    setTextField3("")
    setTextField4("")
    setTextEditField1("")
    setTextEditField2("")
    setTextEditField3("")
    setTextEditField4("")
    setIsOpen(false)
    setDeleteModalVisible(false)
    setEditModalVisible(false)
  }

  useEffect(() => {
    requestAccestoken()
  }, [ accessToken ])

  const requestAccestoken = async () => {
    const request = {
      ...loginRequest,
      account: accounts[0]
    }

    // Silently acquires an access token which is then attached to a request for Microsoft Graph data
    await instance
      .acquireTokenSilent(request)
      .then((response) => {
        setAccessToken(response.accessToken)
      })
      .then(() => {
        if (accessToken) {
          handleActivities()
          handleCatagory()
        }
        // eslint-disable-next-line no-unused-vars
      })
      .catch(() => {
        instance
          .acquireTokenPopup(request)
          .then((response) => {
            setAccessToken(response.accessToken)
          })
          .then(() => {
            if (accessToken) {
              handleActivities()
            }
          })
      })
  }

  const handleActivities = async () => {
    var activities = await getAllActivities(accessToken)
    setData(await activities)
    console.log(activities)
  }

  const handleCatagory = async () => {
    var catagories = await getAllCategories(accessToken)
    setCatagories(await catagories)
    console.log(catagories)
  }
  return (
    <>
      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
        <CButton color="dark" style={buttons} onClick={() => setIsOpen(true)}>
          New moodbooster
        </CButton>
      </div>
      <CModal visible={isOpen} onClose={handleCancel} backdrop="static">
        <CModalHeader closeButton>
          <h5>New moodbooster</h5>
        </CModalHeader>
        <CModalBody>
          <form>
            <CFormLabel htmlFor="exampleFormControlTextarea1">Title</CFormLabel>
            <CFormInput
              placeholder=""
              value={textField1}
              id="exampleFormControlTextarea1"
              onChange={(e) => setTextField1(e.target.value)}
            ></CFormInput>
            <CFormLabel htmlFor="exampleFormControlTextarea1">
              Description
            </CFormLabel>
            <CFormInput
              placeholder=""
              value={textField2}
              id="exampleFormControlTextarea1"
              maxLength="50"
              onChange={(e) => setTextField2(e.target.value)}
            ></CFormInput>
            <CFormLabel htmlFor="exampleFormControlTextarea1">
              Category
            </CFormLabel>
            {/* <CFormInput
              placeholder=""
              value={textField3}
              id="exampleFormControlTextarea1"
              onChange={(e) => setTextField3(e.target.value)}
            ></CFormInput> */}
            <CFormSelect aria-label="Default select example"
              key="exampleFormControlTextarea1"
              value={textField3}
              onChange={(e) => setTextField3(e.target.value)}>
              <option>Choose a category</option>
              {catagories.map((item, index) => (
                <option key={index} value={item.id}>{item.name}</option>))}
            </CFormSelect>
            <CFormLabel htmlFor="exampleFormControlTextarea1">
              Points
            </CFormLabel>
            <CFormInput
              placeholder=""
              type="number"
              value={textField4}
              id="exampleFormControlTextarea1"
              min="1"
              max="5"
              onChange={(e) => setTextField4(e.target.value)}
            />
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
      <CModal visible={editModalVisible} onClose={handleCancel} backdrop="static">
        <CModalHeader closeButton>
          <h5>Edit moodbooster</h5>
        </CModalHeader>
        <CModalBody>
          <form>
            <CFormLabel htmlFor="exampleFormControlTextarea1">
              Title
            </CFormLabel>
            <CFormInput
              placeholder=""
              value={textEditField1}
              id="exampleFormControlTextarea1"
              onChange={(e) => setTextEditField1(e.target.value)}
            ></CFormInput>
            <CFormLabel htmlFor="exampleFormControlTextarea1">
              Description
            </CFormLabel>
            <CFormInput
              placeholder=""
              value={textEditField2}
              id="exampleFormControlTextarea1"
              maxLength="50"
              onChange={(e) => setTextEditField2(e.target.value)}
            ></CFormInput>
            <CFormLabel htmlFor="exampleFormControlTextarea1">
              Category
            </CFormLabel>
            {/* <CFormInput
              placeholder=""
              value={textEditField3}
              id="exampleFormControlTextarea1"
              onChange={(e) => setTextEditField3(e.target.value)}
            ></CFormInput> */}
            <CFormSelect aria-label="Default select example"
              key="exampleFormControlTextarea1"
              value={textEditField3}
              onChange={(e) => setTextEditField3(e.target.value)}>
              <option>Choose a category</option>
              {catagories.map((item, index) => (
                <option key={index} value={item.id}>{item.name}</option>))}
            </CFormSelect>
            <CFormLabel htmlFor="exampleFormControlTextarea1">
              Points
            </CFormLabel>
            <CFormInput
              placeholder=""
              type="number"
              value={textEditField4}
              id="exampleFormControlTextarea1"
              min="1"
              max="5"
              onChange={(e) => setTextEditField4(e.target.value)}
            />
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

export default Moodboosters
