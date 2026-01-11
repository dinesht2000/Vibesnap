interface SkeletonProps {
  className?: string;
  variant?: "rectangular" | "circular" | "text";
}

export default function Skeleton({ className = "", variant = "rectangular" }: SkeletonProps) {
  const baseClasses = "animate-pulse bg-gray-300";
  
  const variantClasses = {
    rectangular: "rounded",
    circular: "rounded-full",
    text: "rounded h-4",
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} />
  );
}

