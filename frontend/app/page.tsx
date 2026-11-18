"use client"

import { useEffect, useState } from "react";
import api from "./api";
import toast from "react-hot-toast";
import { Activity, ArrowDownCircle, ArrowUpCircle, PlusCircle, Trash, TrendingDown, TrendingUp, Wallet } from "lucide-react";

type Transaction ={
  id: string;
  text: string;
  amount: number;
  created_at : string
}

export default function Home() {
  const [transactions, setTransactions]=useState<Transaction[]>([])
  const [text, setText]= useState<string>("");
  const [amount, setAmount]= useState<number | "">("");

  const [loading, setLoading] = useState(false)

const getTransactions = async()=>{
  try{
const res = await api.get<Transaction[]>("transactions/")
setTransactions(res.data)
toast.success("Transactions chargées")
  } catch (error){
    console.error("Erreur chargement transactions", error);
    toast.error("Erreur chargement transactions");

  }
}

const deleteTransaction = async(id:string)=>{
  try{
    await api.delete(`transactions/${id}/`)
    getTransactions()
    toast.success("Transaction supprimée avec succès")
  } catch (error){
    console.error("Erreur suppression transaction", error);
    toast.error("Erreur suppression transaction");
  }
}

const addTransaction = async()=>{
  if(!text || amount=="" || isNaN(Number(amount))){
    toast.error("Merci de remplir texte et montant valide")
    return
  }
  setLoading(true)
  try{
    const res=await api.post<Transaction>(`transactions/`,{text, amount:Number(amount)})
    getTransactions()
    const modal= document.getElementById('my_modal_3')as HTMLDialogElement
    if(modal){
      modal.close()
    }

    toast.success("Transaction ajoutée avec succès")
    setText("")
    setAmount("")
  } catch (error){
    console.error("Erreur ajout transaction", error);
    toast.error("Erreur ajout transaction");
  } finally{
    setLoading(false)
  }
}

useEffect(()=>{
getTransactions()
},

[]);

const amounts =transactions.map((t)=>Number(t.amount)|| 0)
const balance= amounts.reduce((acc, item)=> acc + item, 0) ||0
const income = amounts.filter((a)=>a>0).reduce((acc, item)=> acc + item, 0) ||0
const expense = amounts.filter((a)=>a<0).reduce((acc, item)=> acc + item, 0) ||0

const ratio=income >0? Math.min((Math.abs(expense)/income) *100, 100): 0

const formatDate= (dateString:string)=>{
  const d =new Date (dateString);
  return d.toLocaleDateString("fr-FR",{
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
});
};


  return (
    <div className="flex w-full flex-col gap-4 sm:gap-5">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm text-base-content/60">Bonjour</p>
          <h1 className="text-xl font-bold sm:text-2xl">Mes transactions</h1>
        </div>
        <button
          className="btn btn-warning btn-sm sm:btn-md"
          onClick={() => (document.getElementById("my_modal_3") as HTMLDialogElement).showModal()}
        >
          <PlusCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Ajouter une transaction</span>
          <span className="sm:hidden">Ajouter</span>
        </button>
      </header>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-warning/10 border-dashed bg-warning/5 p-4 sm:p-5">
          <div className="badge badge-soft gap-1">
            <Wallet className="h-4 w-4" />
            Votre solde
          </div>
          <div className="mt-2 text-2xl font-bold break-words">{balance.toFixed(2)} Fcfa</div>
        </div>

        <div className="rounded-2xl border border-success/10 border-dashed bg-success/5 p-4 sm:p-5">
          <div className="badge badge-soft badge-success gap-1">
            <ArrowUpCircle className="h-4 w-4" />
            Revenus
          </div>
          <div className="mt-2 text-2xl font-bold break-words">{income.toFixed(2)} Fcfa</div>
        </div>

        <div className="rounded-2xl border border-error/10 border-dashed bg-error/5 p-4 sm:p-5">
          <div className="badge badge-soft badge-error gap-1">
            <ArrowDownCircle className="h-4 w-4" />
            Dépenses
          </div>
          <div className="mt-2 text-2xl font-bold break-words">{expense.toFixed(2)} Fcfa</div>
        </div>
      </section>

      <div className="rounded-2xl border border-warning/10 border-dashed bg-warning/5 p-4 sm:p-5">
        <div className="mb-2 flex items-center justify-between gap-3">
          <div className="badge badge-soft badge-warning gap-1">
            <Activity className="h-4 w-4" />
            Dépenses vs Revenus
          </div>
          <div className="text-sm font-semibold">{ratio.toFixed(0)}%</div>
        </div>
        <progress className="progress progress-warning w-full" value={ratio} max={100} />
      </div>

      <div className="hidden overflow-x-auto rounded-2xl border border-warning/10 border-dashed bg-warning/5 md:block">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Description</th>
              <th>Montant</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={transaction.id}>
                <th>{index + 1}</th>
                <td className="max-w-64 break-words">{transaction.text}</td>
                <td>
                  <span className="flex items-center gap-2 font-semibold">
                    {transaction.amount > 0 ? (
                      <TrendingUp className="h-5 w-5 text-success" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-error" />
                    )}
                    {transaction.amount > 0 ? `+${transaction.amount}` : transaction.amount}
                  </span>
                </td>
                <td className="whitespace-nowrap">{formatDate(transaction.created_at)}</td>
                <td>
                  <button
                    onClick={() => deleteTransaction(transaction.id)}
                    className="btn btn-error btn-soft btn-sm"
                    title="Supprimer"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 gap-3 md:hidden">
        {transactions.map((transaction) => (
          <article key={transaction.id} className="rounded-2xl border border-warning/10 border-dashed bg-warning/5 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="break-words font-semibold">{transaction.text}</p>
                <p className="mt-1 text-xs text-base-content/60">{formatDate(transaction.created_at)}</p>
              </div>
              <button
                onClick={() => deleteTransaction(transaction.id)}
                className="btn btn-error btn-soft btn-sm btn-square shrink-0"
                title="Supprimer"
              >
                <Trash className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-3 flex items-center gap-2 text-lg font-bold">
              {transaction.amount > 0 ? (
                <TrendingUp className="h-5 w-5 text-success" />
              ) : (
                <TrendingDown className="h-5 w-5 text-error" />
              )}
              <span>{transaction.amount > 0 ? `+${transaction.amount}` : transaction.amount} Fcfa</span>
            </div>
          </article>
        ))}
        {transactions.length === 0 && (
          <div className="rounded-2xl border border-dashed border-base-300 p-8 text-center text-base-content/60">
            Aucune transaction pour le moment
          </div>
        )}
      </div>

      <dialog id="my_modal_3" className="modal backdrop-blur">
        <div className="modal-box mx-3 max-w-md border border-warning/10 border-dashed p-5 sm:p-6">
          <form method="dialog">
            <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2" aria-label="Fermer">✕</button>
          </form>
          <h3 className="text-lg font-bold">Ajouter une transaction</h3>
          <div className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="label px-0">Texte</label>
              <input
                type="text"
                name="text"
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="Entrez la description..."
                className="input w-full"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="label px-0">Montant (négatif = dépense, positif = revenu)</label>
              <input
                type="number"
                name="amount"
                value={amount}
                onChange={(event) => setAmount(event.target.value === "" ? "" : Number(event.target.value))}
                placeholder="Entrez le montant..."
                className="input w-full"
              />
            </div>

            <button className="btn btn-warning w-full" onClick={addTransaction} disabled={loading}>
              <PlusCircle className="h-4 w-4" />
              Ajouter
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>Fermer</button>
        </form>
      </dialog>
    </div>
  );
}
