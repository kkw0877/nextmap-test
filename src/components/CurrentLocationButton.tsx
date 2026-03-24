"use client";

import { mapState } from "@/atom"
import { useState } from "react"
import { MdOutlineMyLocation } from "react-icons/md"
import { toast } from "react-toastify"
import { useRecoilValue } from "recoil"
import FullPageLoader from "./FullPageLoader"

export default function CurrentLocationButton() {
    const [loading, setLoading] = useState<boolean>(false)
    const map = useRecoilValue(mapState)

    const handleCurrentPosition = () => {
        setLoading(true)

        const options = {
            enableHighAccuracy: false,
            timeout: 5000,
            maximumAge: Infinity,
        }

        if(navigator.geolocation && map) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const currentPosition = new window.kakao.maps.LatLng(
                        position.coords.latitude,
                        position.coords.longitude
                    )

                    if(currentPosition) {
                        setLoading(false)
                        map.panTo(currentPosition)
                        toast.success("현재 위치로 이동했습니다")
                    }

                    return currentPosition
                },
                () => {
                    // 위치를 가져올 때, 에러가 발생한 경우
                    setLoading(false)
                    toast.error("현재 위치를 가져올 수 없습니다")
                },
                options
            )
        }
    }
    
    return (
        <>
            { loading && <FullPageLoader /> }
            <button
                type="button"
                onClick={handleCurrentPosition}
                className="fixed right-10 bottom-20 z-10 p-2 rounded-md shadow bg-white hover:shadow-lg hover:bg-blue-200 focus:shadow-lg"
            >
                <MdOutlineMyLocation className="w-5 h-5" />
            </button>
        </>
        
    )
}