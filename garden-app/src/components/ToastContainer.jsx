export default function ToastContainer({ toasts }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="bounce-in bg-white border border-green-200 shadow-lg rounded-2xl px-5 py-3 text-sm font-medium text-green-800 max-w-xs"
        >
          {t.message}
        </div>
      ))}
    </div>
  )
}
