"use client";
import React, { JSX, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import getTestimonials from '../context/FeedbackContext';
import { getFeaturedArticles } from '../context/ArticleContext';
import {
	FaPhone,
	FaMapMarkerAlt,
	FaComments,
	FaUsers,
	FaHeart,
	FaLightbulb,
	FaCheckCircle,
	FaShieldAlt,
} from 'react-icons/fa';
import { Article, Doctor, Testimonial } from '@/types/type';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/pages/LoadingPage';
import { expressApi, getDoctorsApi } from '@/apis/apis';

const LandingPage = (): JSX.Element => {
	const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
	const [isMounted, setIsMounted] = useState<boolean>(false);
	const [featuredArticlesList, setFeaturedArticlesList] = useState<Article[]>([]);
	const { logout } = useAuth();
	const router = useRouter();

	useEffect(() => {
		const fetchFeaturedArticle = async (): Promise<void> => {
			try {
				const response = await getDoctorsApi();
				const doctors: Doctor[] = response.data.doctors;
				const data = await getFeaturedArticles(doctors);
				setFeaturedArticlesList(data);
			} catch (error) {
				const errorMessage = String(error);
				if (errorMessage.includes("Patient Id not found")) {
					logout();
					router.replace('/login');
					toast.error("Session expired. Please log in again.");
				} else {
					console.error(error);
					toast.error("An error occurred: " + errorMessage);
				}
			}
		}

		const fetchTestimonials = async (): Promise<void> => {
			const data = await getTestimonials();
			setTestimonials(data);
		}

		const wakeUpExpressApi = async (): Promise<void> => {
			const response = await expressApi();
			const data = await response.data;
			if(data.message) {
				console.log(data?.message);
			}
		}

		const wakeUpQuartApi = async (): Promise<void> => {
			const apiUrl = process.env.NEXT_PUBLIC_FAST_API_URL;
			if (!apiUrl) {
				console.warn('NEXT_PUBLIC_FAST_API_URL is not defined');
				return;
			}
			try {
				const response = await fetch(apiUrl);
				const data = await response.json();
				if(data.message) {
					console.log(data?.message);
				}
			} catch (error) {
				console.log('Failed to wake up FastAPI:', error);
			}
		}

		wakeUpExpressApi();
		wakeUpQuartApi();
		fetchFeaturedArticle();
		fetchTestimonials();
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return <LoadingSpinner />;
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-white to-emerald-200/40">
			{/* Hero Section */}
			<section className="relative pt-30 min-h-screen flex items-center justify-center overflow-hidden mb-[15vh]">
				{/* Background with overlay */}
				<div className="absolute inset-0 bg-gradient-to-b from-emerald-200/90 to-emerald-300/90 z-10"></div>
				<div className="absolute inset-0">
					<Image
						src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80"
						alt="Medical Background"
						fill
						className="object-cover"
						priority
					/>
				</div>
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_0%,rgba(255,255,255,0.4)_100%)] z-10"></div>

				{/* Content */}
				<div className="container mx-auto px-4 relative z-20">
					<div className="max-w-4xl mx-auto text-center">
						<div className="mb-8">
							<span className="inline-block px-4 py-2 border border-emerald-700 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium mb-4">
								Welcome to WellNest
							</span>
							<h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up">
								Your Health,{" "}
								<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-emerald-900">
									Our Priority
								</span>
							</h1>
							<p className="text-xl md:text-2xl mb-8 text-gray-700 animate-fade-in-up animation-delay-200 max-w-2xl mx-auto">
								Experience exceptional healthcare with our dedicated team of medical professionals
							</p>
						</div>

						{/* CTA Buttons */}
						<div className="flex gap-4 justify-center animate-fade-in-up animation-delay-400 mb-16">
							<Link
								href="/appointment"
								className="bg-emerald-700 text-white px-8 py-3 rounded-full font-medium hover:bg-emerald-800 transition-all duration-300 hover:scale-105 hover:shadow-lg"
							>
								Book Appointment
							</Link>
							<Link
								href="/about"
								className="border-2 border-emerald-700 text-emerald-700 px-8 py-3 rounded-full font-medium hover:bg-emerald-50 transition-all duration-300 hover:scale-105"
							>
								Contact Us
							</Link>
						</div>

						{/* Feature Cards */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-xl mx-auto pb-10">
							<div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
								<div className="flex items-center gap-3 mb-3">
									<div className="p-2 bg-emerald-200 rounded-lg">
										<FaShieldAlt className="w-6 h-6 text-emerald-700" />
									</div>
									<h3 className="text-lg font-semibold text-gray-800">Quality Assured</h3>
								</div>
								<p className="text-gray-600">Certified healthcare services and patient safety</p>
							</div>
							<div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
								<div className="flex items-center gap-3 mb-3">
									<div className="p-2 bg-emerald-200 rounded-lg">
										<FaHeart className="w-6 h-6 text-emerald-700" />
									</div>
									<h3 className="text-lg font-semibold text-gray-800">Personalized Care</h3>
								</div>
								<p className="text-gray-600">Tailored treatment plans for your needs</p>
							</div>
						</div>

						{/* Stats Section */}
					</div>
				</div>

				{/* Decorative Elements */}
				<div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-20"></div>
				<div className="absolute top-0 left-0 w-64 h-64 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
				<div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
				<div className="absolute -bottom-8 left-20 w-64 h-64 bg-emerald-600 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
			</section>

			{/* About Section */}
			<section className="min-h-screen py-24 bg-white relative flex items-center mb-[5vh]">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.25),transparent_50%)]"></div>
				<div className="container mx-auto px-4 relative">
					<div className="max-w-6xl mx-auto">
						<div className="text-center mb-16">
							<h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
								Welcome to{" "}
								<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-emerald-900">
									WellNest
								</span>
							</h2>
							<p className="text-lg text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
								At WellNest, we believe in providing comprehensive healthcare solutions with a personal touch.
								Our state-of-the-art facility combines cutting-edge technology with compassionate care to ensure
								the best possible outcomes for our patients.
							</p>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
							<div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
								<FaUsers className="w-14 h-14 text-emerald-700 mx-auto mb-6" />
								<h3 className="text-xl font-semibold text-emerald-900 mb-3">Expert Care</h3>
								<p className="text-gray-600">Highly qualified medical professionals dedicated to your health</p>
							</div>
							<div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
								<FaLightbulb className="w-14 h-14 text-emerald-700 mx-auto mb-6" />
								<h3 className="text-xl font-semibold text-emerald-900 mb-3">Modern Facility</h3>
								<p className="text-gray-600">State-of-the-art equipment and comfortable environment</p>
							</div>
							<div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
								<FaHeart className="w-14 h-14 text-emerald-700 mx-auto mb-6" />
								<h3 className="text-xl font-semibold text-emerald-900 mb-3">Personalized Approach</h3>
								<p className="text-gray-600">Tailored treatment plans for individual needs</p>
							</div>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-12">
							<div className="bg-emerald-100 p-8 rounded-2xl">
								<h3 className="text-2xl font-semibold text-emerald-900 mb-6">Our Mission</h3>
								<p className="text-gray-600 mb-6">
									To provide exceptional healthcare services that improve the quality of life for our patients
									through innovative medical solutions and compassionate care.
								</p>
								<ul className="space-y-3">
									<li className="flex items-center gap-3">
										<FaCheckCircle className="w-5 h-5 text-emerald-700" />
										<span>Patient-centered care approach</span>
									</li>
									<li className="flex items-center gap-3">
										<FaCheckCircle className="w-5 h-5 text-emerald-700" />
										<span>Continuous medical innovation</span>
									</li>
									<li className="flex items-center gap-3">
										<FaCheckCircle className="w-5 h-5 text-emerald-700" />
										<span>Community health improvement</span>
									</li>
								</ul>
							</div>
							<div className="bg-emerald-100 p-8 rounded-2xl">
								<h3 className="text-2xl font-semibold text-emerald-900 mb-6">Our Vision</h3>
								<p className="text-gray-600 mb-6">
									To provide accessible, innovative, and compassionate healthcare services to our community.
								</p>
								<ul className="space-y-3">
									<li className="flex items-center gap-3">
										<FaCheckCircle className="w-5 h-5 text-emerald-700" />
										<span>Booking appointments for patients</span>
									</li>
									<li className="flex items-center gap-3">
										<FaCheckCircle className="w-5 h-5 text-emerald-700" />
										<span>Recording patient history</span>
									</li>
									<li className="flex items-center gap-3">
										<FaCheckCircle className="w-5 h-5 text-emerald-700" />
										<span>Contacting doctors and medical staff</span>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Statistics Section */}
			<section className="min-h-screen py-24 bg-gradient-to-b from-emerald-200/50 to-white relative flex items-center mb-[5vh]">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.25),transparent_50%)]"></div>
				<div className="container mx-auto px-4 relative">
					<h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-16">
						Why Choose{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-emerald-900">
							WellNest
						</span>
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto mb-16">
						<div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300">
							<div className="text-4xl font-bold text-emerald-700 mb-4">Trusted Care</div>
							<h3 className="text-2xl font-semibold text-gray-900 mb-2">Successful Treatments</h3>
							<p className="text-gray-600">We have a proven track record of effectively treating a wide range of medical conditions.</p>
						</div>

						<div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300">
							<div className="text-4xl font-bold text-emerald-700 mb-4">High Satisfaction</div>
							<h3 className="text-2xl font-semibold text-gray-900 mb-2">Patient Satisfaction</h3>
							<p className="text-gray-600">Our patients consistently express high levels of satisfaction with our care and services.</p>
						</div>

						<div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300">
							<div className="text-4xl font-bold text-emerald-700 mb-4">Always Available</div>
							<h3 className="text-2xl font-semibold text-gray-900 mb-2">Emergency Support</h3>
							<p className="text-gray-600">We provide round-the-clock emergency services for urgent medical needs.</p>
						</div>

						<div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300">
							<div className="text-4xl font-bold text-emerald-700 mb-4">Diverse Expertise</div>
							<h3 className="text-2xl font-semibold text-gray-900 mb-2">Medical Specialties</h3>
							<p className="text-gray-600">Our facility offers comprehensive coverage across various medical specialties.</p>
						</div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
						<div className="bg-white p-8 rounded-2xl shadow-lg">
							<div className="flex items-center gap-4 mb-4">
								<FaCheckCircle className="w-8 h-8 text-emerald-700" />
								<h3 className="text-xl font-semibold text-gray-900">Advanced Technology</h3>
							</div>
							<p className="text-gray-600">
								Equipped with state-of-the-art medical equipment and modern diagnostic tools for accurate health assessment.
							</p>
						</div>
						<div className="bg-white p-8 rounded-2xl shadow-lg">
							<div className="flex items-center gap-4 mb-4">
								<FaHeart className="w-8 h-8 text-emerald-700" />
								<h3 className="text-xl font-semibold text-gray-900">Compassionate Care</h3>
							</div>
							<p className="text-gray-600">
								Our dedicated team treats every patient with empathy, respect, and individualized attention.
							</p>
						</div>
						<div className="bg-white p-8 rounded-2xl shadow-lg">
							<div className="flex items-center gap-4 mb-4">
								<FaShieldAlt className="w-8 h-8 text-emerald-700" />
								<h3 className="text-xl font-semibold text-gray-900">Data Security</h3>
							</div>
							<p className="text-gray-600">
								Your medical records are protected with advanced encryption and HIPAA-compliant security measures.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Testimonials Section */}
			<section className="min-h-screen py-24 bg-white relative flex items-center mb-[5vh]">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.25),transparent_50%)]"></div>
				<div className="container mx-auto px-4 relative">
					<h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-16">
						What Our Patients Say
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
						{testimonials.slice(0, 4).map((testimonial) => (
							<div key={testimonial.id} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
								<div className="flex items-center mb-4">
									<Image
										src={testimonial.image}
										alt={testimonial.name}
										width={50}
										height={50}
										className="h-15 w-15 rounded-full mr-4"
									/>
									<div>
										<h3 className="text-lg font-semibold text-emerald-900">{testimonial.name}</h3>
										<p className="text-sm text-gray-500">{testimonial.status}</p>
									</div>
								</div>
								<p className="text-gray-600 mb-4">
									{testimonial.testimonial}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Bento Grid Section */}
			<section className="min-h-screen py-24 bg-white relative flex items-center mb-[5vh]">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.25),transparent_50%)]"></div>
				<div className="container mx-auto px-4 relative">
					<h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-16">
						Our{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-emerald-900">
							Services & Resources
						</span>
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
						<div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
							<h3 className="text-xl font-semibold text-emerald-900 mb-6">Services & Treatments</h3>
							<ul className="space-y-3 text-gray-600">
								<li className="flex items-center gap-2">
									<span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
									Preventive Care
								</li>
								<li className="flex items-center gap-2">
									<span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
									Diagnostic Services
								</li>
								<li className="flex items-center gap-2">
									<span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
									Specialized Treatments
								</li>
								<li className="flex items-center gap-2">
									<span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
									Follow-up Care
								</li>
								<li className="flex items-center gap-2">
									<span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
									Emergency Services
								</li>
								<li className="flex items-center gap-2">
									<span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
									Rehabilitation
								</li>
							</ul>
						</div>

						{/* Latest Blog Posts */}
						<div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
							<h3 className="text-xl font-semibold text-emerald-900 mb-6">Latest Blog Posts</h3>
							<div className="space-y-6">
								{featuredArticlesList.map((article) => (
									<div key={article.id} className="group">
										<Link href='/blog'><h4 className="font-medium text-gray-900 group-hover:text-emerald-700 transition-colors duration-300">{article.title}</h4></Link>
										<p className="text-sm text-gray-600">Posted {article.createdAt}</p>
										<p className="text-gray-600 mt-2">{article.excerpt.split(' ').slice(0, 30).join(' ')}...</p>
									</div>
								))}
							</div>
						</div>

						{/* Patient Resources */}
						<div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
							<h3 className="text-xl font-semibold text-emerald-900 mb-6">Patient Resources</h3>
							<ul className="space-y-3 text-gray-600">
								<li className="flex items-center gap-2">
									<span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
									Patient Forms
								</li>
								<li className="flex items-center gap-2">
									<span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
									Medical Records
								</li>
								<li className="flex items-center gap-2">
									<span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
									Patient Appointment Portal
								</li>
							</ul>
						</div>

						{/* Health Tips */}
						<div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
							<h3 className="text-xl font-semibold text-emerald-900 mb-6">Health Tips</h3>
							<ul className="space-y-3 text-gray-600">
								<li className="flex items-center gap-2">
									<span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
									Nutrition Advice
								</li>
								<li className="flex items-center gap-2">
									<span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
									Mental Health
								</li>
								<li className="flex items-center gap-2">
									<span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
									Preventive Care
								</li>
							</ul>
						</div>

						{/* Contact Information */}
						<div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
							<h3 className="text-xl font-semibold text-emerald-900 mb-6">Contact Information</h3>
							<div className="space-y-4 text-gray-600">
								<div className="flex items-center gap-3 group">
									<FaPhone className="w-5 h-5 text-emerald-700 group-hover:scale-110 transition-transform duration-300" />
									<span className="group-hover:text-emerald-700 transition-colors duration-300">+91 70071 46609</span>
								</div>
								<div className="flex items-center gap-3 group">
									<FaMapMarkerAlt className="w-5 h-5 text-emerald-700 group-hover:scale-110 transition-transform duration-300" />
									<span className="group-hover:text-emerald-700 transition-colors duration-300">123 Medical Center Drive</span>
								</div>
								<div className="flex items-center gap-3 group">
									<FaComments className="w-5 h-5 text-emerald-700 group-hover:scale-110 transition-transform duration-300" />
									<span className="group-hover:text-emerald-700 transition-colors duration-300">+91 70071 46609</span>
								</div>
							</div>
						</div>

						{/* Operating Hours */}
						<div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
							<h3 className="text-xl font-semibold text-emerald-900 mb-6">Operating Hours</h3>
							<div className="space-y-3 text-gray-600">
								<div className="flex justify-between items-center group">
									<span className="group-hover:text-emerald-700 transition-colors duration-300">Monday - Friday</span>
									<span className="font-medium group-hover:text-emerald-700 transition-colors duration-300">9:00 AM - 6:00 PM</span>
								</div>
								<div className="flex justify-between items-center group">
									<span className="group-hover:text-emerald-700 transition-colors duration-300">Saturday</span>
									<span className="font-medium group-hover:text-emerald-700 transition-colors duration-300">9:00 AM - 2:00 PM</span>
								</div>
								<div className="flex justify-between items-center group">
									<span className="group-hover:text-emerald-700 transition-colors duration-300">Sunday</span>
									<span className="font-medium group-hover:text-emerald-700 transition-colors duration-300">Closed</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default LandingPage;