"use client"

import React, { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { SearchType, StoreApiResponse, StoreType } from "@/interface";
import { useQuery, useInfiniteQuery } from "react-query";
import axios from "axios";
import Loading from "@/components/Loading";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import Loader from "@/components/Loader";
import SearchFilter from "@/components/SearchFilter";
import { useRecoilValue } from "recoil";
import { searchState } from "@/atom";
import StoreList from "@/components/StoreList";

export default function StoreListPage() {
  const ref = useRef<HTMLDivElement | null>(null)
  const pageRef = useIntersectionObserver(ref, {})
  const isPageEnd = !!pageRef?.isIntersecting;
  
  const searchValue = useRecoilValue(searchState)
  const searchParams = {
    q: searchValue?.q,
    district: searchValue?.district
  }

  // useInfiniteQuery
  const fetchStores = async ({ pageParam = 1 }) => {
    const { data } = await axios('/api/stores?page=' + pageParam, {
      params: {
        limit: 10,
        page: pageParam,
        ...searchParams
      }
    })

    return data
  }

  const { 
    data: stores, 
    isFetching, 
    fetchNextPage, 
    isFetchingNextPage, 
    hasNextPage, 
    isError, 
    isLoading } = useInfiniteQuery(['stores', searchParams], fetchStores, {
      getNextPageParam: (lastPage: any) => 
        lastPage.data?.length > 0 ? lastPage.page + 1 : undefined
    })

  const fetchNext = useCallback(async () => {
    const res = await fetchNextPage()
    if(res.isError) {
      console.log(res.error)
    }
  }, [fetchNextPage])

  useEffect(() => {
    let timerId: NodeJS.Timeout | undefined
    
    if(isPageEnd && hasNextPage) {
      timerId = setTimeout(() => {
        fetchNext()
      }, 500);
    }

    return () => clearTimeout(timerId)
  }, [fetchNext, isPageEnd, hasNextPage])

  if (isError) {
    return (
      <div className="w-full h-screen mx-auto pt-[10%] text-red-500 text-center font-semibold">
        다시 시도해주세요
      </div>
    )
  }
  
  return (
    <div className="px-4 md:max-w-4xl mx-auto py-8">
      {/* Search Filter */}
      <SearchFilter />

      <ul role="list" className="divide-y divide-gray-100">
        { isLoading 
          ? <Loading /> 
          : stores?.pages?.map((page, index) => (
            <React.Fragment key={index}>
              {page.data.map((store: StoreType, i: number) => (
                <StoreList store={store} i={i} key={i} />
              ))}
            </React.Fragment>
        ))}
      </ul>

      { (isFetching || hasNextPage || isFetchingNextPage ) && <Loader />}
      <div className="w-full touch-none h-10 mb-10" ref={ref} />
      {/* <button type="button" onClick={() => fetchNextPage()}>Next Page</button> */}
      
      {/* fetchNextPage 함수 호출로 인해서 더 이상 Pagination은 사용하지 않는다 */}
      {/* { stores?.totalPage && (
        <Pagination total={stores?.totalPage} page={page}/>
      )} */}
      
    </div>
  );
}

// useQuery, useInfiniteQuery 내부에서 데이터를 가져오기 때문에 하단의 getServerSideProps는 더 이상 사용하지 않는다.
// export async function getServerSideProps() {
//   const stores = await axios(
//     `${process.env.NEXT_PUBLIC_API_URL}/api/stores`
//   )

//   return {
//     props: { stores: stores.data },
//   };
// }
