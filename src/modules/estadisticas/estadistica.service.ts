import db from '../../config/db';

export const getGeneralStats = async (): Promise<any> => {
  const [userCount]: any = await db.query('SELECT COUNT(*) as total FROM usuarios');
  const [resourceCount]: any = await db.query('SELECT COUNT(*) as total FROM recursos');
  const [categoryCount]: any = await db.query('SELECT COUNT(*) as total FROM categorias');
  const [downloadCount]: any = await db.query('SELECT COUNT(*) as total FROM descargas');

  return {
    total_usuarios: userCount[0].total,
    total_recursos: resourceCount[0].total,
    total_categorias: categoryCount[0].total,
    total_descargas: downloadCount[0].total,
  };
};

export const getMostDownloadedResources = async (limit: number): Promise<any[]> => {
  const [rows]: any = await db.query(
    `SELECT r.id_recurso, r.titulo, r.url_portada, COUNT(d.id_descarga) as total_descargas, c.nombre_categoria
     FROM recursos r
     LEFT JOIN descargas d ON r.id_recurso = d.id_recurso
     LEFT JOIN categorias c ON r.id_categoria = c.id_categoria
     GROUP BY r.id_recurso, r.titulo, r.url_portada, c.nombre_categoria
     ORDER BY total_descargas DESC
     LIMIT ?`,
    [limit]
  );
  return rows;
};

export const getDownloadsByCategory = async (): Promise<any[]> => {
  const [rows]: any = await db.query(
    `SELECT c.nombre_categoria, COUNT(d.id_descarga) as total_descargas
     FROM categorias c
     LEFT JOIN recursos r ON c.id_categoria = r.id_categoria
     LEFT JOIN descargas d ON r.id_recurso = d.id_recurso
     GROUP BY c.id_categoria, c.nombre_categoria
     ORDER BY total_descargas DESC`
  );
  return rows;
};
