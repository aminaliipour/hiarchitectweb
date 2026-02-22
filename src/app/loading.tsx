export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-400 mx-auto mb-4"></div>
        <p className="text-white text-lg" style={{ fontFamily: 'Vazirmatn, sans-serif' }}>
          در حال بارگذاری...
        </p>
      </div>
    </div>
  );
}
