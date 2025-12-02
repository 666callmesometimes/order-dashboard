// GET /api/order/:id - Pobierz jedno zamówienie
export async function onRequestGet(context) {
  try {
    const orderId = context.params.id;
    
    const { results } = await context.env.DB.prepare(
      'SELECT * FROM orders WHERE orderId = ?'
    ).bind(orderId).all();
    
    if (results.length === 0) {
      return new Response(JSON.stringify({ error: 'Zamówienie nie znalezione' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const order = {
      ...results[0],
      items: JSON.parse(results[0].items),
      price: Number(results[0].price)
    };
    
    return new Response(JSON.stringify(order), {
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

// PUT /api/order/:id - Aktualizuj zamówienie
export async function onRequestPut(context) {
  try {
    const orderId = context.params.id;
    const updates = await context.request.json();
    
    await context.env.DB.prepare(
      `UPDATE orders 
       SET nickname = ?, profileLink = ?, items = ?, price = ?, status = ?
       WHERE orderId = ?`
    ).bind(
      updates.nickname,
      updates.profileLink || '',
      JSON.stringify(updates.items),
      Number(updates.price),
      updates.status,
      orderId
    ).run();
    
    return new Response(JSON.stringify({ success: true }), {
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

// DELETE /api/order/:id - Usuń zamówienie
export async function onRequestDelete(context) {
  try {
    const orderId = context.params.id;
    
    await context.env.DB.prepare(
      'DELETE FROM orders WHERE orderId = ?'
    ).bind(orderId).run();
    
    return new Response(JSON.stringify({ success: true }), {
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

// OPTIONS dla CORS
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
