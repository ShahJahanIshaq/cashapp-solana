import { format } from 'date-fns'

const TransactionItem = ({ id, to, description, transactionDate, amount, toggleTransactionDetailModal }) => {
    const onItemClick = () => {
        if (id != "total") {
            toggleTransactionDetailModal(true, id)
        }
    }

    return (
        <div onClick={onItemClick} className="grid gap-4 cursor-pointer grid-cols-8 items-center p-4 hover:bg-gray-50">
            <div className="col-span-2 flex items-center space-x-4">
                <img className="h-8 w-8 rounded-full object-cover" src={to.avatar} alt="" />
                <p className="truncate text-sm text-gray-800">{to.name}</p>
            </div>

            <p className="col-span-4 text-sm text-[#900090]">{description}</p>
            <p className="col-span-1 text-sm text-gray-400">{transactionDate != "" ? format(new Date(transactionDate), 'MMM d'): ""}</p>
            <p className="col-span-1 text-right text-sm font-medium text-[#900090]">{amount} SOL</p>
        </div>
    )
}

export default TransactionItem
