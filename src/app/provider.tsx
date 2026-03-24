"use client"

import Layout from "@/components/Layout";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { SessionProvider } from "next-auth/react"
import { RecoilRoot } from "recoil";
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import React from "react";
import Navbar from "@/components/Navbar";

// Create a client
const queryClient = new QueryClient()

interface Props {
    children?: React.ReactNode
}

export const NextProvider = ({ children }: Props) => {
    return (
        <RecoilRoot>
            <QueryClientProvider client={queryClient}>
                <SessionProvider>
                    {children}
                    <ToastContainer 
                        autoClose={1000} pauseOnHover={false} pauseOnFocusLoss={false}
                    />
                    <ReactQueryDevtools />
                </SessionProvider>
            </QueryClientProvider>
        </RecoilRoot>
    );
}

export const NextLayout = ({ children }: Props) => {
    return (
        <div className="layout">
            <Navbar />
            { children }
        </div>
    )
}
