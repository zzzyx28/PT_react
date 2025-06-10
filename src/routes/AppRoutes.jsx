import { Routes, Route } from 'react-router-dom'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Home from '../pages/Home'
import Upload from '../pages/Upload'
import Search from '../pages/Search'
import ForumPage from '../pages/ForumPage'
import MePage from '../pages/MePage'

import Chat from '../pages/Chat'
import Announcement from '../pages/Announcement'

import TorrentList from '../pages/TorrentList'

import UserRanking from '../pages/UserRanking'


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="/announcement" element={<Announcement />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="/search" element={<Search />} />
      <Route path="/forum" element={<ForumPage />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/me" element={<MePage />} />
      <Route path="/torrents" element={<TorrentList />} />
      <Route path="/userranking" element={<UserRanking />} />

      


    </Routes>
  )
}
