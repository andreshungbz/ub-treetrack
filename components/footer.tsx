// Footer Component

import "@/styles/footer.css";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <Link
        href="https://github.com/andreshungbz/ub-treetrack"
        className="text-blue-900 underline"
      >
        GitHub Repository
      </Link>
      <span>CodeCraft Solutions &copy; 2024</span>
    </footer>
  );
}
