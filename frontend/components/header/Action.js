const Action = ({ setModalOpen1, setModalOpen2 }) => {
    const onNewTransaction = () => {
        setModalOpen1(true)
    }
    const onGetPaid = () => {
        setModalOpen2(true)
    }

    return (
        <div>
            <button onClick={onNewTransaction} className="w-full rounded-lg mb-5 bg-[#AA02AA] py-3 hover:bg-opacity-70">
                <span className="font-medium text-white">Send Money</span>
            </button>
            <button onClick={onGetPaid} className="w-full rounded-lg bg-[#AA02AA] py-3 hover:bg-opacity-70">
                <span className="font-medium text-white">Receive Money</span>
            </button>
        </div>
    )
}

export default Action
