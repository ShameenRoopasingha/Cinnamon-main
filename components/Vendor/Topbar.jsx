import Profile from "../profile/profile";

function Topbar() {
  return (
    <div className="w-full flex px-1 py-1 justify-center items-center">
      <div className="w-full flex items-center justify-end pr-3 h-[49px] rounded-lg bg-[#002b3c] ">
        <Profile/>
      </div>
    </div>
  )
}

export default Topbar;