import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const initialInvites = [
  { code: "AB12CD34", status: "未使用", userId: 1 },
  { code: "EF56GH78", status: "已使用", userId: 2 }
];

export default function Users() {
  const [users, setUsers] = useState([]);
  const [invites, setInvites] = useState(initialInvites);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState("");
  const [dialogAction, setDialogAction] = useState(() => {});
  const [dialogOnlyInfo, setDialogOnlyInfo] = useState(false);
  const [editingLevels, setEditingLevels] = useState({});

  useEffect(() => {
  // 获取用户列表
  fetch("http://localhost:8080/api/user/all-users")
    .then(response => response.json())
    .then(data => {
      const formattedUsers = data.map(user => ({
        id: user.userId,
        username: user.username,
        level: user.level,
        banned: user.isBanned === 1
      }));
      setUsers(formattedUsers);
    })
    .catch(error => {
      console.error("获取用户列表失败:", error);
    });

  // 获取邀请码列表
  fetch("http://localhost:8080/api/admin/invite-code/list")
    .then(response => response.json())
    .then(data => {
      const formattedInvites = data
  .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  .map(item => ({
    code: item.code,
    status: item.status === "ACTIVE" ? "未使用" : "已使用",
    userId: item.status === "ACTIVE" ? "无" : item.usedBy
  }));

      setInvites(formattedInvites);
    })
    .catch(error => {
      console.error("获取邀请码列表失败:", error);
    });
}, []);


  const handleOpenDialog = (content, onConfirm, onlyInfo = false) => {
    setDialogContent(content);
    setDialogOnlyInfo(onlyInfo);
    setDialogAction(() => () => {
      onConfirm();
      setOpenDialog(false);
    });
    setOpenDialog(true);
  };

  const handleLevelChange = (id, value) => {
    setEditingLevels(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleBan = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/admin/ban?userId=${userId}`, {
        method: 'POST',
      });

      if (response.ok) {
        const message = await response.text();
        console.log("封禁成功:", message);
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user.id === userId ? { ...user, banned: true } : user
          )
        );
        handleOpenDialog("用户已成功封禁", () => {}, true);
      } else {
        const error = await response.text();
        console.error("封禁失败:", error);
        handleOpenDialog(`封禁失败: ${error}`, () => {}, true);
      }
    } catch (error) {
      console.error("封禁失败:", error);
      handleOpenDialog(`封禁失败: ${error.message}`, () => {}, true);
    }
  };

  const handleUnban = async (userId) => {
    const user = users.find(u => u.id === userId);
    if (!user.banned) {
      handleOpenDialog("该用户未封禁，无需解禁", () => {}, true);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/admin/unban?userId=${userId}`, {
        method: "POST",
      });

      if (response.ok) {
        const message = await response.text();
        console.log("用户已解禁:", message);
        setUsers(prev =>
          prev.map(user =>
            user.id === userId ? { ...user, banned: false } : user
          )
        );
        handleOpenDialog("用户已成功解禁", () => {}, true);
      } else {
        const error = await response.text();
        console.error("解禁失败:", error);
        handleOpenDialog(`解禁失败: ${error}`, () => {}, true);
      }
    } catch (error) {
      console.error("解禁请求异常:", error);
      handleOpenDialog(`请求异常: ${error.message}`, () => {}, true);
    }
  };

  const handleLevelConfirm = async (id) => {
    const newLevel = editingLevels[id];

    if (!newLevel || isNaN(parseInt(newLevel))) {
      handleOpenDialog("请输入有效的等级", () => {}, true);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/admin/update-level", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `userId=${id}&level=${newLevel}`,
      });

      if (response.ok) {
        const message = await response.text();
        console.log("等级更新成功:", message);
        setUsers(prev =>
          prev.map(user =>
            user.id === id ? { ...user, level: parseInt(newLevel) } : user
          )
        );
        setEditingLevels(prev => {
          const updated = { ...prev };
          delete updated[id];
          return updated;
        });
        handleOpenDialog("等级更新成功", () => {}, true);
      } else {
        const error = await response.text();
        console.error("更新失败:", error);
        handleOpenDialog(`等级更新失败: ${error}`, () => {}, true);
      }
    } catch (error) {
      console.error("请求异常:", error);
      handleOpenDialog(`等级更新异常: ${error.message}`, () => {}, true);
    }
  };

  const generateInviteCode = async () => {
  try {
    const response = await fetch("http://localhost:8080/api/admin/invite-code/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "creatorId=0"
    });

    if (response.ok) {
      const message = await response.text();
      console.log("邀请码创建成功:", message);

      // 再次请求邀请码列表
      const inviteRes = await fetch("http://localhost:8080/api/admin/invite-code/list");
      if (!inviteRes.ok) throw new Error("邀请码列表更新失败");
      const inviteData = await inviteRes.json();

      const formattedInvites = inviteData
  .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  .map(item => ({
    code: item.code,
    status: item.status === "ACTIVE" ? "未使用" : "已使用",
    userId: item.status === "ACTIVE" ? "无" : item.usedBy
  }));


      setInvites(formattedInvites);
      handleOpenDialog("邀请码创建成功", () => {}, true);
    } else {
      const error = await response.text();
      console.error("邀请码创建失败:", error);
      handleOpenDialog(`创建失败: ${error}`, () => {}, true);
    }
  } catch (error) {
    console.error("请求异常:", error);
    handleOpenDialog(`创建异常: ${error.message}`, () => {}, true);
  }
};


  return (
    <Box sx={{ p: 2, height: "calc(100vh - 64px)", width: "100%", display: "flex", flexDirection: "column" }}>
      <Typography variant="h4" gutterBottom>用户管理</Typography>

      {/* 用户表格区域 */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", mb: 2 }}>
        <TableContainer component={Paper} sx={{ flex: 1, overflow: "auto" }}>
          <Table stickyHeader sx={{ minWidth: 1000 }}>
            <TableHead>
              <TableRow>
                {["ID", "用户名", "等级", "封禁状态", "管理"].map(col => (
                  <TableCell key={col} align="center" sx={{ border: "1px solid #ddd" }}>{col}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id}>
                  <TableCell align="center" sx={{ border: "1px solid #ddd" }}>{user.id}</TableCell>
                  <TableCell align="center" sx={{ border: "1px solid #ddd" }}>{user.username}</TableCell>
                  <TableCell align="center" sx={{ border: "1px solid #ddd" }}>
                    <TextField
                      value={editingLevels[user.id] ?? user.level}
                      onChange={(e) => handleLevelChange(user.id, e.target.value)}
                      type="number"
                      size="small"
                      sx={{ width: 60 }}
                    />
                    <Button
                      size="small"
                      sx={{ ml: 1, bgcolor: "#1976d2", color: "#fff", "&:hover": { bgcolor: "#115293" } }}
                      onClick={() => handleLevelConfirm(user.id)}
                    >
                      确定
                    </Button>
                  </TableCell>
                  <TableCell align="center" sx={{ border: "1px solid #ddd" }}>
                    {user.banned ? "封禁" : "未封禁"}
                  </TableCell>
                  <TableCell align="center" sx={{ border: "1px solid #ddd" }}>
                    <Button
                      size="small"
                      onClick={() =>
                        handleOpenDialog("确认封禁该用户？", () => handleBan(user.id))
                      }
                      sx={{
                        mr: 1,
                        color: "#fff",
                        bgcolor: "#f44336",
                        "&:hover": { bgcolor: "#d32f2f" }
                      }}
                    >
                      封禁
                    </Button>
                    <Button
                      size="small"
                      onClick={() =>
                        handleOpenDialog("确认解禁该用户？", () => handleUnban(user.id))
                      }
                      sx={{
                        color: "#fff",
                        bgcolor: "#1976d2",
                        "&:hover": { bgcolor: "#115293" }
                      }}
                    >
                      解禁
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* 邀请码表格区域 */}
      <Box sx={{ flexShrink: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Typography variant="h6" sx={{ mr: 2 }}>邀请码管理</Typography>
          <IconButton onClick={generateInviteCode} color="primary">
            <AddIcon />
          </IconButton>
        </Box>
        <TableContainer component={Paper} sx={{ width: "100%" }}>
          <Table sx={{ width: "100%" }}>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ border: "1px solid #ddd" }}>邀请码</TableCell>
                <TableCell align="center" sx={{ border: "1px solid #ddd" }}>状态</TableCell>
                <TableCell align="center" sx={{ border: "1px solid #ddd" }}>对应用户ID</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invites.map((invite, index) => (
                <TableRow key={index}>
                  <TableCell align="center" sx={{ border: "1px solid #ddd" }}>{invite.code}</TableCell>
                  <TableCell align="center" sx={{ border: "1px solid #ddd" }}>{invite.status}</TableCell>
                  <TableCell align="center" sx={{ border: "1px solid #ddd" }}>{invite.userId}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
         <Box sx={{ height: 100 }} />
      </Box>
      

      {/* 通用弹窗 */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>提示</DialogTitle>
        <DialogContent>{dialogContent}</DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          {dialogOnlyInfo ? (
            <Button
              onClick={() => setOpenDialog(false)}
              sx={{ color: "#fff", bgcolor: "#1976d2", "&:hover": { bgcolor: "#115293" } }}
            >
              确定
            </Button>
          ) : (
            <>
              <Button
                onClick={() => setOpenDialog(false)}
                sx={{ color: "#fff", bgcolor: "#f44336", "&:hover": { bgcolor: "#d32f2f" } }}
              >
                否
              </Button>
              <Button
                onClick={dialogAction}
                sx={{ color: "#fff", bgcolor: "#1976d2", "&:hover": { bgcolor: "#115293" } }}
              >
                是
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
