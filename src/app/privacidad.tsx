import Link from 'next/link';
import Footer from '@/components/Footer';

export default function PrivacidadPage() {
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
        <h1 className="text-4xl font-bold text-[#1F2937] mb-8">Política de Privacidad</h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-[#6B7280] mb-6">
            En <strong>skreeo.com</strong>, propiedad de su representante Miriam Portillo Gómez (en adelante, Skreeo), nos encontramos profundamente comprometidos con el cumplimiento de la normativa española de protección de datos de carácter personal. Por eso, garantizamos el cumplimiento íntegro de las obligaciones dispuestas, así como la implementación de las medidas de seguridad dispuestas en el art. 9 de la Ley 15/1999, de Protección de Datos de Carácter Personal (LOPD) y en el Reglamento de Desarrollo de la LOPD.
          </p>

          <p className="text-[#6B7280] mb-8">
            Por ello, Skreeo informa a los Usuarios de este sitio web de la existencia de un fichero mixto de datos de carácter personal creado por Skreeo bajo su responsabilidad y alojado en los servidores de la empresa <strong>SUPABASE</strong>, empresa que cumple con la normativa Europea de Protección de Datos y cuyos servidores están alojados en Alemania.
          </p>

          <h2 className="text-2xl font-bold text-[#1F2937] mt-12 mb-4">Finalidad</h2>

          <p className="text-[#6B7280] mb-8">
            La finalidad de los datos facilitados a Skreeo es la de recopilar datos personales de interesados, lectores, suscriptores, etc., así como de los comentarios del blog de <strong>skreeo.com</strong>, para el envío de novedades del blog y newsletters con y sin publicidad propia mediante el envío de comunicaciones publicitarias por e-mail, comunidades sociales o cualquier otro medio electrónico o físico, presente o futuro, que posibilite realizar comunicaciones. Dichas comunicaciones serán relacionadas sobre productos o servicios ofrecidos por Skreeo. También se incluye como finalidad de los datos personales la de tramitar encargos, solicitudes o cualquier tipo de petición que sea realizada por un Usuario a través de cualquiera de las formas de contacto que se ponen a disposición del Usuario en el sitio web de skreeo.
          </p>

          <h2 className="text-2xl font-bold text-[#1F2937] mt-12 mb-4">Consentimiento del Usuario</h2>

          <p className="text-[#6B7280] mb-6">
            El uso de cualquier medio de comunicación con Skreeo supone el consentimiento del remitente al tratamiento manual o automatizado de los datos incluidos en cualquier medio de comunicación. El Usuario que envía la información a Skreeo es el único responsable de la veracidad y corrección de los datos incluidos.
          </p>

          <p className="text-[#6B7280] mb-6">
            Los Usuarios garantizan y responden, en cualquier caso, de la exactitud, vigencia y autenticidad de los datos personales facilitados, y se comprometen a mantenerlos debidamente actualizados. El Usuario acepta proporcionar información completa y correcta en el formulario de registro o suscripción.
          </p>

          <p className="text-[#6B7280] mb-8">
            Skreeo no responde de la veracidad de las informaciones que no sean de elaboración propia y de las que se indique otra fuente, por lo que tampoco asume responsabilidad alguna en cuanto a hipotéticos perjuicios que pudieran originarse por el uso de dicha información. Se exonera a Skreeo de responsabilidad ante cualquier daño o perjuicio que pudiera sufrir el Usuario como consecuencia de errores, defectos u omisiones, en la información facilitada por Skreeo siempre que proceda de fuentes ajenas a la misma.
          </p>

          <h2 className="text-2xl font-bold text-[#1F2937] mt-12 mb-4">Cesión de Datos a Terceros</h2>

          <p className="text-[#6B7280] mb-6">
            En Skreeo no cedemos los datos a ningún tercero, salvo en los casos expresamente permitidos por la Ley y en los casos relacionados con el uso de los servicios ofrecidos a través de <strong>skreeo.com</strong>.
          </p>

          <p className="text-[#6B7280] mb-8">
            Salvo en los campos en que expresamente se indique lo contrario, la entrega de información requerida sobre datos personales tendrá el carácter de voluntaria, sin que la negativa a facilitar dicha información implique una merma en la calidad o cantidad de los servicios solicitados. La falta de cumplimentación de los campos determinados como obligatorios o el suministro de datos incorrectos imposibilitará que Skreeo pueda gestionar la solicitud o remitir la información solicitada.
          </p>

          <h2 className="text-2xl font-bold text-[#1F2937] mt-12 mb-4">Derechos de Acceso, Rectificación, Oposición y Cancelación</h2>

          <p className="text-[#6B7280] mb-6">
            Cualquier Usuario podrá ejercitar sus derechos de acceso, rectificación, oposición y cancelación al tratamiento de sus datos personales, en los términos y condiciones previstos en la LOPD.
          </p>

          <p className="text-[#6B7280] mb-6">
            Podrá ejercer dichos derechos dirigiéndose vía correo electrónico a: <a href="mailto:hola@skreeo.com" className="text-[#3B82F6] hover:underline">hola@skreeo.com</a>, con el asunto "Baja - Comunicaciones".
          </p>

          <p className="text-[#6B7280] mb-8">
            Igualmente, cualquier Usuario podrá darse de baja de las comunicaciones también haciendo clic en el apartado "darse de baja" de todos los correos electrónicos remitidos por parte de Skreeo.
          </p>

          <h2 className="text-2xl font-bold text-[#1F2937] mt-12 mb-4">Seguridad</h2>

          <p className="text-[#6B7280] mb-6">
            Skreeo mantiene los niveles de seguridad de protección de datos personales conforme al Real Decreto 994/1999, de 11 de junio, relativo a las medidas de seguridad de los ficheros automatizados que contengan datos de carácter personal, y ha establecido todos los medios técnicos a su alcance para evitar la pérdida, alteración, acceso no autorizado y/o robo de los datos que el Usuario facilite a través del sitio web o de cualquier otro medio de comunicación con Skreeo.
          </p>

          <p className="text-[#6B7280] mb-8">
            El tratamiento de los datos de carácter personal, así como el envío de comunicaciones realizadas por medios electrónicos, son conformes a la Ley Orgánica 15/1999, de 13 de diciembre, de Protección de Datos de Carácter Personal (B.O.E. de 14 de diciembre de 1999) y a la Ley 34/2002, de 11 de julio, de servicios de la Sociedad de Información y de Comercio Electrónico (B.O.E. de 12 de julio de 2002).
          </p>

          <h2 className="text-2xl font-bold text-[#1F2937] mt-12 mb-4">Modificación de la Política de Privacidad</h2>

          <p className="text-[#6B7280] mb-6">
            Skreeo se reserva el derecho a modificar la presente política para adaptarla a futuras novedades legislativas o jurisprudenciales, así como a prácticas de la industria, informando previamente a los Usuarios de los cambios que en ella se produzcan.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
