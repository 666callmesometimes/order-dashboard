// GET /api/orders - Pobierz wszystkie zamówienia
export async function onRequestGet(context) {
  try {
    const { results } = await context.env.DB.prepare(
      'SELECT * FROM orders ORDER BY createdAt DESC'
    ).all();
    
    // Parsuj items z JSON string na obiekt
    const orders = results.map(order => ({
      ...order,
      items: JSON.parse(order.items),
      price: Number(order.price)
    }));
    
    return new Response(JSON.stringify(orders), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Błąd podczas pobierania zamówień'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// POST /api/orders - Utwórz nowe zamówienie
export async function onRequestPost(context) {
  try {
    const order = await context.request.json();
    
    // Walidacja
    if (!order.orderId || !order.nickname || !order.items || !order.price) {
      return new Response(JSON.stringify({ 
        error: 'Brakuje wymaganych pól: orderId, nickname, items, price' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    await context.env.DB.prepare(
      `INSERT INTO orders (orderId, nickname, profileLink, items, price, status, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      order.orderId,
      order.nickname,
      order.profileLink || '',
      JSON.stringify(order.items),
      Number(order.price),
      order.status || '🎨 W trakcie projektowania',
      order.createdAt || new Date().toISOString()
    ).run();
    
    return new Response(JSON.stringify({ 
      success: true, 
      orderId: order.orderId 
    }), {
      status: 201,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Błąd podczas tworzenia zamówienia'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// OPTIONS dla CORS
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
