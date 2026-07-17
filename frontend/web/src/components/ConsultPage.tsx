"use client";
import React, { useEffect, useState } from 'react';
import {
	Send,
	Lightbulb,
	AlertTriangle,
	Search,
	Loader2
} from "lucide-react";
import { useRouter } from 'next/navigation';
import { Consult } from '@/types/type';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { smartConsultApi } from '@/apis/apis';

const ConsultPage: React.FC = () => {
	const [symptoms, setSymptoms] = useState('');
	const [analysisResult, setAnalysisResult] = useState<Consult | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const auth = useAuth();
	const { userSession, logout } = auth;

	if (auth && !userSession) {
		logout();
		return (
			<div className="min-h-screen bg-slate-50 flex items-center justify-center">
				<p className="text-xl text-slate-600">Please sign in to continue.</p>
			</div>
		)
	}

	const handleAnalyze = async () => {
		if (!symptoms.trim()) return;

		setIsLoading(true);

		try {
			const response = await smartConsultApi(symptoms);
			
			if(!response.data.success) {
				throw new Error(response.data.error);
			}

			const result: Consult = response.data.consult;
			setAnalysisResult(result);
		} catch (error) {
			toast.error("An error occured: "+error);
		} finally {
			setIsLoading(false);
		}
	};

	const openFindSpecialist = () => {
		router.push('/doctor');
	}

	return (
		<div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased mt-10">
			<main className="container mx-auto px-6 py-16">
				<div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">

					{!analysisResult && (
						<div className="text-center">
							<h2 className="text-3xl font-bold text-slate-900 mb-4">Describe your symptoms</h2>
							<p className="text-slate-600 mb-6">Kindly provide a detailed description of the symptoms you are experiencing.</p>
							<div className="relative">
								<textarea
									value={symptoms}
									onChange={(e) => setSymptoms(e.target.value)}
									rows={4}
									placeholder="I have a sore throat, headache, and a runny nose."
									className="w-full p-4 pr-24 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
								/>
							</div>
							<button
								onClick={handleAnalyze}
								disabled={isLoading}
								className="mt-6 inline-flex items-center justify-center px-8 py-3 bg-emerald-600 text-white font-semibold text-lg rounded-full shadow-lg hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300 transition-all duration-300 disabled:bg-slate-400 cursor-pointer"
							>
								{isLoading ? (
									<>
										<Loader2 className="animate-spin mr-2" />
										Analyzing...
									</>
								) : (
									<>
										Analyze Symptoms
										<Send className="ml-3 w-5 h-5" />
									</>
								)}
							</button>
						</div>
					)}

					{analysisResult && (
						<div>
							<h2 className="text-3xl font-bold text-slate-900 mb-6 pb-4">Analysis Results</h2>

							<div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-l-4 border-emerald-500 p-6 rounded-r-lg mb-6 shadow-sm">
								<div className="flex items-start gap-4">
									<div className="flex-1">
										<p className="text-sm font-semibold text-emerald-700 uppercase tracking-wide">Recommended Specialist</p>
										<h3 className="text-2xl font-bold text-emerald-900 mt-1">{analysisResult.specialist}</h3>
										<p className="text-emerald-600 text-sm mt-2">{analysisResult.description}</p>
										<p className="text-emerald-700 text-sm mt-2">Schedule a consultation for professional evaluation</p>
									</div>
								</div>
							</div>

							<div className="mb-6">
								<h3 className="text-xl font-bold text-slate-800 mb-4">Possible Conditions</h3>
								<div className="space-y-3">
									{analysisResult.predictedConditions.map((cond, index) => (
										<div key={index} className="flex justify-between items-center bg-slate-100 p-3 rounded-lg">
											<span className="font-semibold">{cond.disease}</span>
											<span className={`px-3 py-1 text-sm font-bold rounded-full ${cond.probability === "High" ? 'bg-red-200 text-red-800' :
												cond.probability === "Moderate" ? 'bg-yellow-200 text-yellow-800' :
													'bg-green-200 text-green-800'
												}`}>
												{cond.probability} Probability
											</span>
										</div>
									))}
								</div>
							</div>

							<div className="mb-8">
								<h3 className="text-xl font-bold text-slate-800 mb-4">Suggested Actions</h3>
								<ul className="space-y-2">
									{analysisResult.suggestedActions.map((action, i) => (
										<li key={i} className="flex items-start">
											<Lightbulb className="w-5 h-5 text-emerald-500 mr-3 mt-1 flex-shrink-0" />
											<span className="text-slate-700">{action}</span>
										</li>
									))}
								</ul>
							</div>

							<div className="text-center bg-slate-100 p-6 rounded-xl">
								<h3 className="text-xl font-bold text-slate-900">Ready for the next step?</h3>
								<p className="text-slate-600 mt-2 mb-4">Find a specialist nearby for a professional consultation.</p>
								<button onClick={openFindSpecialist} className="inline-flex items-center justify-center px-6 py-3 bg-emerald-600 text-white cursor-pointer font-semibold rounded-full shadow-md hover:bg-emerald-700">
									<Search className="mr-2" />
									Find Specialists Nearby
								</button>
							</div>
						</div>
					)}
				</div>
			</main>
		</div>
	);
};

export default ConsultPage;