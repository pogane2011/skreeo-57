import Link from 'next/link';
import Footer from '@/components/Footer';

export default function AvisoLegalPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex-shrink-0">
              <img src="/LogoSkreeo.png" alt="Skreeo" className="h-8" />
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-[#6B7280] hover:text-[#1F2937] font-medium">
                Iniciar Sesión
              </Link>
              <Link href="/register" className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Empezar Gratis
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-8 md:p-12">
          
          <h1 className="text-3xl md:text-4xl font-bold text-[#1F2937] mb-8">
            Aviso Legal
          </h1>

          {/* Introducción */}
          <div className="prose prose-gray max-w-none space-y-6 text-[#1F2937]">
            <p className="leading-relaxed">
              <strong>Miriam Portillo Gómez</strong> (DNI 48984333-Z), como responsable del sitio web{' '}
              <strong>skreeo.com</strong>, pone a disposición de los Usuarios este documento con el que 
              pretende dar cumplimiento a las obligaciones dispuestas en la <strong>Ley 34/2002, de Servicios 
              de la Sociedad de la Información y del Comercio Electrónico (LSSI)</strong>, así como informar 
              a todos los Usuarios de cuáles son las condiciones de uso de esta web.
            </p>

            <p className="leading-relaxed">
              Con el término <strong>Usuario</strong> nos referimos a todas las personas que accedan a este 
              sitio web, que se comprometen a cumplir con las disposiciones que aquí se detallan, así como 
              a cualquier otra disposición legal que fuera de aplicación.
            </p>

            <p className="leading-relaxed">
              Miriam Portillo, en adelante <strong>Skreeo</strong>, podrá modificar cualquier tipo de información 
              que pudiera aparecer en este sitio web, sin que exista obligación de preaviso o de poner en 
              conocimiento de los Usuarios dichas obligaciones, entendiéndose suficiente la publicación en 
              el sitio web del prestador.
            </p>

            {/* RESPONSABILIDAD */}
            <h2 className="text-2xl font-bold text-[#1F2937] mt-10 mb-4 pt-6 border-t border-[#E5E7EB]">
              Responsabilidad
            </h2>

            <p className="leading-relaxed">
              Skreeo queda eximida de cualquier tipo de responsabilidad derivada de la información publicada 
              en este sitio web, siempre que esta información haya sido manipulada o introducida por un tercero 
              ajeno al mismo.
            </p>

            <p className="leading-relaxed">
              Desde el sitio web <strong>Skreeo</strong> es posible que se redirija a contenidos de terceros 
              sitios web. Dado que Skreeo no puede controlar siempre los contenidos introducidos por los terceros 
              en sus sitios web, éste no asume ningún tipo de responsabilidad respecto a dichos contenidos. En 
              todo caso, desde Skreeo nos comprometemos a que, en el momento de tener conocimiento directo, 
              procederemos a la retirada inmediata de cualquier contenido que consideremos que pudiera contravenir 
              la legislación nacional o internacional, la moral o el orden público, retirando inmediatamente la 
              redirección a dicho sitio web y poniendo en conocimiento de las autoridades competentes el contenido 
              en cuestión.
            </p>

            <p className="leading-relaxed">
              Skreeo no se hace responsable de la información y contenidos almacenados en cualquier medio que 
              permita a terceros publicar contenidos de forma independiente en la página web del prestador. No 
              obstante, y en cumplimiento de lo dispuesto en el art. 11 y 16 de la LSSI, Skreeo se pone a 
              disposición de los usuarios, autoridades y fuerzas de seguridad, colaborando de forma activa en 
              la retirada o en su caso bloqueo de todos aquellos contenidos que pudieran afectar o contravenir 
              la legislación nacional, o internacional, derechos de terceros o la moral y el orden público. En 
              caso de que un Usuario considere que existe en el sitio web algún contenido que pudiera ser 
              susceptible de esta clasificación, se ruega lo notifique de forma inmediata al administrador de 
              este sitio web.
            </p>

            <p className="leading-relaxed">
              Este sitio web ha sido revisado y probado para que funcione correctamente. En principio, puede 
              garantizarse el correcto funcionamiento los 365 días del año, 24 horas al día. No obstante, Skreeo 
              no descarta la posibilidad de que existan ciertos errores de programación o que acontezcan causas 
              de fuerza mayor, catástrofes naturales, huelgas, o circunstancias semejantes que hagan imposible 
              el acceso a la página web.
            </p>

            {/* PROPIEDAD INTELECTUAL */}
            <h2 className="text-2xl font-bold text-[#1F2937] mt-10 mb-4 pt-6 border-t border-[#E5E7EB]">
              Propiedad Intelectual e Industrial
            </h2>

            <p className="leading-relaxed">
              Este sitio web, incluyendo su programación, edición, compilación y demás elementos necesarios 
              para su funcionamiento, los diseños, logotipos, texto y/o gráficos son propiedad de Skreeo o, 
              en su caso, dispone de licencia o autorización expresa por parte de los autores.
            </p>

            <p className="leading-relaxed">
              Todos los contenidos del sitio web se encuentran debidamente protegidos por la normativa de 
              propiedad intelectual e industrial.
            </p>

            <p className="leading-relaxed">
              Independientemente de la finalidad para la que fueran destinados, la reproducción total o parcial, 
              uso, explotación, distribución y comercialización, requiere en todo caso de la autorización previa 
              por escrito de Skreeo. Cualquier uso no autorizado previamente por parte de Skreeo será considerado 
              una infracción de los derechos de propiedad intelectual o industrial del autor.
            </p>

            <p className="leading-relaxed">
              Los diseños, logotipos, texto y/o gráficos ajenos a Skreeo y que pudieran aparecer en el sitio 
              web pertenecen a sus respectivos propietarios, siendo ellos mismos responsables de cualquier posible 
              controversia que pudiera suscitarse respecto a los mismos. En todo caso, Skreeo cuenta con la 
              autorización expresa y previa por parte de los mismos. Skreeo autoriza expresamente a que terceros 
              puedan redirigir directamente a los contenidos concretos del sitio web, debiendo en todo caso 
              redirigir al sitio web principal de Skreeo.
            </p>

            <p className="leading-relaxed">
              Si crees que podemos estar incumpliendo derechos de propiedad intelectual o industrial con alguno 
              de los contenidos de nuestro sitio web, te rogamos que nos lo comuniques al siguiente correo 
              electrónico:{' '}
              <a href="mailto:hola@skreeo.com" className="text-[#3B82F6] hover:text-[#2563EB] font-medium">
                hola@skreeo.com
              </a>
            </p>

            {/* LEY APLICABLE */}
            <h2 className="text-2xl font-bold text-[#1F2937] mt-10 mb-4 pt-6 border-t border-[#E5E7EB]">
              Ley Aplicable y Jurisdicción
            </h2>

            <p className="leading-relaxed">
              Para la resolución de todas las controversias o cuestiones relacionadas con el presente sitio 
              web o de las actividades en él desarrolladas, será de aplicación la legislación española, a la 
              que se someten expresamente las partes, siendo competentes para la resolución de todos los conflictos 
              derivados o relacionados con su uso los Juzgados y Tribunales de Sevilla.
            </p>

            {/* Contacto */}
            <div className="bg-[#F8FAFC] rounded-lg p-6 mt-10">
              <h3 className="text-lg font-semibold text-[#1F2937] mb-2">
                Datos de contacto
              </h3>
              <div className="text-[#6B7280] space-y-1">
                <p><strong>Responsable:</strong> Miriam Portillo Gómez</p>
                <p><strong>DNI:</strong> 48984333-Z</p>
                <p><strong>Email:</strong>{' '}
                  <a href="mailto:hola@skreeo.com" className="text-[#3B82F6] hover:text-[#2563EB]">
                    hola@skreeo.com
                  </a>
                </p>
                <p><strong>Web:</strong>{' '}
                  <a href="https://skreeo.com" className="text-[#3B82F6] hover:text-[#2563EB]">
                    skreeo.com
                  </a>
                </p>
              </div>
            </div>

            <p className="text-sm text-[#9CA3AF] mt-8 pt-6 border-t border-[#E5E7EB]">
              Última actualización: {new Date().toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>

          </div>
        </div>

        {/* Botón volver */}
        <div className="mt-8 text-center">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-[#6B7280] hover:text-[#1F2937] font-medium transition-colors"
          >
            ← Volver a la página principal
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
