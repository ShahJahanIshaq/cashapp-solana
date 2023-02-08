import Modal from '../Modal'
import { createQR, encodeURL, findReference, validateTransfer, FindReferenceError, ValidateTransferError } from "@solana/pay"
import { PublicKey, Keypair } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { useConnection } from '@solana/wallet-adapter-react';
import { useEffect, useRef, useState } from 'react';
import { truncate } from "../../utils/string"
import { useCashApp } from '../../hooks/cashapp'
import { getAvatarUrl } from "../../functions/getAvatarUrl"



const TransactionQRModal = ({ modalOpen, setModalOpen, userAddress, setQrCode, qrCode }) => {
    const { transactions, setTransactions, connected } = useCashApp()
    const { connection } = useConnection()

    const [qrAmount, setQrAmount] = useState(0);
    const [qrPurpose, setQrPurpose] = useState("");

    const onAmountInput = (e) => {
        e.preventDefault()
        const newAmount = e.target.value

        setQrAmount(newAmount)

        const input = document.querySelector('input#amount')
        input.style.width = newAmount.length + 'ch'
    }

    const qrRef = useRef()
    const loadQr = () => {
        setQrCode(true)
        console.log(qrCode)
    }
    useEffect(() => {
        if (connected && userAddress != "Not Available") {
            const recipient = new PublicKey(userAddress)
            const amount = new BigNumber(qrAmount)
            const reference = Keypair.generate().publicKey
            const label = "CryptoPay"
            const message = qrPurpose

            const urlParams = {
                recipient,
                // splToken: usdcAddress,
                amount,
                reference,
                label,
                message,
            }
            const url = encodeURL(urlParams)
            const qr = createQR(url, 488, 'transparent')
            if (qrRef.current && qrCode === true) {
                qrRef.current.innerHTML = ''
                qr.append(qrRef.current)
            }

            // Wait for the user to send the transaction

            const interval = setInterval(async () => {
                console.log("waiting for transaction confirmation")
                try {
                    // Check if there is any transaction for the reference
                    const signatureInfo = await findReference(connection, reference, { finality: 'confirmed' })
                    console.log("validating")
                    // Validate that the transaction has the expected recipient, amount and SPL token
                    await validateTransfer(
                        connection,
                        signatureInfo.signature,
                        {
                            recipient,
                            amount,
                            // splToken: usdcAddress,
                            reference,
                        },
                        { commitment: 'confirmed' }
                    )

                    console.log("confirmed, proceed with evil deeds")

                    const newID = (transactions.length + 1).toString()
                    const newTransaction = {
                        id: newID,
                        from: {
                            name: recipient,
                            handle: recipient,
                            avatar: getAvatarUrl(recipient.toString()),
                            verified: true,
                        },
                        to: {
                            name: reference,
                            handle: '-',
                            avatar: getAvatarUrl(reference.toString()),
                            verified: false,
                        },
                        description: qrPurpose,
                        transactionDate: new Date(),
                        status: 'Completed',
                        amount: amount,
                        source: '-',
                        identifier: '-',
                    };
                    console.log(newTransaction, "NEW TRANSACTIONS EXISTS")
                    setModalOpen(false);
                    console.log(transactions)
                    await setTransactions([newTransaction, ...transactions]);
                    console.log(transactions)
                    setQrAmount(0);
                    setQrPurpose('');
                    setQrCode(false);


                    clearInterval(interval)
                } catch (e) {
                    if (e instanceof FindReferenceError) {
                        // No transaction found yet, ignore this error
                        return;
                    }
                    if (e instanceof ValidateTransferError) {
                        // Transaction is invalid
                        console.error('Transaction is invalid', e)
                        return;
                    }
                    console.error('Unknown error', e)
                }
            }, 500)

            return () => clearInterval(interval)
        }
        
    })

    return (
        <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
            <div >
                <div className="flex flex-col items-center justify-center space-y-1">
                    <div ref={qrRef} />
                </div>
                
                <div className="flex items-center justify-center text-center text-6xl font-semibold text-[#800080]">
                    <input className="w-12 outline-none" id="amount" name="amount" type="number" value={qrAmount} onChange={onAmountInput} min={0} />
                    <label htmlFor="amount">SOL</label>
                </div>
                <div className="flex rounded-lg border border-gray-200 p-3 mb-3">
                    <label className="text-gray-300" htmlFor="transactionPurpose">
                        For:
                    </label>
                    <input className="w-full pl-2 font-medium text-gray-600 placeholder-gray-300 outline-none" id="transactionPurpose" name="transactionPurpose" type="text" placeholder="NFT#, TokenSwap etc." value={qrPurpose} onChange={(e) => setQrPurpose(e.target.value)} />
                </div>

                <div className="flex flex-col items-center justify-center space-y-1">  

                    <button onClick={() => loadQr()} className="w-full rounded-lg bg-[#800080] py-3 hover:bg-opacity-70">
                        <span className="font-medium text-white">Load QR code</span>
                    </button>
                </div>
            </div>
        </Modal>
    )
}

export default TransactionQRModal
