import * as React from "react";
import {
  Avatar,
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
} from "@mui/material";
import { PiBellBold } from "react-icons/pi";
import { RxQuestionMarkCircled } from "react-icons/rx";
import { FiLogOut, FiSettings } from "react-icons/fi";
import { MdKeyboardArrowDown } from "react-icons/md";

function Profile() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSettings = () => {
    console.log("Settings clicked");
    handleClose();
  };

  const handleLogout = () => {
    console.log("Logout clicked");
    handleClose();
  };

  return (
    <div className="w-[360px] h-10  bg-white flex items-center justify-between px-4 rounded-lg shadow-sm">
      <Stack direction="row" spacing={2} alignItems="center">
        <Badge color="error" badgeContent={2}>
          <PiBellBold style={{ fontSize: 22, cursor: "pointer" }} />
        </Badge>
        <Badge color="secondary" badgeContent={0}>
          <RxQuestionMarkCircled style={{ fontSize: 22, cursor: "pointer" }} />
        </Badge>
      </Stack>

      <Stack direction="row" spacing={1} alignItems="center">
        <Avatar
          alt="User Avatar"
          src="src\assets\avatar\avatar.jpg"
          sx={{ width: 30, height: 30 }}
        />

        <Stack spacing={0} sx={{ lineHeight: 1 }}>
          <span className="text-sm font-medium text-black">Adam Smith</span>
          <span className="text-xs text-gray-500">
            Vice President of Human Resource
          </span>
        </Stack>

        <Tooltip title="Open menu">
          <IconButton onClick={handleMenuClick} size="small">
            <MdKeyboardArrowDown style={{ fontSize: 18, color: "black" }} />
          </IconButton>
        </Tooltip>
      </Stack>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            minWidth: 180,
            borderRadius: 2,
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem style={{fontSize:12}} onClick={handleSettings}>
          <FiSettings style={{ marginRight: 8, fontSize: 14}} />
          Settings
        </MenuItem>
        <MenuItem style={{fontSize:12}} onClick={handleLogout}>
          <FiLogOut style={{ marginRight: 8,fontSize: 14 }} />
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
}

export default Profile;