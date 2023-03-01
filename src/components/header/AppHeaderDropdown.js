import React from "react"
import {
  CAvatar,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle
} from "@coreui/react"
import { cilLockLocked } from "@coreui/icons"
import CIcon from "@coreui/icons-react"
import { useMsal } from "@azure/msal-react"
import avatar8 from "./../../assets/images/avatars/8.jpg"


const AppHeaderDropdown = () => {
  const { instance } = useMsal()

  const handleLogout = (logoutType) => {

    if (logoutType === "redirect") {
      instance.logoutRedirect({ postLogoutRedirectUri: "/" })
    }
  }
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <CAvatar src={avatar8} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownItem href="#" onClick={() => handleLogout("redirect")}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Log Out
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
