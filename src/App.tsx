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
import Login from "./pages/Login";
import GithubRepositoriesPage from "./pages/GithubRepositoriesPage";
import RepoDetailPage from "./pages/RepoDetailPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/repos" element={<GithubRepositoriesPage />} />
        <Route path="/repo/:repoName" element={<RepoDetailPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;




