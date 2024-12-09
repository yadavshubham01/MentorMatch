import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import layer1 from '../images/bg-light.png'
const APIURL = import.meta.env.VITE_API_URL;
export const Auth = ({ type }: { type: "signup" | "signin" }) => {
  const [postInputs, setPostInputs] = useState({
    email: "",
    password: "",
    name: "",
    role: ""
  });
  const navigate = useNavigate();

  async function sendRequest() {
    try {
      const res = await axios.post(`${APIURL}/api/users/${type === "signup" ? "register" : "login"}`, postInputs);
      const data = res.data;
      console.log(res.data);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user.id", data.user.id); 
      navigate('/profile')
    } catch (e) {
      console.log(e);
      alert("Error while signing up");
    }
  }

  return (
    <div className=" min-h-screen"> 
    <img src={layer1} className=" absolute inset-0 w-full h-screen bg-auto bg-center bg-fixed "/>
    <div className="relative z-10 bg-black text-white p-10 rounded-lg shadow-lg w-full max-w-md mx-auto mt-10 transition-transform transform hover:scale-105 hover:shadow-2xl">
      <div className="flex justify-center mb-8">
        <div>
          <div className="text-center font-extrabold text-3xl mb-4">
            {type === "signup" ? "Create your Account" : "Sign in to your Account"}
          </div>
          <div className="text-center text-slate-400 mb-4">
            {type === "signin" ? "Don't have an account?" : "Already have an account?"}
            <Link className="text-blue-400 underline pl-2" to={type === "signin" ? "/" : "/signin"}>
              {type === "signin" ? "Sign up" : "Sign in"}
            </Link>
          </div>
          <div>
            <LabeledInput
              label="Email"
              placeholder="Johndoe@gmail.com"
              onChange={(e) => setPostInputs({ ...postInputs, email: e.target.value })}
            />
            <LabeledInput
              label="Password"
              placeholder="••••••••"
              onChange={(e) => setPostInputs({ ...postInputs, password: e.target.value })}
            />
            {type === "signup" && (
               <>
               <LabeledInput
                 label="Name"
                 placeholder="Your Name"
                 onChange={(e) => setPostInputs({ ...postInputs, name: e.target.value })}
               />
               <div className="mb-4">
                 <label className="block mb-2 text-sm font-semibold text-gray-400">Role</label>
                 <select
                   name="role"
                   value={postInputs.role}
                   onChange={(e) => setPostInputs({ ...postInputs, role: e.target.value })}
                   className="bg-white border border-gray-700 text-gray-600 text-sm rounded-lg focus:ring-white focus:border-white block w-full p-2.5"
                 >
                   <option value="">Select Role</option>
                   <option value="mentor">Mentor</option>
                   <option value="mentee">Mentee</option>
                 </select>
               </div>
             </>
            )}
            
            <div className="pt-6">
              <button
                type="button"
                onClick={sendRequest}
                className="bg-white hover:bg-neutral-950 text-black hover:text-white font-bold py-2 px-4 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
              >
                {type === "signup" ? "Sign up" : "Sign in"}
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

interface LabeledInputType {
  label: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

function LabeledInput({ label, placeholder, onChange }: LabeledInputType) {
  return (
    <div className="mb-4">
      <label className="block mb-2 text-sm font-semibold text-gray-400">{label}</label>
      <input
        onChange={onChange}
        type="text"
        className="bg-white border border-gray-700 text-gray-600 text-sm rounded-lg focus:ring-white focus:border-white block w-full p-2.5"
        placeholder={placeholder}
        required
      />
    </div>
  );
}
