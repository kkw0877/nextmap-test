export default function FullPageLoader() {
    return (
        <div className="fixed flex flex-col justify-center bg-black/60 z-50 w-full h-screen top-0 inset-x-0">
            <div className="w-10 h-10 border-[4px] m-auto animate-spin rounded-full border-t-transparent border-current text-blue-400" ></div>
        </div>
    )
}