'use client';

import { useRouter } from 'next/navigation';
import AuthLayout from '../components/auth-layout';

export default function AdminOrdersPage() {
	const router = useRouter();

	return (
		<AuthLayout>
			<div className="flex items-center justify-between mb-8">
				<div className="flex items-center space-x-4 space-x-reverse">
					<button
						onClick={() => router.push('/admin')}
						className="flex items-center space-x-2 space-x-reverse text-gray-300 hover:text-[#D4AF37] transition-colors duration-300"
					>
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5m7-7l-7 7 7 7" />
						</svg>
						<span>Back to dashboard</span>
					</button>
					<h1 className="text-3xl font-bold text-[#D4AF37]">Orders</h1>
				</div>
				<button
					onClick={() => router.push('/admin/orders/new')}
					className="bg-[#D4AF37] hover:bg-[#B8941F] text-black px-4 py-2 rounded-lg transition-colors duration-300 font-medium"
				>
					Create order
				</button>
			</div>

			<div className="bg-gray-800/20 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-gray-600/30 text-gray-300">
				Orders management page is not implemented yet.
			</div>
		</AuthLayout>
	);
}
