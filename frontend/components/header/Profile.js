import { useCashApp } from "../../hooks/cashapp"
import { truncate } from "../../utils/string"
const Profile = ({ setModalOpen, avatar, userAddress, setQrCode }) => {
    const { connected } = useCashApp()
    const onProfileOpen = () => {
        setModalOpen(true)
        setQrCode(false)
    }
    return (
        <div onClick={onProfileOpen} className="flex cursor-pointer flex-col items-center space-y-3">
            <div className="h-16 w-16 rounded-full border-2 border-white">
                <img className="h-full w-full rounded-full object-cover" src={avatar} />
            </div>

            <div className="flex flex-col items-center space-y-1">
                <p className="font-semibold text-white">{truncate(userAddress)}</p>

                {/* <p className="text-sm font-light italic text-gray-100">{connected ? "Click to Get Paid" : "Disconnected"}</p> */}
            </div>
        </div>
    )
}

export default Profile
