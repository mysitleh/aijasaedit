const Footer = () => {
  return (
    <footer className="w-full py-6 bg-background/80 border-t">
      <div className="container mx-auto px-4 md:px-6 flex justify-center items-center">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} AI Jasa Edit. Hak cipta dilindungi.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
