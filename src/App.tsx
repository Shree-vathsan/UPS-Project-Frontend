// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
// import Login from './pages/Login'
// import GithubRepositoriesPage from './pages/GithubRepositoriesPage'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//     {/* <p className='text-red-500'>Hi aksbdfaidfvhia</p> */}
//     <Login/>
//     </>
//   )
// }

// export default App

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Login from "./pages/Login";
import GithubRepositoriesPage from "./pages/GithubRepositoriesPage";
import RepoDetailPage from "./pages/RepositoryDetailsPage";
import FileViewerPage from "./pages/FileViewerPage";
import AnalyzedRepositoriesPage from "./pages/AnalyzedRepositoriesPage";
import AddRepositoryPage from "./pages/AddRepositoryPage";
import PullRequestDetailsPage from "./pages/PullRequestDetailsPage";
import CommitDetailsPage from "./pages/CommitDetailsPage";



function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/repos" element={<GithubRepositoriesPage />} />
          <Route path="/repo/:repoName" element={<RepoDetailPage />} />
          <Route path="/repo/:repoName/file/:fileName" element={<FileViewerPage />} />
          <Route path="/repo/:repoName/pr/:prId" element={<PullRequestDetailsPage />} />
          <Route path="/repo/:repoName/commit/:commitId" element={<CommitDetailsPage />} />
          <Route path="/analyzed" element={<AnalyzedRepositoriesPage />} />
          <Route path="/add-repository" element={<AddRepositoryPage />} />

        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;




