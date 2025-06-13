import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login'
import Register from '../pages/Register'
import Home from '../pages/Home'
import Upload from '../pages/Upload'
import Search from '../pages/Search'
import Forum from '../pages/Forum'
import MePage from '../pages/MePage'
import AI from '../pages/AI'
import Chat from '../pages/Chat'
import Announcement from '../pages/Announcement'
import Post from '../pages/Post'
import TorrentList from '../pages/TorrentList'

import UserRanking from '../pages/UserRanking'
import Management from '../pages/Management'
import Users from '../pages/Users' // 导入Users组件
import Statistics from '../pages/Statistics' // 导入Statistics组件
import Resources from '../pages/Resources'



export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="/announcement" element={<Announcement />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="/search" element={<Search />} />
      <Route path="/forum" element={<Forum />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/ai" element={<AI />} />
      <Route path="/me" element={<MePage />} />
      <Route path="/torrents" element={<TorrentList />} />
      <Route path="/userranking" element={<UserRanking />} />
      <Route path="/post/:forumId" element={<Post />} />
        <Route path="/management" element={<Management />}>
        <Route path="users" element={<Users />} />
        <Route path="statistics" element={<Statistics />} />
        <Route path="resources" element={<Resources />} />
      </Route>

      


    </Routes>
  )
}
