interface ErrorToastProps {
  error: string;
}

export default function ErrorToast({ error }: ErrorToastProps) {
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm max-w-md">
      {error}
    </div>
  );
}

