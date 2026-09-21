import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-primary text-secondary py-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm">
          IBIKGAMES &copy; 2026
        </p>
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-muted-light text-sm hover:text-secondary transition-colors duration-100"
          >
            Home
          </Link>
          <Link
            href="/#about"
            className="text-muted-light text-sm hover:text-secondary transition-colors duration-100"
          >
            About
          </Link>
          <Link
            href="/#services"
            className="text-muted-light text-sm hover:text-secondary transition-colors duration-100"
          >
            Services
          </Link>
        </div>
      </div>
    </footer>
  );
}
