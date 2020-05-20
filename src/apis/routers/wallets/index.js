import { Router } from "express"
import { db } from "../../../db"
export const walletRouter = Router()


walletRouter.get("/:walletID", async (req, res) => {
    const { walletID } = req.params
    const { status, limit } = req.query
    let wallet = await db.Wallet.findByPk(wallet)
    let walletTransactions;
    if (status) {
        if (status === "receive") {
            walletTransactions = await db.WalletTransaction.findAll({
                where: {
                    toWalletId: walletID
                }
            })
        }
        else {
            walletTransactions = await db.WalletTransaction.findAll({
                where: {
                    fromWalletId: walletID
                }
            })
        }
    }
    else {
        wallettransactions = await db.WalletTransaction.findAll({
            where: {
                $or: [
                    {
                        fromWalletId: walletID
                    },
                    {
                        toWalletId: walletID
                    }
                ]
            }
        }, limit)
    }
    res.send({ wallet, walletTransactions });
})

walletRouter.post("/:walletID", async (req, res) => {
    const { type, amount } = req.body
    console.log(amount)
    switch (type) {
        case "DEPOSIT": {
            const { walletID } = req.params
            let wallet = await db.Wallet.findByPk(walletID)

            wallet.amount += amount
            await wallet.save()

            const walletTransaction = await db.WalletTransaction.create({
                fromWalletId: null,
                toWalletId: walletID,
                amount,
                message: "Nạp tiền vào tài khoản"
            });
            return res.status(200).send({
                wallet, walletTransaction
            })
        }
        case "WITHDRAW": {
            const { walletID } = req.params
            let wallet = await db.Wallet.findByPk(walletID)
            if (wallet.amount < amount) {
                return res.status(200).send({
                    status: "error",
                    message: "Số dư ví không đủ"
                })
            } else {
                wallet.amount -= amount
                await wallet.save()
                const walletTransaction = await db.WalletTransaction.create({
                    fromWalletId: walletID,
                    toWalletId: null,
                    amount,
                    message: "Rút tiền khỏi tài khoản"
                });
                return res.status(200).send({
                    wallet,
                    walletTransaction
                })
            }
        }
        case "DONATE": {
            const { walletID } = req.params
            const { toWalletID, amount, message } = req.body
            let fromWallet = await db.Wallet.findByPk(walletID)
            let toWallet = await db.Wallet.findByPk(toWalletID)

            if (fromWallet.amount < amount) {
                return res.status(200).send({
                    message: "Số dư ví không đủ",
                    status: "error"
                })
            } else {
                if(!message) {
                    message = "Không có tin nhắn"
                }
                fromWallet.amount -= amount
                toWallet.amount += amount
                const walletTransaction = await db.WalletTransaction.create({
                    fromWalletId: walletID,
                    toWalletID,
                    amount,
                    message
                })
                return walletTransaction
            }
        }
    }

})