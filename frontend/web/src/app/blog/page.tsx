'use client';
import React from 'react'
import BlogPage from '@/components/BlogPage'
import Footer from '@/pages/Footer'
import dynamic from 'next/dynamic';

const Header = dynamic(() => import("@/components/Header"), { ssr: false });

export default function Blog() {
    return (
        <>
            <Header />
            <BlogPage />
            <Footer />
        </>
    );
}
