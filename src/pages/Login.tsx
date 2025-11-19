// import React from 'react'
// import { Btn } from "../components/Button"

// export default function Login() {
//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
//       <div className="bg-white w-full max-w-sm rounded-xl shadow-md p-8">
//         <div className="flex flex-col items-center">
//           <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center text-white text-xl font-semibold">
//             ↳
//           </div>

//           <h1 className="mt-4 text-xl font-semibold">Foresite</h1>
//           <p className="text-sm text-gray-500 -mt-1">
//             AI-Powered Code Intelligence Platform
//           </p>

//           <div className="w-full mt-6">
//             <Btn
//               variant="primary"
//               onClick={() => console.log('GitHub auth')}
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="w-4 h-4"
//                 viewBox="0 0 24 24"
//                 fill="currentColor"
//               >
//                 <path d="M12 .5C5.7.5.7 5.6.7 12c0 5.1 3.3 9.5 7.9 11 .6.1.8-.3.8-.6v-2.1c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.2-1.7-1.2-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 1.7 2.8 1.2 3.5.9.1-.7.4-1.2.7-1.4-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.2-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11 11 0 0 1 6 0C17.9 6 19 6.3 19 6.3c.5 1.6.2 2.9.1 3.2.8.9 1.2 2 1.2 3.2 0 4.5-2.7 5.4-5.3 5.8.4.3.8 1 .8 2v3c0 .3.2.7.8.6A11.5 11.5 0 0 0 23.3 12C23.3 5.6 18.3.5 12 .5Z" />
//               </svg>
//               <span>Authorize with GitHub</span>
//             </Btn>
//           </div>

//           <p className="text-xs text-gray-400 mt-3 text-center">
//             By logging in, you agree to our <span className="underline">Terms of Service</span> and <span className="underline">Privacy Policy</span>.
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }


import React from 'react'
import { Btn } from "../components/Button"
import { useNavigate } from "react-router-dom"

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-sm rounded-xl shadow-md p-8">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center text-white text-xl font-semibold">
            ↳
          </div>

          <h1 className="mt-4 text-xl font-semibold">Foresite</h1>
          <p className="text-sm text-gray-500 -mt-1">
            AI-Powered Code Intelligence Platform
          </p>

          <div className="w-full mt-6">
            <Btn
              variant="primary"
              onClick={() => {
                // 👉 TEMPORARY: redirect to repos page (until real GitHub OAuth)
                navigate("/repos");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 .5C5.7.5.7 5.6.7 12c0 5.1 3.3 9.5 7.9 11 .6.1.8-.3.8-.6v-2.1c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.2-1.7-1.2-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 1.7 2.8 1.2 3.5.9.1-.7.4-1.2.7-1.4-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.2-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11 11 0 0 1 6 0C17.9 6 19 6.3 19 6.3c.5 1.6.2 2.9.1 3.2.8.9 1.2 2 1.2 3.2 0 4.5-2.7 5.4-5.3 5.8.4.3.8 1 .8 2v3c0 .3.2.7.8.6A11.5 11.5 0 0 0 23.3 12C23.3 5.6 18.3.5 12 .5Z" />
              </svg>
              <span>Authorize with GitHub</span>
            </Btn>
          </div>

          <p className="text-xs text-gray-400 mt-3 text-center">
            By logging in, you agree to our <span className="underline">Terms of Service</span> and <span className="underline">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  )
}
