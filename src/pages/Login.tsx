import React from "react";
import { Btn } from "../components/Button";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();

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
            <Btn variant="primary" onClick={() => nav("/repos")}>
              Authorize with GitHub
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}
