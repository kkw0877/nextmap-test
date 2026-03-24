import axios from "axios"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"

interface CommentFormProps {
    storeId: number
    refetch: () => void
}

export default function CommentForm({ storeId, refetch }: CommentFormProps) {
    
    const { 
        register, 
        handleSubmit, 
        resetField, 
        formState: { errors } 
    } = useForm()
    
    return (
        <form 
            className="flex flex-col space-y-2"
            onSubmit={handleSubmit(async (data) => {
                const result = await axios.post("/api/comments", { 
                    ...data, 
                    storeId 
                })

                if (result.status === 200) {
                    toast.success("댓글이 등록했습니다")
                    resetField("body")
                    refetch?.()
                } else {
                    toast.error("다시 시도해주세요")
                }
        })}>  
            {/* Error Box */}
            { errors?.body?.type === "required" && (
                <div className="text-xs text-red-500">필수 입력 사항입니다</div>
            )}
            <textarea 
                rows={3}
                placeholder="댓글을 작성해주세요"
                {...register("body", { required: true })}
                className="block w-full min-h-[120px] py-2.5 px-4 border rounded-md bg-transparent resize-none text-black placeholder:text-gray-400 text-sm leading-6"
            />
            <button 
                className="px-4 py-2 mt-2 bg-blue-600 hover:bg-blue-500 text-white text-sm text-semibold shadow-sm rounded-md"    
                type="submit"
            >
                작성하기
            </button>
        </form>
    )
}