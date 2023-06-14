import React, { useEffect, useState } from "react"
import {
    createActivity,
    deleteActivityById,
    getAllActivities,
} from "../../services/moodboosterService"
import {
    getAllChallenges,
    createChallenge,
    deleteChallenge
} from "../../services/challengeService"
import {
    getChallengeTeams,
    createTeam,
    deleteChallengeTeam,
} from "../../services/challengeTeamService"
import { DatePicker, Modal, Select } from 'antd';
import locale from 'antd/es/date-picker/locale/nl_NL'
const { RangePicker } = DatePicker;
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
import RichTextEditor from "../../components/RichTextEditor"
import RichTextListItem from "../../components/RichTextListItem"

const Challenges = () => {
    const { instance, accounts } = useMsal()
    const [accessToken, setAccessToken] = useState(null)
    const [data, setData] = useState([])
    const [moodboosters, setMoodboosters] = useState([])
    const [deleteData, setDeleteData] = useState("")
    const [editData, setEditData] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const [textField1, setTextField1] = useState("")
    const [textField2, setTextField2] = useState("")
    const [textField3, setTextField3] = useState([])
    const [textField4, setTextField4] = useState([])
    const [textTeam1Field1, setTextTeam1Field1] = useState("")
    const [textTeam1Field2, setTextTeam1Field2] = useState("")
    const [textTeam2Field1, setTextTeam2Field1] = useState("")
    const [textTeam2Field2, setTextTeam2Field2] = useState("")
    const [textTeam3Field1, setTextTeam3Field1] = useState("")
    const [textTeam3Field2, setTextTeam3Field2] = useState("")
    const [deleteModalVisible, setDeleteModalVisible] = useState(false)

    const ListItem = (item) => {

        return (
            <CListGroupItem>
                <b>{item.item.title}</b>
                <RichTextListItem item={{ __html: item.item.description }} />
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
        await deleteChallenge(item.id, accessToken)
        await deleteChallengeTeam(item.id, accessToken)
        setDeleteModalVisible(false)
        handleChallenges()
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

        console.log(textField4);
        const postData = {
            title: textField1,
            description: textField2,
            moodboosterIds: textField3,
            startDate: textField4[0],
            endDate: textField4[1]
        }


        console.log(postData);
        try {
            var returnData = await createChallenge(postData, accessToken)
            createTeam({
                name: textTeam1Field1,
                challengeId: returnData.id,
                reward: textTeam1Field2
            }, accessToken)
            createTeam({
                name: textTeam2Field1,
                challengeId: returnData.id,
                reward: textTeam2Field2
            }, accessToken)
            if (textTeam3Field2 || textTeam3Field1) {
                createTeam({
                    name: textTeam3Field1,
                    challengeId: returnData.id,
                    reward: textTeam3Field2
                }, accessToken)
            }
            setIsOpen(false)
            handleCancel()
            await handleMoodboosters()
            await handleChallenges()
        } catch (error) {
            console.error("Error:", error)
        }
    }

    const handleCancel = () => {
        setTextField1("")
        setTextField2("")
        setTextField3("")
        setTextField4("")
        setIsOpen(false)
        setDeleteModalVisible(false)
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
        await instance
            .acquireTokenSilent(request)
            .then((response) => {
                setAccessToken(response.accessToken)
            })
            .then(() => {
                if (accessToken) {
                    console.log("YAY")
                    handleChallenges()
                    handleMoodboosters()
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
                            handleChallenges()
                        }
                    })
            })
    }

    const handleChallenges = async () => {
        var challengesList = await getAllChallenges(accessToken)
        console.log(challengesList)
        setData(challengesList)
        console.log(challengesList)
    }

    const handleMoodboosters = async () => {
        var moodboosters = await getAllActivities(accessToken)
        setMoodboosters(moodboosters)
    }
    return (
        <>
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <CButton color="dark" style={buttons} onClick={() => {
                    setIsOpen(true)
                    setTextField5([{ name: "test", reward: "" }, { name: "test", reward: "" }])
                    console.log(textField5)
                }}>
                    New challenge
                </CButton>
            </div>
            <Modal title="Challenges" open={isOpen} onOk={handleSave} onCancel={handleCancel}>
                <CFormLabel htmlFor="exampleFormControlTextarea1">Title</CFormLabel>
                <CFormInput
                    placeholder=""
                    value={textField1}
                    id="exampleFormControlTextarea1"
                    maxLength="50"
                    onChange={(e) => setTextField1(e.target.value)}
                ></CFormInput>
                <CFormLabel htmlFor="exampleFormControlTextarea1">
                    Description
                </CFormLabel>
                <RichTextEditor value={textField2} onChange={(value) => setTextField2(value)} />
                <CFormLabel htmlFor="exampleFormControlTextarea1">
                    Moodboosters
                </CFormLabel>
                <Select
                    mode="multiple"
                    allowClear
                    style={{ width: '100%' }}
                    placeholder="Please select"
                    onChange={(value) => setTextField3(value.split(','))}
                    options={moodboosters.map((item) => ({ value: item.id, label: item.title }))}
                />
                <CFormLabel htmlFor="exampleFormControlTextarea1">
                    Duration
                </CFormLabel>
                <div></div>
                <RangePicker
                    locale={locale}
                    format="YYYY-MM-DD"
                    onChange={(value, dateString) => setTextField4(dateString)}
                    onOk={(value, dateString) => setTextField4(dateString)}
                />
                <div></div>
                <CFormLabel htmlFor="exampleFormControlTextarea1">Team Name</CFormLabel>
                <CFormInput
                    placeholder=""
                    value={textTeam1Field1}
                    id="exampleFormControlTextarea1"
                    maxLength="50"
                    onChange={(e) => setTextTeam1Field1(e.target.value)}
                ></CFormInput>
                <CFormLabel htmlFor="exampleFormControlTextarea1">Reward</CFormLabel>
                <CFormInput
                    placeholder=""
                    value={textTeam1Field2}
                    id="exampleFormControlTextarea1"
                    maxLength="50"
                    onChange={(e) => setTextTeam1Field2(e.target.value)}
                ></CFormInput>

                <CFormLabel htmlFor="exampleFormControlTextarea1">Team Name</CFormLabel>
                <CFormInput
                    placeholder=""
                    value={textTeam2Field1}
                    id="exampleFormControlTextarea1"
                    maxLength="50"
                    onChange={(e) => setTextTeam2Field1(e.target.value)}
                ></CFormInput>
                <CFormLabel htmlFor="exampleFormControlTextarea1">Reward</CFormLabel>
                <CFormInput
                    placeholder=""
                    value={textTeam2Field2}
                    id="exampleFormControlTextarea1"
                    maxLength="50"
                    onChange={(e) => setTextTeam2Field2(e.target.value)}
                ></CFormInput>
                <CFormLabel htmlFor="exampleFormControlTextarea1">Team Name</CFormLabel>
                <CFormInput
                    placeholder=""
                    value={textTeam3Field1}
                    id="exampleFormControlTextarea1"
                    maxLength="50"
                    onChange={(e) => setTextTeam3Field1(e.target.value)}
                ></CFormInput>
                <CFormLabel htmlFor="exampleFormControlTextarea1">Reward</CFormLabel>
                <CFormInput
                    placeholder=""
                    value={textTeam3Field2}
                    id="exampleFormControlTextarea1"
                    maxLength="50"
                    onChange={(e) => setTextTeam3Field2(e.target.value)}
                ></CFormInput>
            </Modal>
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

export default Challenges
