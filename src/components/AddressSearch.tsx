import { StoreType } from "@/interface";
import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import DaumPostcodeEmbed from 'react-daum-postcode';
import { useState } from "react"

interface AddressProps {
    register: UseFormRegister<StoreType>;
    errors: FieldErrors<StoreType>;
    setValue: UseFormSetValue<StoreType>;
}

export default function AddressSearch({ register, errors, setValue }: AddressProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    
    const handleComplete = (data: any) => {
        let fullAddress = data.address;
        let extraAddress = '';

        // 데이터가 도로명 주소인 경우
        if (data.addressType === 'R') {
            // 법정명을 추가한다
            if (data.bname !== '') {
                extraAddress += data.bname;
            }
            // 빌딩명을 추가한다
            if (data.buildingName !== '') {
                extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
            }
            fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
            }

            setValue('address', fullAddress)
            setIsOpen(false)
        };
    
    return (
        <>
            <div className="col-span-full">
                <label htmlFor="address" className="block text-sm/6 font-medium text-gray-900">
                    주소
                </label>
                <div className="mt-2">
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
                        <input
                            readOnly
                            placeholder="주소를 검색해주세요"
                            {...register('address', { required: true })}
                            className="block w-full col-span-2 rounded-md bg-white px-2 py-1.5 outline-none text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                        <button 
                            type="button" 
                            onClick={() => setIsOpen((val) => !val)}
                            className="py-1.5 px-2 bg-blue-700 hover:bg-blue-600 rounded text-white"    
                        >
                            주소 검색
                        </button>
                    </div>
                    { errors?.address?.type === 'required' && (
                        <div className="pt-2 text-xs text-red-600">
                            필수 입력 사항입니다
                        </div>
                    )}
                </div>
            </div>
            { isOpen && (
                <div className="border border-gray-300 w-full col-span-full md:col-span-3 rounded-md p-2">
                    <DaumPostcodeEmbed onComplete={handleComplete} />
                </div>
            )}
        </>
    )
}