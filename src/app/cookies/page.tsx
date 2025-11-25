import Link from 'next/link';
import Footer from '@/components/Footer';

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-[#E5E7EB] backdrop-blur-sm bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center">
              <img src="/LogoSkreeo.png" alt="Skreeo" className="h-8" />
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-[#6B7280] hover:text-[#1F2937] font-medium transition-colors">
                Iniciar Sesión
              </Link>
              <Link href="/pricing" className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Empezar Gratis
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-[#1F2937] mb-8">Política de Cookies</h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-[#6B7280] mb-6">
            Si quieres saber más sobre el uso de cookies que realiza este sitio web <strong>skreeo.com</strong>, estás en el lugar indicado. A continuación, vamos a explicarte qué son exactamente las cookies; qué tipo de cookies utilizamos y para qué; y cómo puedes ejercer tu derecho para configurar tu navegador y desestimar el uso de cualquiera de ellas.
          </p>

          <p className="text-[#6B7280] mb-8">
            Eso sí, debes saber, que si decides no utilizar algunas cookies, este sitio web puede no funcionar perfectamente, afectando a tu experiencia de usuario.
          </p>

          <h2 className="text-2xl font-bold text-[#1F2937] mt-12 mb-4">Qué es una Cookie</h2>

          <p className="text-[#6B7280] mb-6">
            Una cookie es un fichero que se descarga en tu ordenador al acceder a determinadas páginas web o blogs.
          </p>

          <p className="text-[#6B7280] mb-6">
            Las cookies permiten a esa página, entre otras cosas, almacenar y recuperar información sobre tus hábitos de navegación o de tu equipo, y dependiendo de la información que contengan y de la forma en que utilices tu equipo, pueden utilizarse para reconocerte.
          </p>

          <p className="text-[#6B7280] mb-6">
            El navegador del usuario memoriza cookies en el disco duro solamente durante la sesión actual ocupando un espacio de memoria mínimo y no perjudicando al ordenador. Las cookies no contienen ninguna clase de información personal específica, y la mayoría de las mismas se borran del disco duro al finalizar la sesión de navegador (las denominadas cookies de sesión).
          </p>

          <p className="text-[#6B7280] mb-8">
            La mayoría de los navegadores aceptan como estándar a las cookies y, con independencia de las mismas, permiten o impiden en los ajustes de seguridad las cookies temporales o memorizadas.
          </p>

          <h2 className="text-2xl font-bold text-[#1F2937] mt-12 mb-4">Aceptación de las Cookies: Normativa Vigente</h2>

          <p className="text-[#6B7280] mb-6">
            Al acceder a este sitio web, y de acuerdo a la normativa vigente en materia de protección de datos, te informamos del uso de cookies, dándote la opción de aceptarlas expresamente y de acceder a más información a través de esta Política de Cookies.
          </p>

          <p className="text-[#6B7280] mb-6">
            Debes saber que, en el caso de continuar navegando, estarás prestando tu consentimiento para el empleo de estas cookies. Pero, en cualquier momento, podrás cambiar de opinión y bloquear su utilización a través de tu navegador.
          </p>

          <p className="text-[#6B7280] mb-8">
            Esta Política de Cookies podría modificarse en cualquier momento para adaptarse a novedades normativas o cambios en nuestras actividades, siendo vigente la que en cada momento se encuentre publicada en la web.
          </p>

          <h2 className="text-2xl font-bold text-[#1F2937] mt-12 mb-4">Tipos de Cookies</h2>

          <p className="text-[#6B7280] mb-6">
            Para poder ofrecerte una mejor experiencia de usuario, obtener datos analíticos, almacenar y recuperar información sobre tus hábitos de navegación o de tu equipo y desarrollar su actividad, este sitio web <strong>skreeo.com</strong> utiliza cookies propias y de terceros.
          </p>

          <div className="space-y-6 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-[#1F2937] mb-2">Cookies técnicas</h3>
              <p className="text-[#6B7280]">
                Son aquéllas que permiten al usuario la navegación a través de una página web, plataforma o aplicación y la utilización de las diferentes opciones o servicios que en ella existan.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#1F2937] mb-2">Cookies de personalización</h3>
              <p className="text-[#6B7280]">
                Son aquéllas que permiten al usuario acceder al servicio con algunas características de carácter general predefinidas en función de una serie de criterios en el terminal del usuario.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#1F2937] mb-2">Cookies de análisis</h3>
              <p className="text-[#6B7280]">
                Son aquéllas que bien tratadas por nosotros o por terceros, nos permiten cuantificar el número de usuarios y así realizar la medición y análisis estadístico de la utilización que hacen los usuarios del servicio ofertado.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#1F2937] mb-2">Cookies publicitarias</h3>
              <p className="text-[#6B7280]">
                Son aquéllas que, bien tratadas por nosotros o por terceros, nos permiten gestionar de la forma más eficaz posible la oferta de los espacios publicitarios que hay en la página web.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#1F2937] mb-2">Cookies de terceros</h3>
              <p className="text-[#6B7280] mb-4">
                Esta web <strong>skreeo.com</strong> puede utilizar servicios de terceros que, por cuenta de Google, recopilarán información con fines estadísticos, de uso del sitio por parte del usuario y para la prestación de otros servicios relacionados con la actividad del sitio web y otros servicios de Internet.
              </p>
              <p className="text-[#6B7280]">
                En particular, este sitio web utiliza Google Analytics, un servicio analítico de web prestado por Google, Inc. con domicilio en los Estados Unidos con sede central en 1600 Amphitheatre Parkway, Mountain View, California 94043.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-[#1F2937] mt-12 mb-4">Gestionar y Rechazar el Uso de Cookies</h2>

          <p className="text-[#6B7280] mb-6">
            En cualquier momento, puedes adaptar la configuración del navegador para gestionar, desestimar el uso de cookies y ser notificado antes de que se descarguen.
          </p>

          <p className="text-[#6B7280] mb-6">
            Para esto, debes tener en cuenta que tendrás que adaptar por separado la configuración de cada navegador y equipo que utilices ya que, como te hemos comentado anteriormente las cookies se asocian al navegador, no a la persona.
          </p>

          <div className="bg-gray-50 rounded-lg p-6 space-y-3 mb-8">
            <p className="font-semibold text-[#1F2937]">Cómo configurar cookies en tu navegador:</p>
            <ul className="space-y-2 text-[#6B7280]">
              <li>
                <strong>Google Chrome:</strong>{' '}
                <a 
                  href="https://support.google.com/chrome/answer/95647?hl=es-419" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#3B82F6] hover:underline"
                >
                  Ver guía
                </a>
              </li>
              <li>
                <strong>Internet Explorer:</strong>{' '}
                <a 
                  href="https://support.microsoft.com/es-es/help/17442/windows-internet-explorer-delete-manage-cookies" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#3B82F6] hover:underline"
                >
                  Ver guía
                </a>
              </li>
              <li>
                <strong>Mozilla Firefox:</strong>{' '}
                <a 
                  href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#3B82F6] hover:underline"
                >
                  Ver guía
                </a>
              </li>
              <li>
                <strong>Safari:</strong>{' '}
                <a 
                  href="https://support.apple.com/es-es/HT201265" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#3B82F6] hover:underline"
                >
                  Ver guía
                </a>
              </li>
            </ul>
          </div>

          <p className="text-[#6B7280] mb-6">
            Si tienes cualquier duda sobre esta Política de Cookies, puedes contactar con nosotros enviándonos un mail a <a href="mailto:hola@skreeo.com" className="text-[#3B82F6] hover:underline">hola@skreeo.com</a>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
