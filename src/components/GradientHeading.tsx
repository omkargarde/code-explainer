interface GradientHeadingProps {
  children: React.ReactNode;
  className?: string;
}

export function GradientHeading({
  children,
  className = "",
}: GradientHeadingProps) {
  return (
    <h1
      className={`bg-linear-to-r from-orange-500 to-orange-700 bg-clip-text font-bold text-transparent uppercase ${className}`}
    >
      {children}
    </h1>
  );
}
