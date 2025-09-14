import "@fortawesome/fontawesome-free/css/all.min.css";

function Footer() {
  return (
    <footer id="footer" className="bg-black text-white py-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

        {/* Logo y redes sooociales */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <img src="/images/NBlogo.png" alt="Logo" className="w-10 h-10" />
            <h2 className="text-lg font-bold">NUBLACK</h2>
          </div>
          <p className="text-sm text-gray-300">
            Tu estilo es esencia, más que presencia.
          </p>
          <div className="flex gap-4 mt-4 text-xl">npm run dev
            <a href="#" className="hover:text-gray-400">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="hover:text-gray-400">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="#" className="hover:text-gray-400">
              <i className="fab fa-whatsapp"></i>
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Productos Para</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-gray-400">Hombres</a></li>
            <li><a href="#" className="hover:text-gray-400">Mujeres</a></li>
            <li><a href="#" className="hover:text-gray-400">Niños</a></li>
            <li><a href="#" className="hover:text-gray-400">Ofertas</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Ayuda</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-gray-400">Centro de Ayuda</a></li>
            <li><a href="#" className="hover:text-gray-400">Envíos</a></li>
            <li><a href="#" className="hover:text-gray-400">Devoluciones</a></li>
            <li><a href="#" className="hover:text-gray-400">Tallas</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Empresa</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-gray-400">Sobre Nosotros</a></li>
            <li><a href="#" className="hover:text-gray-400">Contactos</a></li>
            <li><a href="#" className="hover:text-gray-400">Información Personal</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-4 flex flex-col md:flex-row justify-between text-xs text-gray-400">
        <p>© 2025 NUBLACK. Todos los derechos reservados.</p>
        <div className="flex gap-4 mt-2 md:mt-0">
          <a href="#" className="hover:text-white">Términos de Servicio</a>
          <a href="#" className="hover:text-white">Política de Privacidad</a>
          <a href="#" className="hover:text-white">Cookies</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;