import React, { useRef, useState, useEffect } from "react"
import { styled } from "@material-ui/core/styles"
import { useMouse, useLocalStorage } from "react-use"
import AutoIcon from "../AutoIcon"
import EditIcon from "@material-ui/icons/Edit"
import WorkIcon from "@material-ui/icons/PlayCircleOutline"
import HomeIcon from "@material-ui/icons/Home"
import ExitToAppIcon from "@material-ui/icons/ExitToApp"

const emptyObj = {}
const EXTEND_AMOUNT = 1.2

const Page = styled("div")({
  position: "relative",
  width: "100vw",
  height: "100vh",
  overflow: "scroll"
})
const Header = styled("div")({
  position: "fixed",
  left: 20,
  top: 20,
  zIndex: 1,
  opacity: 0.2,
  "&:hover": {
    opacity: 0.75
  },
  maxWidth: "45%",
  transition: "top linear 30ms, left linear 30ms, opacity 1s ease"
})
const Title = styled("div")({
  display: "flex",
  fontSize: 32,
  fontWeight: "bold",
  backgroundColor: "#000",
  color: "#fff",
  "& input": {
    width: "100%",
    padding: 16
  }
})
const Details = styled("div")({
  display: "flex",
  flexWrap: "wrap",
  "& > *": {
    backgroundColor: "#000",
    padding: 8,
    margin: 8,
    marginLeft: 0,
    marginBottom: 0
  },
  color: "#fff",
  "& input": {
    padding: 8
  }
})
const EditableText = styled("input")({
  color: "inherit",
  backgroundColor: "inherit",
  fontWeight: "inherit",
  fontSize: "inherit",
  fontFamily: "inherit",
  border: "none"
})
const ClickableText = styled("div")({
  backgroundColor: "#000",
  cursor: "pointer",
  transition: "transform 120ms",
  "&:hover": {
    transform: "scale(1.1,1.1)"
  },
  display: "inline-flex",
  justifyContent: "center",
  alignItems: "center"
})
const Detail = styled("div")({
  backgroundColor: "#000",
  display: "inline-flex",
  justifyContent: "center",
  alignItems: "center"
})
const RightSide = styled("div")({
  position: "fixed",
  right: 20,
  top: 20,
  zIndex: 1,
  opacity: 0.2,
  justifyContent: "flex-end",
  flexWrap: "wrap",
  textAlign: "right",
  maxWidth: "45%",
  flexWrap: "wrap",
  "&:hover": {
    opacity: 0.75
  },
  transition: "top linear 30ms, right linear 30ms, opacity 1s ease"
})

const Content = styled("div")({
  position: "absolute",
  top: 0,
  left: 0,
  minWidth: "100vw",
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "top linear 30ms, left linear 30ms"
})

const Href = styled("a")({
  textDecoration: "none",
  color: "inherit"
})

const possibleVisibilities = ["private", "public"]

export default ({
  children,
  onChangeVisibility,
  visibility,
  onChangeTitle,
  onChangeId,
  onCreateNew,
  onClickToggleEdit,
  onClickHome,
  inEditMode,
  onClone,
  id,
  title,
  treeOwnerName,
  currentUserAccountName,
  onLogOut
}) => {
  const contentRef = useRef()
  const [headerFocus, changeHeaderFocus] = useState(false)
  const [extendMode, changeExtendMode] = useLocalStorage("extendMode", false)
  const [editableTitle, changeEditableTitle] = useState(title)
  const [editableId, changeEditableId] = useState(id)

  useEffect(() => title && changeEditableTitle(title), [title])
  useEffect(() => id && changeEditableId(id), [id])

  let contentStyle = emptyObj
  let bgStyle = emptyObj
  let invBGStyle = emptyObj

  // TODO don't cause rerenders for mouse at top level
  const { docX = 0, docY = 0 } = useMouse(contentRef)

  const affX = -(docX - window.innerWidth / 2) * (EXTEND_AMOUNT - 1)
  const affY = -(docY - 50) * (EXTEND_AMOUNT - 1)

  if (extendMode) {
    contentStyle = { left: affX, top: affY }
    bgStyle = { left: affX * 0.5, top: 50 + affY * 0.5 }
    invBGStyle = { right: bgStyle.left * -1, top: bgStyle.top }
  }
  return (
    <Page>
      <Header
        onClick={() => changeHeaderFocus(true)}
        onMouseLeave={() => changeHeaderFocus(false)}
        style={!headerFocus ? bgStyle : { ...bgStyle, zIndex: 100, opacity: 1 }}
      >
        <Title>
          <EditableText
            value={editableTitle || ""}
            onChange={e => changeEditableTitle(e.target.value)}
            onKeyPress={e =>
              e.key === "Enter" && window.document.activeElement.blur()
            }
            onBlur={() =>
              editableTitle !== title && onChangeTitle(editableTitle)
            }
          />
        </Title>
        <Details>
          <div style={{ padding: 0, paddingLeft: 8 }}>
            {treeOwnerName || ""} /{" "}
            <EditableText
              onChange={e => changeEditableId(e.target.value)}
              onKeyPress={e =>
                e.key === "Enter" && window.document.activeElement.blur()
              }
              onBlur={() => id !== editableId && onChangeId(editableId)}
              value={editableId || ""}
            />
          </div>
          <ClickableText
            onClick={() =>
              onChangeVisibility(
                possibleVisibilities[
                  (possibleVisibilities.indexOf(visibility) + 1) %
                    possibleVisibilities.length
                ]
              )
            }
          >
            {visibility}
          </ClickableText>
          <ClickableText onClick={onClone}>clone</ClickableText>
        </Details>
        <Details>
          <ClickableText onClick={() => changeExtendMode(!extendMode)}>
            extended: {extendMode ? "on" : "off"}
          </ClickableText>
        </Details>
      </Header>
      <RightSide
        onClick={() => changeHeaderFocus(true)}
        onMouseLeave={() => changeHeaderFocus(false)}
        style={
          !headerFocus ? invBGStyle : { ...invBGStyle, zIndex: 100, opacity: 1 }
        }
      >
        <Details style={{ fontSize: 18, justifyContent: "flex-end" }}>
          <ClickableText>
            <Href
              href="https://github.com/seveibar/worktree"
              style={{ display: "flex", alignItems: "center" }}
            >
              <AutoIcon style={{ marginRight: 8 }} name="Github" />
              <b>Work Tree</b>
            </Href>
          </ClickableText>
          <ClickableText>
            <Href
              href="https://twitter.com/seveibar"
              style={{ display: "flex", alignItems: "center" }}
            >
              <AutoIcon style={{ marginRight: 8 }} name="Twitter" />
              <b>Updates</b>
            </Href>
          </ClickableText>
          {currentUserAccountName && (
            <>
              <ClickableText onClick={onClickHome}>
                <HomeIcon style={{ marginRight: 8 }} />@{currentUserAccountName}
              </ClickableText>
              <ClickableText onClick={onLogOut}>
                <ExitToAppIcon style={{}} />
              </ClickableText>
            </>
          )}
        </Details>
        <Details style={{ justifyContent: "flex-end" }}>
          <ClickableText onClick={onClickToggleEdit}>
            {!inEditMode ? (
              <>
                <EditIcon style={{ marginRight: 8 }} />
                Edit
              </>
            ) : (
              <>
                <WorkIcon style={{ marginRight: 8 }} />
                Work
              </>
            )}
          </ClickableText>
          <ClickableText onClick={onCreateNew}>Create New</ClickableText>
        </Details>
      </RightSide>
      <Content id="page-content" style={contentStyle} ref={contentRef}>
        {children}
      </Content>
    </Page>
  )
}
