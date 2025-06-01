class Objeto {
    constructor(id, nombre, descripcion, fecha_creacion, valor_historico, nro_visitas, ruta_preview,
                epoca_id, ubicacion_actual_id, estado_conservacion_id, procedencia_id, categoria_id, autor_id) {
      this.id = id;
      this.nombre = nombre;
      this.descripcion = descripcion;
      this.fecha_creacion = fecha_creacion;
      this.valor_historico = valor_historico;
      this.nro_visitas = nro_visitas;
      this.ruta_preview = ruta_preview;
      this.epoca_id = epoca_id;
      this.ubicacion_actual_id = ubicacion_actual_id;
      this.estado_conservacion_id = estado_conservacion_id;
      this.procedencia_id = procedencia_id;
      this.categoria_id = categoria_id;
      this.autor_id = autor_id;
    }
  }
  
  module.exports = Objeto;
  