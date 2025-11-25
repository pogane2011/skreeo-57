import Link from 'next/link';
import Footer from '@/components/Footer';

export default function TerminosPage() {
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
        <h1 className="text-4xl font-bold text-[#1F2937] mb-8">Términos y Condiciones de Uso</h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-[#6B7280] mb-8">
            Última actualización: 25 de noviembre de 2025
          </p>

          <p className="text-[#6B7280] mb-8">
            Bienvenido a <strong>Skreeo</strong>. Estos Términos y Condiciones de Uso (en adelante, los "Términos") regulan el acceso y uso de la plataforma Skreeo, propiedad de Miriam Portillo Gómez (en adelante, "Skreeo", "nosotros" o "nuestro"), accesible a través del sitio web <strong>skreeo.com</strong> y sus aplicaciones asociadas.
          </p>

          <p className="text-[#6B7280] mb-8">
            Al registrarse, acceder o utilizar nuestros servicios, usted (en adelante, el "Usuario" o "usted") acepta quedar vinculado por estos Términos. Si no está de acuerdo con estos Términos, no utilice nuestros servicios.
          </p>

          <h2 className="text-2xl font-bold text-[#1F2937] mt-12 mb-4">1. Descripción del Servicio</h2>

          <p className="text-[#6B7280] mb-6">
            Skreeo es una plataforma SaaS (Software as a Service) diseñada para la gestión profesional de flotas de drones, que permite:
          </p>

          <ul className="list-disc pl-6 text-[#6B7280] mb-8 space-y-2">
            <li>Registro de vuelos mediante mensajes de voz a través de Telegram</li>
            <li>Cálculo automático del Coste Total de Propiedad (TCO) de drones y equipamiento</li>
            <li>Gestión de proyectos, pilotos y clientes</li>
            <li>Análisis de rentabilidad y márgenes netos</li>
            <li>Generación de informes y exportación de datos</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#1F2937] mt-12 mb-4">2. Registro y Cuenta de Usuario</h2>

          <p className="text-[#6B7280] mb-6">
            Para utilizar Skreeo, debe crear una cuenta proporcionando información veraz, completa y actualizada. Usted es responsable de:
          </p>

          <ul className="list-disc pl-6 text-[#6B7280] mb-6 space-y-2">
            <li>Mantener la confidencialidad de sus credenciales de acceso</li>
            <li>Todas las actividades que ocurran bajo su cuenta</li>
            <li>Notificarnos inmediatamente de cualquier uso no autorizado</li>
            <li>La veracidad de la información proporcionada durante el registro</li>
          </ul>

          <p className="text-[#6B7280] mb-8">
            Nos reservamos el derecho de suspender o cancelar cuentas que incumplan estos Términos o que contengan información falsa.
          </p>

          <h2 className="text-2xl font-bold text-[#1F2937] mt-12 mb-4">3. Planes y Suscripciones</h2>

          <p className="text-[#6B7280] mb-6">
            Skreeo ofrece diferentes planes de suscripción con características y límites específicos:
          </p>

          <ul className="list-disc pl-6 text-[#6B7280] mb-6 space-y-2">
            <li><strong>DESPEGUE:</strong> Plan individual para pilotos profesionales</li>
            <li><strong>OPERADOR:</strong> Plan para operadoras pequeñas y medianas</li>
            <li><strong>CONTROLADOR:</strong> Plan ilimitado para operadoras grandes</li>
          </ul>

          <p className="text-[#6B7280] mb-6">
            Los precios, características y límites de cada plan están disponibles en nuestra <Link href="/pricing" className="text-[#3B82F6] hover:underline">página de precios</Link>.
          </p>

          <p className="text-[#6B7280] mb-8">
            Las suscripciones se facturan de forma mensual o anual, según la opción seleccionada. Los pagos se procesan a través de <strong>Stripe</strong>, nuestro proveedor de servicios de pago.
          </p>

          <h2 className="text-2xl font-bold text-[#1F2937] mt-12 mb-4">4. Período de Prueba</h2>

          <p className="text-[#6B7280] mb-6">
            Ofrecemos un período de prueba gratuito de <strong>14 días</strong> para todos los planes. Durante este período:
          </p>

          <ul className="list-disc pl-6 text-[#6B7280] mb-6 space-y-2">
            <li>No se requiere tarjeta de crédito para iniciar la prueba</li>
            <li>Tendrás acceso completo a todas las funciones del plan seleccionado</li>
            <li>Puedes cancelar en cualquier momento sin coste alguno</li>
            <li>Al finalizar el período de prueba, se iniciará la facturación automática si proporcionas tus datos de pago</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#1F2937] mt-12 mb-4">5. Pagos y Facturación</h2>

          <p className="text-[#6B7280] mb-6">
            Al suscribirse a un plan de pago, usted acepta:
          </p>

          <ul className="list-disc pl-6 text-[#6B7280] mb-6 space-y-2">
            <li>Proporcionar información de pago válida y actualizada</li>
            <li>Autorizar cargos recurrentes según la frecuencia de facturación elegida</li>
            <li>Que los precios pueden modificarse previa notificación de 30 días</li>
            <li>Que los impuestos aplicables se añadirán según la legislación vigente</li>
          </ul>

          <p className="text-[#6B7280] mb-8">
            En caso de fallo en el pago, nos reservamos el derecho de suspender el acceso a su cuenta hasta que se resuelva el problema.
          </p>

          <h2 className="text-2xl font-bold text-[#1F2937] mt-12 mb-4">6. Cancelación y Reembolsos</h2>

          <p className="text-[#6B7280] mb-6">
            Puede cancelar su suscripción en cualquier momento desde la configuración de su cuenta. Al cancelar:
          </p>

          <ul className="list-disc pl-6 text-[#6B7280] mb-6 space-y-2">
            <li>Mantendrá acceso hasta el final del período de facturación actual</li>
            <li>No se realizarán más cargos después del período actual</li>
            <li>Sus datos se mantendrán durante 30 días para permitir la reactivación</li>
            <li>Pasados 30 días, sus datos serán eliminados de forma permanente</li>
          </ul>

          <p className="text-[#6B7280] mb-8">
            <strong>Política de reembolsos:</strong> No ofrecemos reembolsos por períodos de facturación parcialmente utilizados. Sin embargo, evaluaremos casos excepcionales de forma individual contactando a <a href="mailto:hola@skreeo.com" className="text-[#3B82F6] hover:underline">hola@skreeo.com</a>.
          </p>

          <h2 className="text-2xl font-bold text-[#1F2937] mt-12 mb-4">7. Uso Aceptable</h2>

          <p className="text-[#6B7280] mb-6">
            Al utilizar Skreeo, usted se compromete a:
          </p>

          <ul className="list-disc pl-6 text-[#6B7280] mb-6 space-y-2">
            <li>Utilizar el servicio únicamente para fines legales y profesionales</li>
            <li>No intentar acceder de forma no autorizada a sistemas o datos de otros usuarios</li>
            <li>No utilizar el servicio para transmitir malware, spam o contenido ilegal</li>
            <li>No realizar ingeniería inversa, descompilar o intentar extraer el código fuente</li>
            <li>No revender o redistribuir el servicio sin autorización expresa</li>
            <li>Cumplir con todas las normativas aeronáuticas aplicables en su jurisdicción</li>
          </ul>

          <p className="text-[#6B7280] mb-8">
            El incumplimiento de estas normas puede resultar en la suspensión o cancelación inmediata de su cuenta.
          </p>

          <h2 className="text-2xl font-bold text-[#1F2937] mt-12 mb-4">8. Propiedad Intelectual</h2>

          <p className="text-[#6B7280] mb-6">
            Todos los derechos de propiedad intelectual sobre Skreeo, incluyendo pero no limitado a:
          </p>

          <ul className="list-disc pl-6 text-[#6B7280] mb-6 space-y-2">
            <li>El software, código fuente y documentación</li>
            <li>Diseños, logotipos, marcas y elementos visuales</li>
            <li>Contenido, textos y materiales educativos</li>
            <li>Algoritmos, fórmulas y metodologías de cálculo</li>
          </ul>

          <p className="text-[#6B7280] mb-6">
            Son propiedad exclusiva de Skreeo o sus licenciantes. Estos Términos no otorgan ninguna licencia sobre dichos derechos más allá del uso estrictamente necesario para utilizar el servicio.
          </p>

          <p className="text-[#6B7280] mb-8">
            <strong>Propiedad de sus datos:</strong> Usted retiene la propiedad completa de todos los datos que ingrese en Skreeo (información de vuelos, proyectos, clientes, etc.). Le otorgamos una licencia limitada para almacenar y procesar estos datos con el único fin de prestar el servicio.
          </p>

          <h2 className="text-2xl font-bold text-[#1F2937] mt-12 mb-4">9. Limitación de Responsabilidad</h2>

          <p className="text-[#6B7280] mb-6">
            Skreeo se proporciona "tal cual" y "según disponibilidad". En la medida permitida por la ley:
          </p>

          <ul className="list-disc pl-6 text-[#6B7280] mb-6 space-y-2">
            <li>No garantizamos que el servicio sea ininterrumpido, seguro o libre de errores</li>
            <li>No somos responsables de pérdidas de datos, beneficios o daños indirectos</li>
            <li>Nuestra responsabilidad máxima se limita al importe pagado por usted en los últimos 12 meses</li>
            <li>No somos responsables de decisiones empresariales tomadas basándose en los cálculos proporcionados</li>
            <li>Los cálculos de TCO y rentabilidad son estimaciones basadas en los datos proporcionados por usted</li>
          </ul>

          <p className="text-[#6B7280] mb-8">
            Es su responsabilidad mantener copias de seguridad de sus datos y validar la precisión de los cálculos para sus necesidades específicas.
          </p>

          <h2 className="text-2xl font-bold text-[#1F2937] mt-12 mb-4">10. Modificaciones del Servicio y los Términos</h2>

          <p className="text-[#6B7280] mb-6">
            Nos reservamos el derecho de:
          </p>

          <ul className="list-disc pl-6 text-[#6B7280] mb-6 space-y-2">
            <li>Modificar, suspender o discontinuar cualquier aspecto del servicio</li>
            <li>Actualizar estos Términos en cualquier momento</li>
            <li>Cambiar los precios con 30 días de antelación</li>
          </ul>

          <p className="text-[#6B7280] mb-8">
            Las modificaciones sustanciales de estos Términos se notificarán por correo electrónico. El uso continuado del servicio después de la notificación constituye la aceptación de los nuevos términos.
          </p>

          <h2 className="text-2xl font-bold text-[#1F2937] mt-12 mb-4">11. Ley Aplicable y Jurisdicción</h2>

          <p className="text-[#6B7280] mb-6">
            Estos Términos se rigen por la legislación española. Cualquier disputa relacionada con estos Términos o el uso de Skreeo será sometida a la jurisdicción exclusiva de los Juzgados y Tribunales de <strong>Sevilla, España</strong>.
          </p>

          <h2 className="text-2xl font-bold text-[#1F2937] mt-12 mb-4">12. Contacto</h2>

          <p className="text-[#6B7280] mb-6">
            Si tiene alguna pregunta sobre estos Términos y Condiciones, puede contactarnos en:
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <p className="text-[#6B7280] mb-2">
              <strong>Email:</strong> <a href="mailto:hola@skreeo.com" className="text-[#3B82F6] hover:underline">hola@skreeo.com</a>
            </p>
            <p className="text-[#6B7280] mb-2">
              <strong>Sitio web:</strong> <a href="https://skreeo.com" className="text-[#3B82F6] hover:underline">skreeo.com</a>
            </p>
            <p className="text-[#6B7280]">
              <strong>Responsable:</strong> Miriam Portillo Gómez (DNI 48984333-Z)
            </p>
          </div>

          <p className="text-[#6B7280] text-sm italic">
            Al utilizar Skreeo, usted reconoce que ha leído, comprendido y aceptado estos Términos y Condiciones de Uso.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
