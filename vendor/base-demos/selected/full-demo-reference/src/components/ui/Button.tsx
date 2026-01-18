interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isLoading?: boolean;
}

export function Button({ children, className = "", isLoading = false, ...props }: ButtonProps) {
  return (
    <button
      className={`w-full max-w-xs mx-auto block bg-primary text-primary-foreground py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full" />
        </div>
      ) : (
        children
      )}
    </button>
  );
}
