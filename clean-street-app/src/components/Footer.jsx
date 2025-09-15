import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} CleanStreet | Keep our environment clean 🌱</p>
    </footer>
  );
}
