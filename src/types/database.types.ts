export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      operadoras: {
        Row: {
          id_operadora: number
          nombre: string
          email: string
          telefono: string | null
          direccion: string | null
          numero_aesa: string | null
          fecha_creacion: string
          activa: boolean
          creditos_disponibles: number
        }
        Insert: {
          id_operadora?: number
          nombre: string
          email: string
          telefono?: string | null
          direccion?: string | null
          numero_aesa?: string | null
          fecha_creacion?: string
          activa?: boolean
          creditos_disponibles?: number
        }
        Update: {
          id_operadora?: number
          nombre?: string
          email?: string
          telefono?: string | null
          direccion?: string | null
          numero_aesa?: string | null
          fecha_creacion?: string
          activa?: boolean
          creditos_disponibles?: number
        }
      }
      pilotos: {
        Row: {
          id_piloto: number
          nombre: string
          email: string
          telefono: string | null
          numero_licencia: string | null
          fecha_expiracion_licencia: string | null
          id_rol: number | null
          telegram_chat_id: string | null
          vuelos_restantes: number
          plan_activo: boolean
          fecha_creacion: string
        }
        Insert: {
          id_piloto?: number
          nombre: string
          email: string
          telefono?: string | null
          numero_licencia?: string | null
          fecha_expiracion_licencia?: string | null
          id_rol?: number | null
          telegram_chat_id?: string | null
          vuelos_restantes?: number
          plan_activo?: boolean
          fecha_creacion?: string
        }
        Update: {
          id_piloto?: number
          nombre?: string
          email?: string
          telefono?: string | null
          numero_licencia?: string | null
          fecha_expiracion_licencia?: string | null
          id_rol?: number | null
          telegram_chat_id?: string | null
          vuelos_restantes?: number
          plan_activo?: boolean
          fecha_creacion?: string
        }
      }
      drones: {
        Row: {
          id_drone: number
          id_operadora: number
          categoria: string | null
          marca_modelo: string
          matricula: string
          numero_serie: string | null
          alias: string | null
          poliza_seguro: string | null
          precio: number | null
          fecha_compra: string | null
          horas_uso: number
          vida_util_estimada: number | null
          activo: boolean
          tco_por_hora: number | null
          fecha_creacion: string
        }
        Insert: {
          id_drone?: number
          id_operadora: number
          categoria?: string | null
          marca_modelo: string
          matricula: string
          numero_serie?: string | null
          alias?: string | null
          poliza_seguro?: string | null
          precio?: number | null
          fecha_compra?: string | null
          horas_uso?: number
          vida_util_estimada?: number | null
          activo?: boolean
          tco_por_hora?: number | null
          fecha_creacion?: string
        }
        Update: {
          id_drone?: number
          id_operadora?: number
          categoria?: string | null
          marca_modelo?: string
          matricula?: string
          numero_serie?: string | null
          alias?: string | null
          poliza_seguro?: string | null
          precio?: number | null
          fecha_compra?: string | null
          horas_uso?: number
          vida_util_estimada?: number | null
          activo?: boolean
          tco_por_hora?: number | null
          fecha_creacion?: string
        }
      }
      proyectos: {
        Row: {
          id_proyecto: number
          id_operadora: number
          id_cliente: number | null
          nombre_proyecto: string
          tipo_trabajo: string | null
          fecha_inicio: string | null
          fecha_cierre: string | null
          estado: string
          ingreso_total: number | null
          margen_neto: number | null
          total_coste_vuelos: number | null
          otros_gastos: number | null
          fecha_creacion: string
        }
        Insert: {
          id_proyecto?: number
          id_operadora: number
          id_cliente?: number | null
          nombre_proyecto: string
          tipo_trabajo?: string | null
          fecha_inicio?: string | null
          fecha_cierre?: string | null
          estado?: string
          ingreso_total?: number | null
          margen_neto?: number | null
          total_coste_vuelos?: number | null
          otros_gastos?: number | null
          fecha_creacion?: string
        }
        Update: {
          id_proyecto?: number
          id_operadora?: number
          id_cliente?: number | null
          nombre_proyecto?: string
          tipo_trabajo?: string | null
          fecha_inicio?: string | null
          fecha_cierre?: string | null
          estado?: string
          ingreso_total?: number | null
          margen_neto?: number | null
          total_coste_vuelos?: number | null
          otros_gastos?: number | null
          fecha_creacion?: string
        }
      }
      vuelos: {
        Row: {
          id_vuelo: number
          id_proyecto: number
          id_drone: number
          id_piloto: number
          fecha_vuelo: string
          duracion_vuelo: number
          id_localizacion: number | null
          notas: string | null
          coste_calculado: number | null
          fecha_creacion: string
        }
        Insert: {
          id_vuelo?: number
          id_proyecto: number
          id_drone: number
          id_piloto: number
          fecha_vuelo: string
          duracion_vuelo: number
          id_localizacion?: number | null
          notas?: string | null
          coste_calculado?: number | null
          fecha_creacion?: string
        }
        Update: {
          id_vuelo?: number
          id_proyecto?: number
          id_drone?: number
          id_piloto?: number
          fecha_vuelo?: string
          duracion_vuelo?: number
          id_localizacion?: number | null
          notas?: string | null
          coste_calculado?: number | null
          fecha_creacion?: string
        }
      }
      clientes: {
        Row: {
          id_cliente: number
          id_operadora: number
          nombre: string
          email: string | null
          telefono: string | null
          direccion: string | null
          nif: string | null
          fecha_creacion: string
        }
        Insert: {
          id_cliente?: number
          id_operadora: number
          nombre: string
          email?: string | null
          telefono?: string | null
          direccion?: string | null
          nif?: string | null
          fecha_creacion?: string
        }
        Update: {
          id_cliente?: number
          id_operadora?: number
          nombre?: string
          email?: string | null
          telefono?: string | null
          direccion?: string | null
          nif?: string | null
          fecha_creacion?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
