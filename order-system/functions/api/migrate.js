// POST /api/migrate - Importuj dane z localStorage
export async function onRequestPost(context) {
  try {
    const { orders } = await context.request.json();
    
    if (!Array.isArray(orders)) {
      return new Response(JSON.stringify({ error: 'Nieprawidłowy format danych' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    let imported = 0;
    let skipped = 0;
    
    for (const order of orders) {
      try {
        await context.env.DB.prepare(
          `INSERT INTO orders (orderId, nickname, profileLink, items, price, status, createdAt)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        ).bind(
          order.orderId,
          order.nickname,
          order.profileLink || '',
          JSON.stringify(order.items),
          Number(order.price),
          order.status,
          order.createdAt
        ).run();
        imported++;
      } catch (e) {
        // Jeśli już istnieje, pomiń
        skipped++;
      }
    }
    
    return new Response(JSON.stringify({ 
      success: true, 
      imported,
      skipped,
      total: orders.length
    }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
