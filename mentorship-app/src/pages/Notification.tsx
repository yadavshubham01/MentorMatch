import ConnectionRequests from "../components/ConnectionRequests";
import Navbar from "../components/Navbar";
import { NotificationCard } from "../components/NotificationCard";

export function Notification() {
    
    return (
        <div>
            <Navbar/>
        <div className="bg-black h-screen overflow-hidden flex justify-center">
            
           <div className=" flex flex-row w-[70%] relative z-10 text-black rounded-lg gap-6 shadow-lg ">
            <div className="bg-gray-200 w-[50%] h-[70%] pt-2 rounded-md pr-2 transition-transform transform hover:scale-105 hover:shadow-2xl">
            <NotificationCard/>
            </div>
            <div className="bg-gray-200 w-[50%] h-[70%] flex pt-2 rounded-md pl-4 transition-transform transform hover:scale-105 hover:shadow-2xl">
            <ConnectionRequests/>
            </div>
            </div> 
        </div>
        </div>
    )
}


